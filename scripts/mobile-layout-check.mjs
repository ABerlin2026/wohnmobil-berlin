#!/usr/bin/env node
/**
 * Mobile layout regression check.
 *
 * Boots the production preview (or a user-supplied BASE_URL), navigates every
 * public route at a range of phone widths, and reports any element whose
 * bounding box extends past the viewport's right edge. Optionally captures
 * a full-page screenshot per (route × width) for visual diffing.
 *
 * Usage:
 *   node scripts/mobile-layout-check.mjs                # build + preview + check
 *   BASE_URL=https://wohnmobil-berlin.de \
 *     node scripts/mobile-layout-check.mjs              # check a live URL
 *   SCREENSHOTS=1 node scripts/mobile-layout-check.mjs  # also save PNGs
 *
 * Exit code is non-zero when any overflow is detected, so this can be wired
 * into CI as a layout regression gate.
 *
 * Playwright is loaded via `npx playwright` on demand; nothing is added to
 * the project's runtime dependencies.
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const ROUTES = [
  "/",
  "/empfehlen",
  "/wohnmobil-brandenburg",
  "/impressum",
  "/datenschutz",
  "/agb",
  "/unsubscribe",
  "/nonexistent-404",
];

const WIDTHS = [320, 360, 390, 414, 430, 480];
const HEIGHT = 800;
// Elements may legitimately overhang by sub-pixel rounding; ignore < 0.5px.
const TOLERANCE_PX = 0.5;

const OUT_DIR = resolve(ROOT, "mobile-layout-report");
const SHOTS_DIR = resolve(OUT_DIR, "screenshots");
const TAKE_SHOTS = process.env.SCREENSHOTS === "1";

function log(...args) {
  console.log("[mobile-check]", ...args);
}

async function ensurePlaywright() {
  const require = createRequire(import.meta.url);
  try {
    return require("playwright");
  } catch {
    log("Installing playwright (one-time)…");
    await run("npx", ["--yes", "playwright@1.48.0", "install", "chromium"], {
      stdio: "inherit",
    });
    // Re-resolve after install via npx cache.
    return (await import("playwright")).default ?? (await import("playwright"));
  }
}

function run(cmd, args, opts = {}) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { cwd: ROOT, ...opts });
    p.on("exit", (code) =>
      code === 0 ? res() : rej(new Error(`${cmd} ${args.join(" ")} exited ${code}`)),
    );
    p.on("error", rej);
  });
}

function spawnServer() {
  log("Building preview bundle…");
  return run("npx", ["vite", "build"], { stdio: "inherit" }).then(() => {
    log("Starting vite preview on :4173…");
    const proc = spawn("npx", ["vite", "preview", "--port", "4173", "--strictPort"], {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
    });
    return new Promise((res, rej) => {
      const timeout = setTimeout(() => rej(new Error("preview did not start")), 30_000);
      proc.stdout.on("data", (b) => {
        const s = b.toString();
        process.stdout.write(s);
        if (s.includes("Local:")) {
          clearTimeout(timeout);
          res(proc);
        }
      });
      proc.stderr.on("data", (b) => process.stderr.write(b));
      proc.on("exit", (c) => rej(new Error(`preview exited early (${c})`)));
    });
  });
}

async function findOverflows(page, vw) {
  return page.evaluate(
    ({ vw, tol }) => {
      const out = [];
      const els = document.querySelectorAll("body *");
      for (const el of els) {
        // Skip invisible nodes.
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (r.right > vw + tol) {
          out.push({
            tag: el.tagName.toLowerCase(),
            className: typeof el.className === "string" ? el.className.slice(0, 120) : "",
            id: el.id || "",
            right: Math.round(r.right * 10) / 10,
            width: Math.round(r.width * 10) / 10,
            overflowBy: Math.round((r.right - vw) * 10) / 10,
            text: (el.textContent || "").trim().slice(0, 80),
          });
        }
      }
      return {
        vw,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        overflows: out.slice(0, 30),
        totalOverflows: out.length,
      };
    },
    { vw, tol: TOLERANCE_PX },
  );
}

async function main() {
  const baseUrl = process.env.BASE_URL;
  let server;
  let url = baseUrl;
  if (!url) {
    server = await spawnServer();
    url = "http://localhost:4173";
  } else {
    log(`Using external BASE_URL=${url}`);
  }

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(SHOTS_DIR, { recursive: true });

  const { chromium } = await ensurePlaywright();
  const browser = await chromium.launch();
  const results = [];
  let failed = 0;

  try {
    for (const w of WIDTHS) {
      const context = await browser.newContext({
        viewport: { width: w, height: HEIGHT },
        deviceScaleFactor: 2,
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 " +
          "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      });
      const page = await context.newPage();
      for (const route of ROUTES) {
        const target = url.replace(/\/$/, "") + route;
        try {
          await page.goto(target, { waitUntil: "networkidle", timeout: 20_000 });
        } catch (e) {
          // SPA: fall back to load event.
          await page.goto(target, { waitUntil: "load", timeout: 20_000 });
        }
        // Allow lazy components / fonts to settle.
        await page.waitForTimeout(400);
        const report = await findOverflows(page, w);
        const status = report.totalOverflows === 0 ? "✓" : "✗";
        log(`${status} ${w}px ${route} — ${report.totalOverflows} overflow(s)`);
        if (report.totalOverflows > 0) failed += report.totalOverflows;

        if (TAKE_SHOTS) {
          const name = `${w}_${route.replace(/[^a-z0-9]+/gi, "-") || "root"}.png`;
          await page.screenshot({
            path: resolve(SHOTS_DIR, name),
            fullPage: true,
          });
        }
        results.push({ route, ...report });
      }
      await context.close();
    }
  } finally {
    await browser.close();
    if (server) server.kill();
  }

  await writeFile(
    resolve(OUT_DIR, "report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), widths: WIDTHS, results }, null, 2),
  );
  log(`Report written to ${OUT_DIR}/report.json`);
  if (failed > 0) {
    log(`FAILED: ${failed} overflowing element(s) detected.`);
    process.exit(1);
  } else {
    log("All routes clean across all widths. ✅");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

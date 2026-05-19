# Mobile Layout Regression

Automatischer Check, der jede öffentliche Route bei mehreren Smartphone-Breiten
(320, 360, 390, 414, 430, 480 px) lädt und alle Elemente meldet, die über den
rechten Viewport-Rand hinausragen. Zusätzlich werden auf Wunsch Full-Page-
Screenshots pro Route × Breite gespeichert, um visuelle Regressionen per Diff
zu erkennen.

## Ausführen

```bash
# 1) Baut die App, startet `vite preview` und prüft lokal:
node scripts/mobile-layout-check.mjs

# 2) Zusätzlich Screenshots aufnehmen (Ausgabe: mobile-layout-report/screenshots/):
SCREENSHOTS=1 node scripts/mobile-layout-check.mjs

# 3) Gegen eine deployte URL prüfen:
BASE_URL=https://wohnmobil-berlin.de node scripts/mobile-layout-check.mjs
```

Beim ersten Lauf wird Playwright + Chromium über `npx` installiert. Es werden
keine Runtime-Dependencies zum Projekt hinzugefügt.

## Exit-Codes

- `0` — keine Überläufe gefunden.
- `1` — mindestens ein Element ragt über den Viewport hinaus → siehe
  `mobile-layout-report/report.json` für Details (Tag, Klasse, Text, `overflowBy`).

So lässt sich das Skript als Layout-Regression-Gate in CI einbinden.

## Routen & Breiten anpassen

Im Skript-Kopf von `scripts/mobile-layout-check.mjs`:

```js
const ROUTES = [ "/", "/empfehlen", ... ];
const WIDTHS = [320, 360, 390, 414, 430, 480];
```

Neue Routen einfach ergänzen, wenn die App wächst.

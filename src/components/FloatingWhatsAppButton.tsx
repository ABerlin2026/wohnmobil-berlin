import { useLanguage } from "@/i18n/LanguageContext";
import { WHATSAPP_URL } from "@/lib/contact";

/**
 * Floating WhatsApp button shown ONLY on smartphone-sized viewports
 * (< 768px). Hidden on tablet and desktop via Tailwind's `md:hidden`.
 *
 * Sticks to the bottom-right corner across all routes (mounted in App.tsx).
 * Uses the official WhatsApp green via the existing `--whatsapp` design token.
 */
const FloatingWhatsAppButton = () => {
  const { t } = useLanguage();

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.floatingWhatsapp.aria}
      className="md:hidden fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-2xl shadow-whatsapp/40 ring-4 ring-whatsapp/20 transition-transform active:scale-95 hover:scale-105 animate-pulse-slow"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
    >
      {/* Official WhatsApp glyph (inline SVG so we don't pull in a new icon package) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="h-7 w-7"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.847 0 2.521-.515 2.851-1.404.116-.302.116-.56.087-.87-.16-.272-2.522-1.388-2.823-1.388zM16.077 26.8a10.45 10.45 0 0 1-5.687-1.668l-3.978 1.039 1.063-3.881a10.43 10.43 0 0 1-2.06-6.215c0-5.792 4.717-10.508 10.51-10.508s10.508 4.716 10.508 10.508-4.716 10.508-10.51 10.508zm0-23.196c-7.013 0-12.71 5.696-12.71 12.71 0 2.302.612 4.518 1.781 6.466L3 28.802l5.18-1.353a12.7 12.7 0 0 0 6.072 1.547h.007c7.012 0 12.71-5.697 12.71-12.71 0-3.394-1.327-6.595-3.726-9.005a12.78 12.78 0 0 0-9.16-3.677z" />
      </svg>
    </a>
  );
};

export default FloatingWhatsAppButton;

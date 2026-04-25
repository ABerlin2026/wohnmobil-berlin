/**
 * Central contact constants. Update the phone number here to change it
 * everywhere (WhatsApp, Telegram, "Anrufen" button and pre-filled messages).
 *
 * Format: international, digits only, no leading "+" (used in tel:, wa.me, t.me).
 */
export const PHONE_NUMBER = "491731980777";

/** Contact email address (used in mailto: links and legal pages). */
export const CONTACT_EMAIL = "info@wohnmobil-berlin.de";
export const EMAIL_URL = `mailto:${CONTACT_EMAIL}`;

const WHATSAPP_TEXT_DE =
  "Hallo, ich interessiere mich für den Wohnmobil Berlin Brandenburg. Ist das Wohnmobil im gewünschten Zeitraum verfügbar?";

export const WHATSAPP_URL = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT_DE)}`;
export const TELEGRAM_URL = `https://t.me/+${PHONE_NUMBER}`;
export const PHONE_URL = `tel:+${PHONE_NUMBER}`;

/** Minimum driver age (insurance requirement). */
export const MIN_DRIVER_AGE = 30;

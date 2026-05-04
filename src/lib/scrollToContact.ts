/**
 * Scrolls to the contact form and focuses the name input.
 * Used by all "Jetzt anfragen" CTAs across the site so users land
 * directly on the first input field instead of the section header.
 */
export const scrollToContactName = () => {
  requestAnimationFrame(() => {
    const nameField = document.getElementById("contact-name") as HTMLInputElement | null;
    const target = nameField ?? document.getElementById("kontakt");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => nameField?.focus({ preventScroll: true }), 600);
  });
};

/**
 * Scrolls to the contact form and focuses the name input.
 * Used by all "Jetzt anfragen" CTAs across the site so users land
 * directly on the first input field instead of the section header.
 */
export const scrollToContactName = () => {
  requestAnimationFrame(() => {
    const firstNameField = document.getElementById("contact-firstname") as HTMLInputElement | null;
    const target = firstNameField ?? document.getElementById("kontakt");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => firstNameField?.focus({ preventScroll: true }), 600);
  });
};

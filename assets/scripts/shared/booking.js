// Replace this URL with your live booking page before deploying.
export const BOOKING_URL = "https://calendly.com/pataky02/intro-call";

export function initBookingLinks() {
  document.querySelectorAll("[data-booking-link]").forEach((element) => {
    if (!(element instanceof HTMLAnchorElement)) return;
    element.href = BOOKING_URL;
    element.target = "_blank";
    element.rel = "noopener noreferrer";
  });
}

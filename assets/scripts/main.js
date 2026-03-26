import { translations } from "./data/translations.js";
import { initBookingLinks } from "./shared/booking.js";
import { initContactForm } from "./shared/contact-form.js";
import { initI18n } from "./shared/i18n.js";
import { initMobileNav } from "./shared/nav.js";
import { initTheme } from "./shared/theme.js";

const theme = initTheme();
const i18n = initI18n({ translations });

theme.setLabelResolver((currentTheme) =>
  i18n.t(currentTheme === "dark" ? "theme.switchToLight" : "theme.switchToDark")
);

const navToggle = document.getElementById("navToggle");
if (navToggle) {
  const syncNavLabel = () => navToggle.setAttribute("aria-label", i18n.t("nav.toggle"));
  syncNavLabel();
  document.addEventListener("app:languagechange", syncNavLabel);
}

initMobileNav();
initBookingLinks();
initContactForm({ t: i18n.t });

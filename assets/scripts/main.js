import { translations } from "./data/translations.js";
import { initBookingLinks } from "./shared/booking.js";
import { initContactForm } from "./shared/contact-form.js";
import { initCurrency } from "./shared/currency.js";
import { initI18n } from "./shared/i18n.js";
import { initMobileNav } from "./shared/nav.js";
import { initTheme } from "./shared/theme.js";

const theme = initTheme();
const i18n = initI18n({ translations });
const currency = initCurrency({ getLanguage: i18n.getLanguage, t: i18n.t });

theme.setLabelResolver((currentTheme) =>
  i18n.t(currentTheme === "dark" ? "theme.switchToLight" : "theme.switchToDark")
);

const mobileNav = initMobileNav({
  getToggleLabel: (isOpen) => i18n.t(isOpen ? "nav.close" : "nav.open")
});
document.addEventListener("app:languagechange", () => mobileNav?.syncToggleLabel());

initBookingLinks();
initContactForm({ t: i18n.t, getCurrency: currency.getCurrency });

import { translations } from "./data/translations.js";
import { initCurrency } from "./shared/currency.js";
import { initI18n } from "./shared/i18n.js";
import { initTheme } from "./shared/theme.js";

const theme = initTheme();
const i18n = initI18n({ translations });
initCurrency({ getLanguage: i18n.getLanguage, t: i18n.t });

theme.setLabelResolver((currentTheme) =>
  i18n.t(currentTheme === "dark" ? "theme.switchToLight" : "theme.switchToDark")
);
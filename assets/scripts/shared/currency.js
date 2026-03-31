const CURRENCY_KEY = "currency";
const SUPPORTED_CURRENCIES = ["EUR", "HUF"];

export function initCurrency({ getLanguage, t }) {
  const currencyButtons = Array.from(document.querySelectorAll("[data-currency-btn]"));
  const state = {
    currentCurrency: resolveInitialCurrency()
  };

  function isSupportedCurrency(currency) {
    return SUPPORTED_CURRENCIES.includes(currency);
  }

  function getStoredCurrency() {
    try {
      const saved = localStorage.getItem(CURRENCY_KEY)?.toUpperCase() || "";
      return isSupportedCurrency(saved) ? saved : "";
    } catch {
      return "";
    }
  }

  function persistCurrency(currency) {
    try {
      localStorage.setItem(CURRENCY_KEY, currency);
    } catch {
      // Ignore storage errors so the UI still works in-memory.
    }
  }

  function detectBrowserCurrency() {
    const browserLocale =
      navigator.languages?.[0]?.toLowerCase() || navigator.language?.toLowerCase() || "";
    return browserLocale.startsWith("hu") ? "HUF" : "EUR";
  }

  function resolveCurrencyFromLanguage() {
    return getLanguage?.() === "hu" ? "HUF" : "EUR";
  }

  function resolveInitialCurrency() {
    const storedCurrency = getStoredCurrency();
    if (storedCurrency) return storedCurrency;

    const derivedCurrency = resolveCurrencyFromLanguage();
    if (isSupportedCurrency(derivedCurrency)) {
      persistCurrency(derivedCurrency);
      return derivedCurrency;
    }

    const detectedCurrency = detectBrowserCurrency();
    persistCurrency(detectedCurrency);
    return detectedCurrency;
  }

  function updateButtonLabels() {
    currencyButtons.forEach((button) => {
      const currency = button.getAttribute("data-currency-btn");
      if (!currency) return;
      const labelKey = currency === "HUF" ? "currency.option.huf" : "currency.option.eur";
      button.setAttribute("aria-label", t(labelKey));
    });
  }

  function applyCurrency() {
    updateButtonLabels();

    currencyButtons.forEach((button) => {
      const isActive = button.getAttribute("data-currency-btn") === state.currentCurrency;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    document.dispatchEvent(
      new CustomEvent("app:currencychange", {
        detail: { currency: state.currentCurrency }
      })
    );
  }

  function setCurrency(currency) {
    const normalizedCurrency = currency?.toUpperCase() || "";
    if (!isSupportedCurrency(normalizedCurrency)) return;
    state.currentCurrency = normalizedCurrency;
    persistCurrency(normalizedCurrency);
    applyCurrency();
  }

  currencyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const currency = button.getAttribute("data-currency-btn");
      if (currency) setCurrency(currency);
    });
  });

  document.addEventListener("app:languagechange", updateButtonLabels);
  applyCurrency();

  return {
    getCurrency: () => state.currentCurrency,
    setCurrency
  };
}
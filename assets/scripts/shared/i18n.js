const LANGUAGE_KEY = "language";

export function initI18n({ translations, defaultLanguage = "en" }) {
  const langButtons = Array.from(document.querySelectorAll("[data-lang-btn]"));
  const state = {
    currentLanguage: resolveInitialLanguage(defaultLanguage)
  };

  function isSupportedLanguage(language) {
    return Boolean(language && translations[language]);
  }

  function getStoredLanguage() {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      return isSupportedLanguage(saved) ? saved : "";
    } catch {
      return "";
    }
  }

  function persistLanguage(language) {
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      // Ignore storage errors so language switching still works in-memory.
    }
  }

  function getQueryLanguage() {
    const language =
      new URLSearchParams(window.location.search).get("lang")?.trim().toLowerCase() || "";
    return isSupportedLanguage(language) ? language : "";
  }

  function detectBrowserLanguage(fallback) {
    const browserLanguage = navigator.language?.toLowerCase() || "";
    if (browserLanguage.startsWith("hu") && isSupportedLanguage("hu")) return "hu";
    if (isSupportedLanguage("en")) return "en";
    return fallback;
  }

  function resolveInitialLanguage(fallback) {
    const resolvedFallback = isSupportedLanguage(fallback)
      ? fallback
      : Object.keys(translations)[0] || "en";

    const queryLanguage = getQueryLanguage();
    if (queryLanguage) {
      persistLanguage(queryLanguage);
      return queryLanguage;
    }

    const storedLanguage = getStoredLanguage();
    if (storedLanguage) return storedLanguage;

    const detectedLanguage = detectBrowserLanguage(resolvedFallback);
    persistLanguage(detectedLanguage);
    return detectedLanguage;
  }

  function t(key) {
    return (
      translations[state.currentLanguage]?.[key] ??
      translations.en?.[key] ??
      translations[defaultLanguage]?.[key] ??
      key
    );
  }

  function applyTranslations() {
    document.documentElement.lang = state.currentLanguage;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (!key) return;
      if (element.getAttribute("data-i18n-attr-only") === "true") return;
      element.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      if (!key) return;
      element.setAttribute("placeholder", t(key));
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      const attribute = element.getAttribute("data-i18n-attr");
      const key = element.getAttribute("data-i18n");
      if (!attribute || !key) return;
      element.setAttribute(attribute, t(key));
    });

    langButtons.forEach((button) => {
      const isActive = button.getAttribute("data-lang-btn") === state.currentLanguage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    document.dispatchEvent(
      new CustomEvent("app:languagechange", {
        detail: { language: state.currentLanguage }
      })
    );
  }

  function setLanguage(language) {
    if (!isSupportedLanguage(language)) return;
    state.currentLanguage = language;
    persistLanguage(language);
    applyTranslations();
  }

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const language = button.getAttribute("data-lang-btn");
      if (language) setLanguage(language);
    });
  });

  applyTranslations();

  return {
    getLanguage: () => state.currentLanguage,
    setLanguage,
    t
  };
}

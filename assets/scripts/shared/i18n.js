const LANGUAGE_KEY = "language";

export function initI18n({ translations, defaultLanguage = "hu" }) {
  const langButtons = Array.from(document.querySelectorAll("[data-lang-btn]"));
  const state = {
    currentLanguage: getSavedLanguage(defaultLanguage)
  };

  function getSavedLanguage(fallback) {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return saved && translations[saved] ? saved : fallback;
  }

  function t(key) {
    return translations[state.currentLanguage]?.[key] ?? translations.en?.[key] ?? key;
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
    if (!translations[language]) return;
    state.currentLanguage = language;
    localStorage.setItem(LANGUAGE_KEY, language);
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

const THEME_KEY = "theme";

export function initTheme() {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  let labelResolver = null;

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function updateThemeLabel() {
    if (!themeToggle) return;
    const currentTheme = body.getAttribute("data-theme") || "dark";
    const fallbackLabel =
      currentTheme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    themeToggle.setAttribute(
      "aria-label",
      typeof labelResolver === "function" ? labelResolver(currentTheme) : fallbackLabel
    );
  }

  function applyTheme(theme) {
    body.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeLabel();
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
    });
  }

  return {
    getTheme: () => body.getAttribute("data-theme") || "dark",
    setLabelResolver(resolver) {
      labelResolver = resolver;
      updateThemeLabel();
    }
  };
}

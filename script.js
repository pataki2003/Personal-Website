const themeToggle = document.getElementById("themeToggle");
const body = document.body;

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    body.setAttribute("data-theme", savedTheme);
} else {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    body.setAttribute("data-theme", prefersLight ? "light" : "dark");
}

updateThemeAriaLabel();

themeToggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    updateThemeAriaLabel();
});

function updateThemeAriaLabel() {
    const currentTheme = body.getAttribute("data-theme");

    if (currentTheme === "dark") {
        themeToggle.setAttribute("aria-label", "Switch to light theme");
    } else {
        themeToggle.setAttribute("aria-label", "Switch to dark theme");
    }
}
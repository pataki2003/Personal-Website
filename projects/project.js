const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const navToggle = document.getElementById("navToggle");
const projectNav = document.getElementById("projectNav");
const navLinks = document.querySelectorAll(".project-nav a");

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  body.setAttribute("data-theme", savedTheme);
} else {
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  body.setAttribute("data-theme", prefersLight ? "light" : "dark");
}

updateThemeAriaLabel();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    updateThemeAriaLabel();
  });
}

function updateThemeAriaLabel() {
  const currentTheme = body.getAttribute("data-theme");

  if (!themeToggle) return;

  if (currentTheme === "dark") {
    themeToggle.setAttribute("aria-label", "Switch to light theme");
  } else {
    themeToggle.setAttribute("aria-label", "Switch to dark theme");
  }
}

/* MOBILE NAV */
if (navToggle && projectNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = projectNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      projectNav.classList.remove("is-open");
      navToggle.classList.remove("is-active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      projectNav.classList.remove("is-open");
      navToggle.classList.remove("is-active");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = projectNav.contains(event.target);
    const clickedToggle = navToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle && projectNav.classList.contains("is-open")) {
      projectNav.classList.remove("is-open");
      navToggle.classList.remove("is-active");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}
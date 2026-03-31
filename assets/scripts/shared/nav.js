const MOBILE_BREAKPOINT = 768;

export function initMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");

  if (!navToggle || !siteNav) return;

  const navLinks = Array.from(siteNav.querySelectorAll("a"));

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function syncNavAccessibility(isOpen = siteNav.classList.contains("is-open")) {
    const isMobile = isMobileViewport();
    document.body.classList.toggle("is-nav-open", isMobile && isOpen);
    siteNav.setAttribute("aria-hidden", String(isMobile ? !isOpen : false));
    siteNav.inert = isMobile && !isOpen;
  }

  function closeNav() {
    siteNav.classList.remove("is-open");
    navToggle.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
    syncNavAccessibility(false);
  }

  function openNav() {
    siteNav.classList.add("is-open");
    navToggle.classList.add("is-active");
    navToggle.setAttribute("aria-expanded", "true");
    syncNavAccessibility(true);
  }

  navToggle.addEventListener("click", () => {
    if (siteNav.classList.contains("is-open")) {
      closeNav();
      return;
    }

    openNav();
  });

  navLinks.forEach((link) => link.addEventListener("click", closeNav));

  siteNav.addEventListener("click", (event) => {
    if (event.target === siteNav) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
      closeNav();
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      closeNav();
      return;
    }

    syncNavAccessibility();
  });

  syncNavAccessibility(false);

  return { closeNav, openNav };
}
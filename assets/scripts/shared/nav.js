const MOBILE_OVERLAY_BREAKPOINT = 768;

export function initMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const mobileNavOverlay = document.getElementById("mobileNavOverlay");
  const mobileNavClose = document.getElementById("mobileNavClose");

  if (!navToggle) return;

  const desktopNavLinks = Array.from(siteNav?.querySelectorAll("a") || []);
  const overlayNavLinks = Array.from(mobileNavOverlay?.querySelectorAll("a") || []);

  function isOverlayMode() {
    return window.innerWidth <= MOBILE_OVERLAY_BREAKPOINT && Boolean(mobileNavOverlay);
  }

  function syncToggleTarget() {
    const targetId = isOverlayMode() || !siteNav ? "mobileNavOverlay" : "siteNav";
    navToggle.setAttribute("aria-controls", targetId);
  }

  function closeDesktopNav() {
    siteNav?.classList.remove("is-open");
  }

  function openDesktopNav() {
    siteNav?.classList.add("is-open");
  }

  function closeOverlay() {
    if (!mobileNavOverlay) return;
    mobileNavOverlay.classList.remove("is-open");
    mobileNavOverlay.setAttribute("aria-hidden", "true");
    mobileNavOverlay.inert = true;
    document.body.classList.remove("is-nav-open");
  }

  function openOverlay() {
    if (!mobileNavOverlay) return;
    mobileNavOverlay.classList.add("is-open");
    mobileNavOverlay.setAttribute("aria-hidden", "false");
    mobileNavOverlay.inert = false;
    document.body.classList.add("is-nav-open");
  }

  function closeNav() {
    navToggle.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
    closeDesktopNav();
    closeOverlay();
  }

  function openNav() {
    navToggle.classList.add("is-active");
    navToggle.setAttribute("aria-expanded", "true");

    if (isOverlayMode()) {
      openOverlay();
      return;
    }

    openDesktopNav();
  }

  navToggle.addEventListener("click", () => {
    const shouldClose = isOverlayMode()
      ? mobileNavOverlay?.classList.contains("is-open")
      : siteNav?.classList.contains("is-open");

    if (shouldClose) {
      closeNav();
      return;
    }

    openNav();
  });

  desktopNavLinks.forEach((link) => link.addEventListener("click", closeNav));
  overlayNavLinks.forEach((link) => link.addEventListener("click", closeNav));

  mobileNavClose?.addEventListener("click", () => {
    closeNav();
    navToggle.focus();
  });

  mobileNavOverlay?.addEventListener("click", (event) => {
    if (event.target === mobileNavOverlay) {
      closeNav();
    }
  });

  document.addEventListener("click", (event) => {
    if (isOverlayMode()) return;
    if (!siteNav?.classList.contains("is-open")) return;
    if (!(event.target instanceof Node)) return;

    const clickedInsideNav = siteNav.contains(event.target);
    const clickedToggle = navToggle.contains(event.target);
    if (!clickedInsideNav && !clickedToggle) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    const overlayOpen = mobileNavOverlay?.classList.contains("is-open");
    const desktopNavOpen = siteNav?.classList.contains("is-open");

    if (event.key === "Escape" && (overlayOpen || desktopNavOpen)) {
      closeNav();
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    closeNav();
    syncToggleTarget();
  });

  if (mobileNavOverlay) {
    mobileNavOverlay.setAttribute("aria-hidden", "true");
    mobileNavOverlay.inert = true;
  }

  syncToggleTarget();
  closeNav();

  return { closeNav, openNav };
}
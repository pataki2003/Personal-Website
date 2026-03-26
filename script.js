const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = document.querySelectorAll(".nav a");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("contactSubmitBtn");

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
if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.classList.toggle("is-active", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("is-open");
            navToggle.classList.remove("is-active");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            siteNav.classList.remove("is-open");
            navToggle.classList.remove("is-active");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("click", (event) => {
        const clickedInsideNav = siteNav.contains(event.target);
        const clickedToggle = navToggle.contains(event.target);

        if (!clickedInsideNav && !clickedToggle && siteNav.classList.contains("is-open")) {
            siteNav.classList.remove("is-open");
            navToggle.classList.remove("is-active");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });
}

if (contactForm && formStatus && submitBtn) {
    contactForm.addEventListener("submit", handleContactSubmit);
}

async function handleContactSubmit(event) {
    event.preventDefault();

    clearFormStatus();
    setSubmittingState(true);

    const payload = getContactPayload(contactForm);

    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Something went wrong.");
        }

        contactForm.reset();
        setFormStatus("Your message has been sent successfully.", "success");
    } catch (error) {
        setFormStatus(error.message || "Unable to send message.", "error");
    } finally {
        setSubmittingState(false);
    }
}

function getContactPayload(form) {
    const formData = new FormData(form);

    return {
        name: formData.get("name")?.toString().trim(),
        email: formData.get("email")?.toString().trim(),
        projectType: formData.get("projectType")?.toString().trim(),
        budget: formData.get("budget")?.toString().trim(),
        message: formData.get("message")?.toString().trim(),
    };
}

function clearFormStatus() {
    formStatus.textContent = "";
    formStatus.classList.remove("is-success", "is-error");
}

function setFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.classList.toggle("is-success", type === "success");
    formStatus.classList.toggle("is-error", type === "error");
}

function setSubmittingState(isSubmitting) {
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? "Sending..." : "Send message";
}

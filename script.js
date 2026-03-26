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


const translations = {
    en: {
        "nav.about": "About",
        "nav.skills": "Skills",
        "nav.projects": "Projects",
        "nav.contact": "Contact",

        "hero.eyebrow": "Portfolio • Developer • Builder",
        "hero.titleLine1": "I build useful",
        "hero.titleHighlight": "digital systems",
        "hero.titleLine3": "that solve real problems.",
        "hero.description": "I’m Pataki Attila Bence, a Full-Stack Developer focused on modern web applications, automation workflows, and practical software solutions with real business value.",
        "hero.tag1": "Full-Stack Development",
        "hero.tag2": "AI Automations",
        "hero.tag3": "APIs",
        "hero.tag4": "Cybersecurity Learning",
        "hero.viewProjects": "View Projects",
        "hero.letsTalk": "Let’s Talk",

        "about.label": "About me",
        "about.title": "More than code. I like structure, clarity, and momentum.",
        "about.description": "My goal is not just to create websites, but to design systems that are efficient, scalable, and useful in real-world situations. I’m especially interested in practical web development, APIs, automations, and the kind of digital tools that save time instead of creating chaos.",
        "about.card1.title": "What I care about",
        "about.card1.text": "I enjoy building products that feel clean on the surface and are reliable underneath. The best software is quiet, fast, and useful.",
        "about.card2.title": "How I work",
        "about.card2.text": "I prefer clear structure, readable code, practical solutions, and constant improvement. I like systems that can grow without collapsing into spaghetti.",
        "about.card3.title": "Direction",
        "about.card3.text": "I’m developing myself in full-stack engineering, automation building, and cybersecurity, while focusing on projects with real utility and measurable value.",

        "skills.label": "Skills",
        "skills.title": "Tools and areas I work with",

        "projects.label": "Projects",
        "projects.title": "Selected work and ideas",
        "projects.description": "A few examples of the direction I’m building toward. These projects reflect my interest in automation, practical applications, and modern development.",
        "projects.details": "Project details",

        "contact.label": "Contact",
        "contact.title": "Let’s build something clean, useful, and real.",
        "contact.description": "If you’re looking for someone who enjoys creating practical digital systems, improving workflows, and building with purpose, let’s connect.",
        "contact.workWithMe": "Work with me",

        "footer.rights": "© 2026 Pataki Attila Bence"
    },

    hu: {
        "nav.about": "Rólam",
        "nav.skills": "Készségek",
        "nav.projects": "Projektek",
        "nav.contact": "Kapcsolat",

        "hero.eyebrow": "Portfólió • Fejlesztő • Builder",
        "hero.titleLine1": "Hasznos",
        "hero.titleHighlight": "digitális rendszereket",
        "hero.titleLine3": "építek, amik valódi problémákat oldanak meg.",
        "hero.description": "Pataki Attila Bence vagyok, full-stack fejlesztő. Modern webes alkalmazásokkal, automatizációkkal és valódi üzleti értéket adó digitális megoldásokkal foglalkozom.",
        "hero.tag1": "Full-Stack Fejlesztés",
        "hero.tag2": "AI Automatizációk",
        "hero.tag3": "API-k",
        "hero.tag4": "Kiberbiztonság",
        "hero.viewProjects": "Projektek megtekintése",
        "hero.letsTalk": "Beszéljünk",

        "about.label": "Rólam",
        "about.title": "Több mint kód. Fontos nekem a struktúra, az átláthatóság és a lendület.",
        "about.description": "A célom nem csak weboldalak készítése, hanem olyan rendszerek tervezése, amelyek hatékonyak, skálázhatók és valódi helyzetekben is hasznosak. Kifejezetten érdekel a gyakorlatias webfejlesztés, az API-k, az automatizációk és minden olyan digitális megoldás, ami időt spórol és nem káoszt gyárt.",
        "about.card1.title": "Mi fontos nekem",
        "about.card1.text": "Szeretek olyan termékeket építeni, amelyek kívülről letisztultak, belül pedig megbízhatóak. A legjobb szoftver gyors, csendben működik és valóban hasznos.",
        "about.card2.title": "Hogyan dolgozom",
        "about.card2.text": "A tiszta struktúrát, az olvasható kódot, a gyakorlatias megoldásokat és a folyamatos fejlődést preferálom. Olyan rendszereket szeretek, amelyek nem esnek szét, ha növekedni kezdenek.",
        "about.card3.title": "Irány",
        "about.card3.text": "Jelenleg full-stack fejlesztésben, automatizációkban és kiberbiztonságban fejlődöm, miközben olyan projekteken dolgozom, amelyeknek valódi haszna és mérhető értéke van.",

        "skills.label": "Készségek",
        "skills.title": "Eszközök és területek, amelyekkel dolgozom",

        "projects.label": "Projektek",
        "projects.title": "Kiemelt munkák és ötletek",
        "projects.description": "Néhány példa abból az irányból, amerre építkezem. Ezek a projektek jól mutatják az automatizáció, a gyakorlatias alkalmazások és a modern fejlesztés iránti érdeklődésemet.",
        "projects.details": "Projekt részletei",

        "contact.label": "Kapcsolat",
        "contact.title": "Építsünk valami letisztultat, hasznosat és valódit.",
        "contact.description": "Ha olyan embert keresel, aki szeret gyakorlatias digitális rendszereket építeni, munkafolyamatokat egyszerűsíteni és céllal fejleszteni, beszéljünk.",
        "contact.workWithMe": "Dolgozz velem",

        "footer.rights": "© 2026 Pataki Attila Bence"
    }
};

const languageSwitcher = document.getElementById("languageSwitcher");
const langButtons = document.querySelectorAll("[data-lang-btn]");
const translatableElements = document.querySelectorAll("[data-i18n]");

const savedLanguage = localStorage.getItem("language") || "en";
applyLanguage(savedLanguage);

if (languageSwitcher) {
    langButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const lang = button.getAttribute("data-lang-btn");
            applyLanguage(lang);
            localStorage.setItem("language", lang);
        });
    });
}

function applyLanguage(lang) {
    const dict = translations[lang];
    if (!dict) return;

    document.documentElement.lang = lang;

    translatableElements.forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (dict[key]) {
            element.textContent = dict[key];
        }
    });

    langButtons.forEach((button) => {
        button.classList.toggle("is-active", button.getAttribute("data-lang-btn") === lang);
    });
}
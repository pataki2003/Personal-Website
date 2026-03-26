const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = document.querySelectorAll(".nav a");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("contactSubmitBtn");

const languageSwitcher = document.getElementById("languageSwitcher");
const langButtons = document.querySelectorAll("[data-lang-btn]");
const translatableElements = document.querySelectorAll("[data-i18n]");

/* =========================
   THEME
========================= */

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

/* =========================
   MOBILE NAV
========================= */

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

/* =========================
   TRANSLATIONS
========================= */

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
        "hero.miniLabel": "Current focus",
        "hero.miniTitle": "Building systems that actually work",
        "hero.miniText": "Clean frontend, reliable backend logic, and automation that reduces manual work.",

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
        "skills.card1.title": "Frontend Development",
        "skills.card1.text": "Responsive interfaces using HTML, CSS, JavaScript, and modern component-based thinking.",
        "skills.card2.title": "Backend Logic",
        "skills.card2.text": "Working with Node.js, APIs, application structure, and data flow that supports real use cases.",
        "skills.card3.title": "Python & Automation",
        "skills.card3.text": "Building scripts and automation processes to reduce repetitive work and connect systems more efficiently.",
        "skills.card4.title": "Version Control",
        "skills.card4.text": "Using Git and GitHub to manage code, track progress, and maintain a cleaner workflow during development.",
        "skills.card5.title": "API Integration",
        "skills.card5.text": "Connecting services and applications through APIs to build more useful and scalable digital systems.",
        "skills.card6.title": "Cybersecurity Learning",
        "skills.card6.text": "Expanding my knowledge in secure thinking, system awareness, and safer software practices.",

        "projects.label": "Projects",
        "projects.title": "Selected work and ideas",
        "projects.description": "A few examples of the direction I’m building toward. These projects reflect my interest in automation, practical applications, and modern development.",
        "projects.details": "Project details",
        "projects.card1.badge": "Full-Stack App",
        "projects.card1.title": "Coachtimize",
        "projects.card1.text": "A full-stack coaching platform designed to help coaches manage clients, assign workout plans, and communicate in real time. Built with a real backend, authentication system, and structured data handling.",
        "projects.card2.badge": "Concept",
        "projects.card2.title": "AI Call Handling System",
        "projects.card2.text": "A business-focused automation concept designed to handle missed calls, capture customer requests, and improve response time with smarter workflows.",
        "projects.card3.badge": "Website",
        "projects.card3.title": "Portfolio Website",
        "projects.card3.text": "A modern personal website built to present my skills, projects, and technical direction in a clear and professional way.",

        "contact.label": "Contact",
        "contact.title": "Let’s build something clean, useful, and real.",
        "contact.description": "If you’re looking for someone who enjoys creating practical digital systems, improving workflows, and building with purpose, let’s connect.",
        "contact.workWithMe": "Work with me",

        "footer.rights": "© 2026 Pataki Attila Bence",

        "form.sending": "Sending...",
        "form.send": "Send message",
        "form.success": "Your message has been sent successfully.",
        "form.error": "Unable to send message.",
        "form.genericError": "Something went wrong.",

        "contactPage.eyebrow": "Work with me",
        "contactPage.title": "Let’s build something useful.",
        "contactPage.lead": "If you need a clean, practical digital system, a web application, or workflow automation support, send me a message here.",

        "contactPage.info.emailLabel": "Email",
        "contactPage.info.locationLabel": "Location",
        "contactPage.info.locationValue": "Hungary",
        "contactPage.info.responseLabel": "Response time",
        "contactPage.info.responseValue": "Usually within 24–48 hours",

        "contactPage.form.nameLabel": "Name",
        "contactPage.form.namePlaceholder": "Your name",
        "contactPage.form.emailLabel": "Email",
        "contactPage.form.emailPlaceholder": "your@email.com",
        "contactPage.form.projectTypeLabel": "Project type",
        "contactPage.form.projectTypePlaceholder": "Select one",
        "contactPage.form.projectType.website": "Website",
        "contactPage.form.projectType.webApp": "Web App",
        "contactPage.form.projectType.automation": "Automation",
        "contactPage.form.projectType.consultation": "Consultation",
        "contactPage.form.projectType.other": "Other",

        "contactPage.form.budgetLabel": "Budget range",
        "contactPage.form.budgetPlaceholder": "Select one",
        "contactPage.form.budget.1": "Under EUR 500",
        "contactPage.form.budget.2": "EUR 500 - EUR 1,000",
        "contactPage.form.budget.3": "EUR 1,000 - EUR 3,000",
        "contactPage.form.budget.4": "EUR 3,000+",

        "contactPage.form.messageLabel": "Message",
        "contactPage.form.messagePlaceholder": "Tell me a bit about your project...",
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
        "hero.miniLabel": "Jelenlegi fókusz",
        "hero.miniTitle": "Olyan rendszereket építek, amik tényleg működnek",
        "hero.miniText": "Letisztult frontend, megbízható backend logika és olyan automatizáció, ami csökkenti a manuális munkát.",

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
        "skills.card1.title": "Frontend Fejlesztés",
        "skills.card1.text": "Reszponzív felületek HTML, CSS, JavaScript és modern komponensalapú gondolkodás segítségével.",
        "skills.card2.title": "Backend Logika",
        "skills.card2.text": "Node.js, API-k, alkalmazásstruktúra és olyan adatfolyamok, amelyek valódi felhasználási helyzeteket támogatnak.",
        "skills.card3.title": "Python és Automatizáció",
        "skills.card3.text": "Scriptek és automatizált folyamatok készítése, amelyek csökkentik az ismétlődő munkát és hatékonyabban kapcsolnak össze rendszereket.",
        "skills.card4.title": "Verziókezelés",
        "skills.card4.text": "Git és GitHub használata a kód kezelésére, a haladás követésére és egy tisztább fejlesztési workflow fenntartására.",
        "skills.card5.title": "API Integráció",
        "skills.card5.text": "Szolgáltatások és alkalmazások összekötése API-kon keresztül, hogy hasznosabb és skálázhatóbb digitális rendszerek jöjjenek létre.",
        "skills.card6.title": "Kiberbiztonsági Tanulás",
        "skills.card6.text": "A biztonságtudatos gondolkodás, rendszerismeret és biztonságosabb szoftveres gyakorlatok folyamatos mélyítése.",

        "projects.label": "Projektek",
        "projects.title": "Kiemelt munkák és ötletek",
        "projects.description": "Néhány példa abból az irányból, amerre építkezem. Ezek a projektek jól mutatják az automatizáció, a gyakorlatias alkalmazások és a modern fejlesztés iránti érdeklődésemet.",
        "projects.details": "Projekt részletei",
        "projects.card1.badge": "Full-Stack App",
        "projects.card1.title": "Coachtimize",
        "projects.card1.text": "Egy full-stack coaching platform, amely segíti az edzőket az ügyfelek kezelésében, edzéstervek kiosztásában és a valós idejű kommunikációban. Valódi backenddel, authentikációval és strukturált adatkezeléssel készült.",
        "projects.card2.badge": "Koncepció",
        "projects.card2.title": "AI Call Handling System",
        "projects.card2.text": "Egy üzleti fókuszú automatizációs koncepció, amely a nem fogadott hívások kezelését, az ügyféligények rögzítését és a gyorsabb reakcióidőt támogatja okosabb workflow-kon keresztül.",
        "projects.card3.badge": "Weboldal",
        "projects.card3.title": "Portfolio Website",
        "projects.card3.text": "Egy modern személyes weboldal, amely a készségeimet, projektjeimet és technikai irányomat világos és professzionális módon mutatja be.",

        "contact.label": "Kapcsolat",
        "contact.title": "Építsünk valami letisztultat, hasznosat és valódit.",
        "contact.description": "Ha olyan embert keresel, aki szeret gyakorlatias digitális rendszereket építeni, munkafolyamatokat egyszerűsíteni és céllal fejleszteni, beszéljünk.",
        "contact.workWithMe": "Dolgozz velem",

        "footer.rights": "© 2026 Pataki Attila Bence",

        "form.sending": "Küldés...",
        "form.send": "Üzenet küldése",
        "form.success": "Az üzenetedet sikeresen elküldtem.",
        "form.error": "Nem sikerült elküldeni az üzenetet.",
        "form.genericError": "Valami hiba történt.",

        "contactPage.eyebrow": "Dolgozz velem",
        "contactPage.title": "Építsünk valami hasznosat.",
        "contactPage.lead": "Ha egy letisztult, gyakorlatias digitális rendszerre, webalkalmazásra vagy automatizációs támogatásra van szükséged, írj itt üzenetet.",

        "contactPage.info.emailLabel": "Email",
        "contactPage.info.locationLabel": "Helyszín",
        "contactPage.info.locationValue": "Magyarország",
        "contactPage.info.responseLabel": "Válaszidő",
        "contactPage.info.responseValue": "Általában 24–48 órán belül",

        "contactPage.form.nameLabel": "Név",
        "contactPage.form.namePlaceholder": "Neved",
        "contactPage.form.emailLabel": "Email",
        "contactPage.form.emailPlaceholder": "email@pelda.hu",
        "contactPage.form.projectTypeLabel": "Projekt típusa",
        "contactPage.form.projectTypePlaceholder": "Válassz egyet",
        "contactPage.form.projectType.website": "Weboldal",
        "contactPage.form.projectType.webApp": "Webalkalmazás",
        "contactPage.form.projectType.automation": "Automatizáció",
        "contactPage.form.projectType.consultation": "Konzultáció",
        "contactPage.form.projectType.other": "Egyéb",

        "contactPage.form.budgetLabel": "Költségkeret",
        "contactPage.form.budgetPlaceholder": "Válassz egyet",
        "contactPage.form.budget.1": "500 EUR alatt",
        "contactPage.form.budget.2": "500 - 1 000 EUR",
        "contactPage.form.budget.3": "1 000 - 3 000 EUR",
        "contactPage.form.budget.4": "3 000+ EUR",

        "contactPage.form.messageLabel": "Üzenet",
        "contactPage.form.messagePlaceholder": "Írj pár mondatot a projektedről...",
    }
};

const savedLanguage = localStorage.getItem("language") || "hu";
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

    updateFormButtonText();
}

function getCurrentLanguage() {
    return localStorage.getItem("language") || "hu";
}

function t(key) {
    const lang = getCurrentLanguage();
    return translations[lang]?.[key] || translations.en[key] || key;
}

/* =========================
   CONTACT FORM
========================= */

if (contactForm && formStatus && submitBtn) {
    updateFormButtonText();

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
            throw new Error(result.error || t("form.genericError"));
        }

        contactForm.reset();
        setFormStatus(t("form.success"), "success");
    } catch (error) {
        setFormStatus(error.message || t("form.error"), "error");
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
    if (!formStatus) return;

    formStatus.textContent = "";
    formStatus.classList.remove("is-success", "is-error");
}

function setFormStatus(message, type) {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.classList.toggle("is-success", type === "success");
    formStatus.classList.toggle("is-error", type === "error");
}

function setSubmittingState(isSubmitting) {
    if (!submitBtn) return;

    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? t("form.sending") : t("form.send");
}

function updateFormButtonText() {
    if (!submitBtn || submitBtn.disabled) return;
    submitBtn.textContent = t("form.send");
}

function applyLanguage(lang) {
    const dict = translations[lang];
    if (!dict) return;

    document.documentElement.lang = lang;

    translatableElements.forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (key && dict[key]) {
            element.textContent = dict[key];
        }
    });

    const placeholderElements = document.querySelectorAll("[data-i18n-placeholder]");
    placeholderElements.forEach((element) => {
        const key = element.getAttribute("data-i18n-placeholder");
        if (key && dict[key]) {
            element.setAttribute("placeholder", dict[key]);
        }
    });

    langButtons.forEach((button) => {
        button.classList.toggle("is-active", button.getAttribute("data-lang-btn") === lang);
    });

    updateFormButtonText();
}
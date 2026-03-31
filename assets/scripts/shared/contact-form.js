const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initContactForm({ t, getCurrency = () => "EUR" }) {
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const submitButton = document.getElementById("contactSubmitBtn");

  if (!form || !formStatus || !submitButton) return;

  const budgetSelect = form.elements.namedItem("budget");

  function clearStatus() {
    formStatus.textContent = "";
    formStatus.classList.remove("is-success", "is-error");
  }

  function setStatus(message, type) {
    formStatus.textContent = message;
    formStatus.classList.toggle("is-success", type === "success");
    formStatus.classList.toggle("is-error", type === "error");
  }

  function setSubmittingState(isSubmitting) {
    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? t("form.sending") : t("form.send");
  }

  function updateIdleLabel() {
    if (!submitButton.disabled) submitButton.textContent = t("form.send");
  }

  function updateBudgetOptions() {
    if (!(budgetSelect instanceof HTMLSelectElement)) return;

    const selectedOption = budgetSelect.options[budgetSelect.selectedIndex];
    const selectedTier = selectedOption?.dataset.budgetTier || "";
    const currencyKey = getCurrency()?.toLowerCase() === "huf" ? "huf" : "eur";

    Array.from(budgetSelect.querySelectorAll("[data-budget-tier]")).forEach((option) => {
      if (!(option instanceof HTMLOptionElement)) return;
      const tier = option.dataset.budgetTier;
      if (!tier) return;
      const label = t(`contactPage.form.budget.${currencyKey}.${tier}`);
      option.textContent = label;
      option.value = label;
    });

    if (selectedTier) {
      const nextOption = budgetSelect.querySelector(`[data-budget-tier="${selectedTier}"]`);
      if (nextOption instanceof HTMLOptionElement) {
        nextOption.selected = true;
        budgetSelect.value = nextOption.value;
      }
      return;
    }

    budgetSelect.selectedIndex = 0;
  }

  function markValidity(field, isValid) {
    field.setAttribute("aria-invalid", String(!isValid));
  }

  function getPayload() {
    const formData = new FormData(form);
    return {
      name: formData.get("name")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      projectType: formData.get("projectType")?.toString().trim() || "",
      budget: formData.get("budget")?.toString().trim() || "",
      message: formData.get("message")?.toString().trim() || ""
    };
  }

  function validate(payload) {
    const fields = {
      name: form.elements.namedItem("name"),
      email: form.elements.namedItem("email"),
      projectType: form.elements.namedItem("projectType"),
      message: form.elements.namedItem("message")
    };

    Object.values(fields).forEach((field) => {
      if (field instanceof HTMLElement) markValidity(field, true);
    });

    if (!payload.name || !payload.email || !payload.projectType || !payload.message) {
      Object.entries(fields).forEach(([key, field]) => {
        if (field instanceof HTMLElement) markValidity(field, Boolean(payload[key]));
      });
      return t("form.validation.required");
    }

    if (!EMAIL_REGEX.test(payload.email)) {
      if (fields.email instanceof HTMLElement) markValidity(fields.email, false);
      return t("form.validation.email");
    }

    return "";
  }

  form.addEventListener("input", (event) => {
    clearStatus();
    const target = event.target;
    if (target instanceof HTMLElement && target.hasAttribute("aria-invalid")) {
      markValidity(target, true);
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearStatus();

    const payload = getPayload();
    const validationError = validate(payload);
    if (validationError) {
      setStatus(validationError, "error");
      return;
    }

    setSubmittingState(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t("form.genericError"));

      form.reset();
      updateBudgetOptions();
      ["name", "email", "projectType", "message"].forEach((fieldName) => {
        const field = form.elements.namedItem(fieldName);
        if (field instanceof HTMLElement) markValidity(field, true);
      });
      setStatus(t("form.success"), "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : t("form.error");
      setStatus(message || t("form.error"), "error");
    } finally {
      setSubmittingState(false);
    }
  });

  document.addEventListener("app:languagechange", () => {
    updateIdleLabel();
    updateBudgetOptions();
  });
  document.addEventListener("app:currencychange", updateBudgetOptions);

  updateBudgetOptions();
  updateIdleLabel();
}
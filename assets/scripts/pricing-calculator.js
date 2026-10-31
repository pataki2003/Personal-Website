import { translations } from "./data/translations.js";
import { pricingCategories } from "./data/pricing-data.js";

const categorySelect = document.getElementById("pricingCategory");
const taskSelect = document.getElementById("pricingTask");
const result = document.getElementById("pricingResult");

if (categorySelect && taskSelect && result) {
  const language = document.documentElement.lang === "en" ? "en" : "hu";
  const t = (key) => translations[language][key];
  const money = (value) =>
    new Intl.NumberFormat(language === "hu" ? "hu-HU" : "en-US")
      .format(value)
      .replace(/[\u00a0\u202f]/g, " ");

  function option(value, label) {
    const element = document.createElement("option");
    element.value = value;
    element.textContent = label;
    return element;
  }

  function showPrompt() {
    result.replaceChildren();
    const prompt = document.createElement("p");
    prompt.textContent = t("pricing.calculator.prompt");
    result.append(prompt);
  }

  function showTask() {
    const category = pricingCategories.find(
      (item) => item.id === categorySelect.value,
    );
    const task = category?.tasks.find((item) => item.id === taskSelect.value);
    if (!category || !taskSelect.value) return showPrompt();

    result.replaceChildren();
    const heading = document.createElement("h3");
    const description = document.createElement("p");
    const note = document.createElement("p");
    note.className = "estimate-note";

    if (taskSelect.value === "complex") {
      heading.textContent = t("pricing.calculator.consultation");
      description.textContent = t(`pricing.calculator.reason.${category.id}`);
      note.textContent = t("pricing.calculator.consultationNote");
    } else if (task) {
      heading.textContent = task.amounts
        ? `${task.amounts.map(money).join(t("pricing.calculator.or"))} Ft ${t("pricing.calculator.timeBudget")}`
        : `${money(task.min)}–${money(task.max)} Ft`;
      description.textContent = t(`pricing.calculator.includes.${task.id}`);
      note.textContent = t("pricing.calculator.estimateNote");
    }
    result.append(heading, description, note);
  }

  categorySelect.append(
    ...pricingCategories.map((item) =>
      option(item.id, t(`pricing.calculator.category.${item.id}`)),
    ),
  );

  categorySelect.addEventListener("change", () => {
    const category = pricingCategories.find(
      (item) => item.id === categorySelect.value,
    );
    taskSelect.replaceChildren(
      option("", t("pricing.calculator.taskPlaceholder")),
    );
    if (category) {
      taskSelect.append(
        ...category.tasks.map((task) =>
          option(task.id, t(`pricing.calculator.task.${task.id}`)),
        ),
      );
      taskSelect.append(
        option("complex", t("pricing.calculator.task.complex")),
      );
    }
    taskSelect.disabled = !category;
    showPrompt();
  });

  taskSelect.addEventListener("change", showTask);
  showPrompt();
}

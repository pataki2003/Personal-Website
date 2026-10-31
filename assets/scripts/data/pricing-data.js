// The only source for the calculator's published price bands.
// Change these starting estimates here; language-specific copy lives in hu.js/en.js.
export const pricingCategories = [
  {
    id: "website",
    tasks: [
      { id: "one-page", min: 175000, max: 280000 },
      { id: "business-site", min: 280000, max: 415000 },
      { id: "magazine", min: 555000, max: 830000 },
    ],
  },
  {
    id: "automation",
    tasks: [{ id: "two-systems", min: 140000, max: 280000 }],
  },
  {
    id: "crm",
    tasks: [{ id: "team-crm", min: 1380000, max: 1725000 }],
  },
  {
    id: "small-work",
    tasks: [{ id: "time-budget", amounts: [30000, 45000] }],
  },
];

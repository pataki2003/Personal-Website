import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const source = await readFile(
  new URL("../api/contact.js", import.meta.url),
  "utf8",
);
const { default: handler } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);

const originalFetch = globalThis.fetch;
const originalError = console.error;
const originalConfig = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
};

function response() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

async function run(body, provider = { ok: true, data: { id: "mock" } }) {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return { ok: provider.ok, json: async () => provider.data };
  };
  const res = response();
  await handler({ method: "POST", body }, res);
  return {
    res,
    calls,
    email: calls[0] ? JSON.parse(calls[0].options.body) : null,
  };
}

test("contact API sends valid messages without a budget", async (t) => {
  process.env.RESEND_API_KEY = "mock-key";
  process.env.CONTACT_TO_EMAIL = "owner@example.com";
  process.env.CONTACT_FROM_EMAIL = "site@example.com";
  t.after(() => {
    globalThis.fetch = originalFetch;
    console.error = originalError;
    for (const [key, value] of Object.entries(originalConfig)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  const valid = {
    name: "Example Client",
    email: "client@example.com",
    company: "Example Ltd",
    projectType: "Website",
    message: "Please refresh our site.",
  };

  await t.test("valid request creates the expected Resend email", async () => {
    const { res, calls, email } = await run(valid);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { success: true });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://api.resend.com/emails");
    assert.equal(email.subject, "New lead: Website");
    assert.match(email.html, /Example Client/);
    assert.match(email.html, /Example Ltd/);
    assert.match(email.html, /Please refresh our site/);
    assert.doesNotMatch(email.subject + email.html, /Budget:|Not specified/i);
  });

  await t.test("missing required field stops before the provider", async () => {
    const { res, calls } = await run({ ...valid, message: "" });
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: "Missing required fields." });
    assert.equal(calls.length, 0);
  });

  await t.test("a legacy budget field is ignored", async () => {
    const { res, email } = await run({
      ...valid,
      company: "",
      budget: "LEGACY_BUDGET_123",
    });
    assert.equal(res.statusCode, 200);
    assert.equal(email.subject, "New lead: Website");
    assert.doesNotMatch(email.html, /LEGACY_BUDGET_123|Budget:|Not specified/i);
  });

  await t.test("provider error returns a safe failure", async () => {
    const errors = [];
    console.error = (...args) => errors.push(args);
    const { res, calls } = await run(valid, {
      ok: false,
      data: { message: "mock refusal" },
    });
    assert.equal(calls.length, 1);
    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.body, { error: "Failed to send email." });
    assert.equal(errors.length, 1);
    console.error = originalError;
  });
});

import { describe, expect, it } from "vitest";
import { contactSchema } from "./contact-schema";

const valid = {
  name: "Jane Tester",
  email: "jane@example.com",
  message: "This message is comfortably over the twenty character minimum.",
};

describe("contactSchema", () => {
  it("accepts a well formed submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ["a name that is too short", { ...valid, name: "J" }],
    ["an invalid email", { ...valid, email: "not-an-email" }],
    ["a message under the minimum", { ...valid, message: "too short" }],
    ["a message over the maximum", { ...valid, message: "x".repeat(2001) }],
  ])("rejects %s", (_label, input) => {
    expect(contactSchema.safeParse(input).success).toBe(false);
  });

  it("trims surrounding whitespace", () => {
    const parsed = contactSchema.parse({ ...valid, name: "  Jane Tester  " });
    expect(parsed.name).toBe("Jane Tester");
  });

  it("accepts a filled honeypot so the route can discard it silently", () => {
    // Rejecting here would return a validation error and tell a bot that the
    // field is a trap. The route handles it instead.
    const parsed = contactSchema.safeParse({ ...valid, website: "spam.test" });
    expect(parsed.success).toBe(true);
  });
});

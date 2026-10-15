import { z } from "zod";

/**
 * Shared between the client form and the API route, so the browser and the
 * server can never disagree about what counts as valid. Client-side
 * validation is a convenience; the server re-validates because anything a
 * browser sends can be forged.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.email("Please enter a valid email address").max(200),
  message: z
    .string()
    .trim()
    .min(20, "Please give me a little more detail (20 characters minimum)")
    .max(2000, "Please keep it under 2000 characters"),
  // Honeypot. Real users never see this field, so anything in it is a bot.
  // Deliberately permissive: rejecting it here would return a validation
  // error, which tells the bot the field matters. The route accepts the
  // submission and silently discards it instead.
  website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { type ContactInput, contactSchema } from "@/lib/contact-schema";

type Status = { kind: "idle" | "sent" } | { kind: "error"; message: string };

const fieldClass =
  "surface w-full rounded-xl px-4 py-3 outline-none placeholder:text-muted/70 focus:border-accent";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactInput) {
    setStatus({ kind: "idle" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setStatus({
          kind: "error",
          message: body?.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      reset();
      setStatus({ kind: "sent" });
    } catch {
      setStatus({
        kind: "error",
        message: "Could not reach the server. Please check your connection.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClass}
            {...register("name")}
          />
          {errors.name && (
            <p
              id="name-error"
              role="alert"
              className="text-accent mt-2 text-sm"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass}
            {...register("email")}
          />
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="text-accent mt-2 text-sm"
            >
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClass} resize-y`}
          {...register("message")}
        />
        {errors.message && (
          <p
            id="message-error"
            role="alert"
            className="text-accent mt-2 text-sm"
          >
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from users and from assistive tech, irresistible to
          naive bots. Anything in it means the submission is discarded. */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          {...register("website")}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Send className="size-4" aria-hidden />
          )}
          {isSubmitting ? "Sending" : "Send message"}
        </button>

        <p role="status" aria-live="polite" className="text-sm">
          {status.kind === "sent" && (
            <span className="text-accent">
              Thanks, that reached me. I will reply shortly.
            </span>
          )}
          {status.kind === "error" && (
            <span className="text-accent">{status.message}</span>
          )}
        </p>
      </div>
    </form>
  );
}

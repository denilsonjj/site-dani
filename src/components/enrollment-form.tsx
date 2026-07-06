"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowRight, Mail, UserRound } from "lucide-react";
import type { Locale } from "@/lib/content";

type EnrollmentLabels = {
  age: string;
  cta: string;
  email: string;
  fallback: string;
  formTitle: string;
  name: string;
  paymentNote: string;
  submit: string;
};

type EnrollmentFormProps = {
  labels: EnrollmentLabels;
  locale: Locale;
};

export function EnrollmentForm({ labels, locale }: EnrollmentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/checkout", {
        body: JSON.stringify({
          age: String(formData.get("age") || ""),
          email: String(formData.get("email") || ""),
          locale,
          name: String(formData.get("name") || ""),
          productId: "online-course",
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as {
        configured?: boolean;
        message?: string;
        url?: string;
        whatsappUrl?: string;
      };

      if (result.url) {
        window.location.href = result.url;
        return;
      }

      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      }

      setMessage(result.message || labels.fallback);
    } catch {
      setMessage(labels.fallback);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-white/15 bg-white/[0.06] p-5 shadow-2xl shadow-black/10 backdrop-blur md:p-7">
      <button
        className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#C9A227] px-6 font-bold text-[#10251d] transition hover:bg-[#C9A227] sm:w-auto"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {labels.cta}
        <ArrowRight aria-hidden="true" size={17} />
      </button>

      {isOpen ? (
        <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
          <h3 className="display text-3xl font-semibold text-white">{labels.formTitle}</h3>
          <label className="grid gap-2 text-sm font-bold text-white/80">
            {labels.name}
            <span className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4">
              <UserRound aria-hidden="true" className="text-[#C9A227]" size={18} />
              <input
                className="min-h-13 flex-1 bg-transparent text-white outline-none placeholder:text-white/35"
                name="name"
                required
                type="text"
              />
            </span>
          </label>
          <div className="grid gap-4 sm:grid-cols-[0.45fr_1fr]">
            <label className="grid gap-2 text-sm font-bold text-white/80">
              {labels.age}
              <input
                className="min-h-13 rounded-2xl border border-white/15 bg-white/10 px-4 text-white outline-none placeholder:text-white/35"
                min={12}
                name="age"
                required
                type="number"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-white/80">
              {labels.email}
              <span className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4">
                <Mail aria-hidden="true" className="text-[#C9A227]" size={18} />
                <input
                  className="min-h-13 flex-1 bg-transparent text-white outline-none placeholder:text-white/35"
                  name="email"
                  required
                  type="email"
                />
              </span>
            </label>
          </div>
          <button
            className="mt-2 inline-flex min-h-13 items-center justify-center rounded-full bg-white px-6 font-bold text-[#123c2d] transition hover:bg-[#f2ead5] disabled:cursor-wait disabled:opacity-70"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "A preparar..." : labels.submit}
          </button>
          <p className="text-sm leading-6 text-white/60">{labels.paymentNote}</p>
          {message ? <p className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/80">{message}</p> : null}
        </form>
      ) : (
        <p className="mt-5 text-sm leading-6 text-white/60">{labels.fallback}</p>
      )}
    </div>
  );
}

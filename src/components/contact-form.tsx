"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";

type ContactFormProps = {
  labels: {
    name: string;
    email: string;
    message: string;
    submit: string;
    privacy: string;
  };
};

export function ContactForm({ labels }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = [
      "Olá, Dani Therapies!",
      "",
      `Nome: ${name}`,
      `E-mail: ${email}`,
      `Mensagem: ${message}`,
    ].join("\n");

    window.open(
      `https://wa.me/31616018467?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          {labels.name}
          <input
            className="min-h-13 rounded-2xl border border-white/20 bg-white/8 px-4 text-white placeholder:text-white/40"
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          {labels.email}
          <input
            className="min-h-13 rounded-2xl border border-white/20 bg-white/8 px-4 text-white placeholder:text-white/40"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold">
        {labels.message}
        <textarea
          className="min-h-32 resize-y rounded-2xl border border-white/20 bg-white/8 p-4 text-white placeholder:text-white/40"
          onChange={(event) => setMessage(event.target.value)}
          required
          value={message}
        />
      </label>
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-5 text-white/55">{labels.privacy}</p>
        <button
          className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#d8bd82] px-6 font-bold text-[#10251d] transition hover:bg-[#ead7aa]"
          type="submit"
        >
          {labels.submit}
          <ArrowUpRight aria-hidden="true" size={18} />
        </button>
      </div>
    </form>
  );
}

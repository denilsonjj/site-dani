"use client";

import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/content";

type RequiredField = {
  helpText?: string;
  key: string;
  label: string;
  type: "text" | "email" | "number" | "date" | "textarea" | "checkbox" | "select";
};

type CheckoutButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  locale: Locale;
  productId: string;
};

type CheckoutResponse = {
  configured?: boolean;
  error?: string;
  message?: string;
  policyRequired?: boolean;
  requiredFields?: RequiredField[];
  url?: string;
  whatsappUrl?: string;
};

const checkoutCopy: Record<
  Locale,
  {
    fieldFallback: string;
    formTitle: string;
    generalTermsLink: string;
    loading: string;
    optionPlaceholder: string;
    paymentFallback: string;
    policyLabel: string;
    requiredFallback: string;
    submit: string;
    termsLink: string;
    termsTextAfter: string;
    termsTextBefore: string;
  }
> = {
  pt: {
    fieldFallback: "Confirmo",
    formTitle: "Formulário obrigatório",
    generalTermsLink: "Termos e Condições",
    loading: "A preparar...",
    optionPlaceholder: "Selecione",
    paymentFallback: "Pagamento indisponível neste momento. Entre em contacto pelo WhatsApp.",
    policyLabel: "Política de Cancelamento",
    requiredFallback: "Preencha os dados obrigatórios para continuar.",
    submit: "Continuar pagamento",
    termsLink: "Termos e Conduta do Curso",
    termsTextAfter: " e a Política de Cancelamento antes da finalização do pagamento.",
    termsTextBefore: "Li e aceito o ",
  },
  en: {
    fieldFallback: "I confirm",
    formTitle: "Required form",
    generalTermsLink: "Terms and Conditions",
    loading: "Preparing...",
    optionPlaceholder: "Select",
    paymentFallback: "Payment is currently unavailable. Please contact us through WhatsApp.",
    policyLabel: "Cancellation Policy",
    requiredFallback: "Please fill in the required information to continue.",
    submit: "Continue to payment",
    termsLink: "Course Terms and Conduct",
    termsTextAfter: " and the Cancellation Policy before completing the payment.",
    termsTextBefore: "I have read and accept the ",
  },
  es: {
    fieldFallback: "Confirmo",
    formTitle: "Formulario obligatorio",
    generalTermsLink: "Términos y Condiciones",
    loading: "Preparando...",
    optionPlaceholder: "Seleccione",
    paymentFallback: "El pago no está disponible en este momento. Contacte por WhatsApp.",
    policyLabel: "Política de Cancelación",
    requiredFallback: "Complete los datos obligatorios para continuar.",
    submit: "Continuar al pago",
    termsLink: "Términos y Conducta del Curso",
    termsTextAfter: " y la Política de Cancelación antes de finalizar el pago.",
    termsTextBefore: "He leído y acepto el ",
  },
  nl: {
    fieldFallback: "Ik bevestig",
    formTitle: "Verplicht formulier",
    generalTermsLink: "Algemene Voorwaarden",
    loading: "Voorbereiden...",
    optionPlaceholder: "Selecteer",
    paymentFallback: "Betalen is momenteel niet beschikbaar. Neem contact op via WhatsApp.",
    policyLabel: "Annuleringsbeleid",
    requiredFallback: "Vul de verplichte gegevens in om verder te gaan.",
    submit: "Doorgaan naar betaling",
    termsLink: "Cursusvoorwaarden en Gedragscode",
    termsTextAfter: " en het annuleringsbeleid voordat ik de betaling afrond.",
    termsTextBefore: "Ik heb de ",
  },
};

export function CheckoutButton({ children, disabled = false, locale, productId }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [requiredFields, setRequiredFields] = useState<RequiredField[]>([]);
  const [policyRequired, setPolicyRequired] = useState(false);
  const copy = checkoutCopy[locale] || checkoutCopy.pt;
  const isCourse = productId === "online-course";

  async function requestCheckout(body: Record<string, unknown>) {
    const response = await fetch("/api/checkout", {
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    return (await response.json()) as CheckoutResponse;
  }

  function handleResult(result: CheckoutResponse) {
    if (result.requiredFields?.length) {
      setRequiredFields(result.requiredFields);
      setPolicyRequired(Boolean(result.policyRequired));
      setMessage(result.error || copy.requiredFallback);
      return;
    }

    if (result.url) {
      window.location.href = result.url;
      return;
    }

    if (result.whatsappUrl) {
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
    }

    setMessage(result.message || result.error || copy.paymentFallback);
  }

  async function handleCheckout() {
    setIsLoading(true);
    setMessage("");

    try {
      const result = await requestCheckout({ locale, productId });
      handleResult(result);
    } catch {
      setMessage("Nao foi possivel iniciar o pagamento agora. Tente novamente pelo WhatsApp.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRequiredForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const intake: Record<string, unknown> = Object.fromEntries(formData.entries());

    for (const field of requiredFields) {
      if (field.type === "checkbox") {
        intake[field.key] = formData.get(field.key) === "on";
      }
    }

    try {
      const result = await requestCheckout({
        intake,
        locale,
        policyAccepted: formData.get("policyAccepted") === "on",
        productId,
      });
      handleResult(result);
    } catch {
      setMessage("Nao foi possivel enviar o formulario agora. Tente novamente pelo WhatsApp.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#123c2d] px-5 text-sm font-bold text-white transition hover:bg-[#1f5742] disabled:cursor-wait disabled:opacity-70"
        disabled={disabled || isLoading}
        onClick={handleCheckout}
        type="button"
      >
        {isLoading ? copy.loading : children}
        <ArrowRight aria-hidden="true" size={15} />
      </button>

      {requiredFields.length ? (
        <form className="mt-5 grid gap-3 rounded-[1.4rem] bg-white p-4" onSubmit={handleRequiredForm}>
          <p className="text-sm font-bold text-[#123c2d]">{copy.formTitle}</p>
          {requiredFields.map((field) => (
            <label className="grid gap-2 text-sm font-bold text-[#40564d]" key={field.key}>
              {field.label}
              {field.helpText ? (
                <span className="-mt-1 text-xs font-medium leading-5 text-[#617268]">{field.helpText}</span>
              ) : null}
              {field.type === "textarea" ? (
                <textarea
                  className="min-h-28 rounded-2xl border border-[#123c2d]/15 bg-[#f8f5ec] px-4 py-3 font-normal outline-none focus:border-[#1f5742]"
                  name={field.key}
                  required
                />
              ) : field.type === "checkbox" ? (
                <span className="flex items-start gap-3 rounded-2xl border border-[#123c2d]/15 bg-[#f8f5ec] p-4 font-normal">
                  <input className="mt-1" name={field.key} required type="checkbox" />
                  <span>{copy.fieldFallback}</span>
                </span>
              ) : field.type === "select" ? (
                <select
                  className="min-h-12 rounded-2xl border border-[#123c2d]/15 bg-[#f8f5ec] px-4 font-normal outline-none focus:border-[#1f5742]"
                  name={field.key}
                  required
                >
                  <option value="">{copy.optionPlaceholder}</option>
                </select>
              ) : (
                <input
                  className="min-h-12 rounded-2xl border border-[#123c2d]/15 bg-[#f8f5ec] px-4 font-normal outline-none focus:border-[#1f5742]"
                  name={field.key}
                  required
                  type={field.type}
                />
              )}
            </label>
          ))}
          {policyRequired ? (
            <label className="flex items-start gap-3 rounded-2xl border border-[#123c2d]/15 bg-[#f8f5ec] p-4 text-sm leading-6 text-[#40564d]">
              <input className="mt-1" name="policyAccepted" required type="checkbox" />
              <span>
                {copy.termsTextBefore}
                <a
                  className="font-bold text-[#123c2d] underline underline-offset-4"
                  href={isCourse ? "/legal/termos-conduta-curso-percepcao-sensorial.pdf" : `/${locale}/termos-e-condicoes`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {isCourse ? copy.termsLink : copy.generalTermsLink}
                </a>
                {copy.termsTextAfter}
              </span>
            </label>
          ) : null}
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#123c2d] px-5 text-sm font-bold text-white transition hover:bg-[#1f5742] disabled:cursor-wait disabled:opacity-70"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? copy.loading : copy.submit}
          </button>
        </form>
      ) : null}

      {message ? <p className="mt-3 text-xs leading-5 text-[#61746b]">{message}</p> : null}
    </div>
  );
}

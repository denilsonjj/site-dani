"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import type { ServiceRow } from "@/lib/cms";
import {
  businessTimeZone,
  type BookingDay,
  type BookingSchedule,
  type ServiceSchedule,
  type TimeRange,
} from "@/lib/scheduling";

type Props = {
  initialSchedule: BookingSchedule;
  onNotify?: (message: string, type?: "error" | "success") => void;
  services: ServiceRow[];
};

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const inputClass = "min-h-11 rounded-xl border border-[#123c2d]/15 bg-white px-3 text-sm outline-none transition focus:border-[#123c2d] focus:ring-2 focus:ring-[#C9A227]/25";

function serviceTitle(service: ServiceRow) {
  return service.title?.pt || service.title?.en || service.product_id;
}

function DateAvailabilityEditor({
  dates,
  defaultEnd,
  defaultStart,
  onChange,
}: {
  dates: BookingDay[];
  defaultEnd: string;
  defaultStart: string;
  onChange: (dates: BookingDay[]) => void;
}) {
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const [visibleMonth, setVisibleMonth] = useState(currentMonth);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const savedDates = new Set(dates.map((day) => day.date));
  const monthLabel = new Intl.DateTimeFormat("pt-PT", { month: "long", year: "numeric" }).format(visibleMonth);
  const firstWeekday = (new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => {
    if (index < firstWeekday) return null;
    const day = index - firstWeekday + 1;
    return `${visibleMonth.getFullYear()}-${String(visibleMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  });

  function toggleDate(date: string) {
    if (date < today || savedDates.has(date)) return;
    setSelectedDates((current) => current.includes(date)
      ? current.filter((item) => item !== date)
      : [...current, date].sort());
  }

  function addDates() {
    const additions = selectedDates.map((date): BookingDay => ({
      blocked: [],
      date,
      end: defaultEnd,
      start: defaultStart,
    }));
    onChange([...dates, ...additions].sort((left, right) => left.date.localeCompare(right.date)));
    setSelectedDates([]);
  }

  function updateDay(date: string, patch: Partial<BookingDay>) {
    onChange(dates.map((day) => day.date === date ? { ...day, ...patch } : day));
  }

  function updateBlock(date: string, index: number, patch: Partial<TimeRange>) {
    const day = dates.find((item) => item.date === date);
    if (!day) return;
    updateDay(date, { blocked: day.blocked.map((block, blockIndex) => blockIndex === index ? { ...block, ...patch } : block) });
  }

  return (
    <div className="grid gap-5">
      <div className="max-w-md rounded-2xl border border-[#123c2d]/10 bg-white p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <button
            aria-label="Mês anterior"
            className="grid h-11 w-11 place-items-center rounded-xl border border-[#123c2d]/10 disabled:opacity-30"
            disabled={visibleMonth <= currentMonth}
            onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            type="button"
          >
            <ChevronLeft size={19} />
          </button>
          <strong className="capitalize">{monthLabel}</strong>
          <button
            aria-label="Próximo mês"
            className="grid h-11 w-11 place-items-center rounded-xl border border-[#123c2d]/10"
            onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            type="button"
          >
            <ChevronRight size={19} />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase text-[#799a81]">
          {weekDays.map((day) => <span className="py-2" key={day}>{day}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => date ? (
            <button
              aria-label={`Selecionar ${date}`}
              aria-pressed={selectedDates.includes(date) || savedDates.has(date)}
              className={
                savedDates.has(date)
                  ? "aspect-square rounded-xl bg-[#C9A227]/25 text-sm font-bold text-[#705b16]"
                  : selectedDates.includes(date)
                    ? "aspect-square rounded-xl bg-[#123c2d] text-sm font-bold text-white"
                    : date < today
                      ? "aspect-square cursor-not-allowed rounded-xl text-sm text-[#aeb9b2]"
                      : "aspect-square rounded-xl text-sm font-bold text-[#40564d] transition hover:bg-[#edf2ed]"
              }
              disabled={date < today || savedDates.has(date)}
              key={date}
              onClick={() => toggleDate(date)}
              type="button"
            >
              {Number(date.slice(-2))}
            </button>
          ) : <span aria-hidden="true" key={`empty-${index}`} />)}
        </div>
        <button
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#123c2d] px-5 text-sm font-bold text-white disabled:opacity-50"
          disabled={!selectedDates.length}
          onClick={addDates}
          type="button"
        >
          <Plus size={16} />
          Adicionar datas{selectedDates.length ? ` (${selectedDates.length})` : ""}
        </button>
      </div>

      {dates.length ? (
        <div className="grid gap-3">
          {dates.map((day) => (
            <article className="rounded-2xl border border-[#123c2d]/10 bg-white p-4" key={day.date}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <strong className="capitalize text-[#123c2d]">
                    {new Intl.DateTimeFormat("pt-PT", { dateStyle: "full" }).format(new Date(`${day.date}T12:00:00Z`))}
                  </strong>
                  <p className="mt-1 text-xs text-[#617268]">Horário de Amesterdão</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="grid gap-1 text-xs font-bold text-[#617268]">
                    Início
                    <input className={inputClass} onChange={(event) => updateDay(day.date, { start: event.target.value })} type="time" value={day.start} />
                  </label>
                  <label className="grid gap-1 text-xs font-bold text-[#617268]">
                    Fim
                    <input className={inputClass} onChange={(event) => updateDay(day.date, { end: event.target.value })} type="time" value={day.end} />
                  </label>
                </div>
                <button
                  aria-label={`Remover ${day.date}`}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-[#984539]/15 text-[#984539]"
                  onClick={() => onChange(dates.filter((item) => item.date !== day.date))}
                  type="button"
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <div className="mt-4 border-t border-[#123c2d]/10 pt-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <strong className="text-sm">Bloqueios neste dia</strong>
                    <p className="mt-1 text-xs leading-5 text-[#617268]">Use para aulas, consultas ou outros compromissos.</p>
                  </div>
                  <button
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#123c2d]/12 px-4 text-sm font-bold"
                    onClick={() => updateDay(day.date, { blocked: [...day.blocked, { end: "13:00", start: "12:00" }] })}
                    type="button"
                  >
                    <Plus size={15} /> Bloquear horário
                  </button>
                </div>
                {day.blocked.length ? (
                  <div className="mt-3 grid gap-2">
                    {day.blocked.map((block, index) => (
                      <div className="flex items-end gap-2 rounded-xl bg-[#f8f5ec] p-3" key={`${day.date}-${index}`}>
                        <label className="grid flex-1 gap-1 text-xs font-bold text-[#617268]">
                          Das
                          <input className={inputClass} onChange={(event) => updateBlock(day.date, index, { start: event.target.value })} type="time" value={block.start} />
                        </label>
                        <label className="grid flex-1 gap-1 text-xs font-bold text-[#617268]">
                          Até
                          <input className={inputClass} onChange={(event) => updateBlock(day.date, index, { end: event.target.value })} type="time" value={block.end} />
                        </label>
                        <button
                          aria-label="Remover bloqueio"
                          className="grid h-11 w-11 place-items-center rounded-xl text-[#984539]"
                          onClick={() => updateDay(day.date, { blocked: day.blocked.filter((_, blockIndex) => blockIndex !== index) })}
                          type="button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-[#123c2d]/20 bg-white p-5 text-sm leading-6 text-[#617268]">
          Ainda não há datas disponíveis. Selecione vários dias no calendário e adicione todos de uma vez.
        </p>
      )}
    </div>
  );
}

export function AdminScheduleEditor({ initialSchedule, onNotify, services }: Props) {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  function serviceSettings(productId: string): ServiceSchedule {
    return schedule.services[productId] || { dates: [], durationMinutes: 60, useCustomAvailability: false };
  }

  function updateService(productId: string, patch: Partial<ServiceSchedule>) {
    const current = serviceSettings(productId);
    setSchedule((value) => ({
      ...value,
      services: { ...value.services, [productId]: { ...current, ...patch } },
    }));
  }

  async function saveSchedule() {
    setPending(true);
    setMessage("A guardar agenda...");
    const response = await fetch("/api/admin/schedule", {
      body: JSON.stringify(schedule),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorMessage = result.error || "Não foi possível guardar a agenda.";
      setMessage(errorMessage);
      onNotify?.(errorMessage, "error");
    } else {
      setSchedule(result.item);
      const successMessage = "Agenda guardada. Os clientes já verão os horários atualizados.";
      setMessage(successMessage);
      onNotify?.(successMessage);
    }
    setPending(false);
  }

  return (
    <section className="rounded-2xl border border-[#123c2d]/10 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-[#123c2d]/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-xl font-bold">Agenda de atendimentos</h2>
          <p className="mt-1 text-sm leading-6 text-[#617268]">Defina quando pode atender e bloqueie apenas os horários dos seus compromissos.</p>
        </div>
        <label className="flex min-h-12 items-center gap-3 rounded-xl bg-[#f8f5ec] px-4 text-sm font-bold">
          <input
            checked={schedule.enabled}
            className="h-5 w-5 accent-[#123c2d]"
            onChange={(event) => setSchedule((value) => ({ ...value, enabled: event.target.checked }))}
            type="checkbox"
          />
          Agenda ativa
        </label>
      </div>

      <div className="grid gap-7 p-4 sm:p-6">
        <div className="grid gap-4 rounded-2xl bg-[#f8f5ec] p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3 sm:col-span-2">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#123c2d] text-white"><Clock3 size={18} /></span>
            <div>
              <strong>Fuso horário da Dani</strong>
              <p className="mt-1 text-sm text-[#617268]">{businessTimeZone}. O cliente verá a conversão automática.</p>
            </div>
          </div>
          <label className="grid gap-2 text-sm font-bold text-[#40564d]">
            Início padrão
            <input className={inputClass} onChange={(event) => setSchedule((value) => ({ ...value, defaultStart: event.target.value }))} type="time" value={schedule.defaultStart} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-[#40564d]">
            Fim padrão
            <input className={inputClass} onChange={(event) => setSchedule((value) => ({ ...value, defaultEnd: event.target.value }))} type="time" value={schedule.defaultEnd} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-[#40564d] sm:col-start-3">
            Intervalo entre opções
            <select className={inputClass} onChange={(event) => setSchedule((value) => ({ ...value, slotIntervalMinutes: Number(event.target.value) }))} value={schedule.slotIntervalMinutes}>
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">60 minutos</option>
            </select>
          </label>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-3">
            <CalendarDays className="text-[#C9A227]" size={25} />
            <div>
              <h3 className="text-lg font-bold">Agenda principal</h3>
              <p className="text-sm leading-6 text-[#617268]">Estas datas e horários serão usados por todas as sessões sem uma agenda própria.</p>
            </div>
          </div>
          {schedule.enabled && !schedule.dates.length ? (
            <p className="mb-4 rounded-xl border border-[#C9A227]/45 bg-[#fff9e8] p-4 text-sm leading-6 text-[#705b16]">
              A agenda está ativa, mas ainda não há datas na agenda principal. Adicione e guarde pelo menos uma data para que os clientes vejam horários disponíveis.
            </p>
          ) : null}
          <DateAvailabilityEditor
            dates={schedule.dates}
            defaultEnd={schedule.defaultEnd}
            defaultStart={schedule.defaultStart}
            onChange={(dates) => setSchedule((value) => ({ ...value, dates }))}
          />
        </div>

        <div className="border-t border-[#123c2d]/10 pt-7">
          <h3 className="text-lg font-bold">Duração e exceções por sessão</h3>
          <p className="mt-1 text-sm leading-6 text-[#617268]">Normalmente cada sessão usa a agenda principal. Ative uma exceção somente quando precisar.</p>
          <div className="mt-5 grid gap-3">
            {services.map((service) => {
              const settings = serviceSettings(service.product_id);
              return (
                <article className="rounded-2xl border border-[#123c2d]/10 bg-[#fbfaf7] p-4" key={service.product_id}>
                  <div className="grid gap-4 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
                    <div>
                      <strong>{serviceTitle(service)}</strong>
                      <p className="mt-1 text-xs text-[#617268]">{settings.useCustomAvailability ? "Usa datas próprias" : "Usa a agenda principal"}</p>
                    </div>
                    <label className="grid gap-2 text-xs font-bold text-[#617268]">
                      Duração em minutos
                      <input
                        className={inputClass}
                        min="0"
                        onChange={(event) => updateService(service.product_id, { durationMinutes: Number(event.target.value) || 0 })}
                        step="15"
                        type="number"
                        value={settings.durationMinutes}
                      />
                      <span className="font-medium text-[#799a81]">Use 0 para atendimentos remotos sem agendamento.</span>
                    </label>
                    <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[#123c2d]/10 bg-white px-3 text-sm font-bold">
                      <input
                        checked={settings.useCustomAvailability}
                        className="h-5 w-5 accent-[#123c2d]"
                        onChange={(event) => updateService(service.product_id, { useCustomAvailability: event.target.checked })}
                        type="checkbox"
                      />
                      Agenda própria
                    </label>
                  </div>
                  {settings.useCustomAvailability ? (
                    <div className="mt-5 border-t border-[#123c2d]/10 pt-5">
                      <DateAvailabilityEditor
                        dates={settings.dates}
                        defaultEnd={schedule.defaultEnd}
                        defaultStart={schedule.defaultStart}
                        onChange={(dates) => updateService(service.product_id, { dates })}
                      />
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#123c2d]/10 pt-6 sm:flex-row sm:items-center">
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#123c2d] px-6 text-sm font-bold text-white disabled:opacity-50"
            disabled={pending}
            onClick={saveSchedule}
            type="button"
          >
            <Save size={17} /> Guardar agenda
          </button>
          {message ? <p className="text-sm font-bold text-[#617268]">{message}</p> : null}
        </div>
      </div>
    </section>
  );
}

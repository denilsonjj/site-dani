import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { bookingScheduleSettingKey, normaliseBookingSchedule } from "@/lib/scheduling";

export async function POST(request: Request) {
  const { error, supabase } = requireAdminRequest(request);
  if (error) return error;

  const payload = await request.json().catch(() => null) as { updatedAt?: string } | null;
  const schedule = normaliseBookingSchedule(payload);
  if (schedule.enabled) {
    const { error: schemaError } = await supabase
      .from("checkout_intake_submissions")
      .select("appointment_start")
      .limit(1);

    if (schemaError) {
      return NextResponse.json(
        { error: "A atualização da agenda ainda precisa ser aplicada no Supabase antes de ser ativada." },
        { status: 409 },
      );
    }
  }

  const record = {
    key: bookingScheduleSettingKey,
    updated_at: new Date().toISOString(),
    value: JSON.stringify(schedule),
  };

  if (!payload?.updatedAt) {
    const { data: existing, error: lookupError } = await supabase
      .from("admin_settings")
      .select("key")
      .eq("key", bookingScheduleSettingKey)
      .maybeSingle();
    if (lookupError) return NextResponse.json({ error: lookupError.message }, { status: 500 });
    if (existing) return NextResponse.json({ error: "Atualize o painel antes de guardar. A agenda está desatualizada." }, { status: 409 });
  }

  const mutation = payload?.updatedAt
    ? await supabase
      .from("admin_settings")
      .update(record)
      .eq("key", bookingScheduleSettingKey)
      .eq("updated_at", payload.updatedAt)
      .select("updated_at")
      .maybeSingle()
    : await supabase
      .from("admin_settings")
      .upsert(record, { onConflict: "key" })
      .select("updated_at")
      .maybeSingle();
  const { data, error: mutationError } = mutation;

  if (mutationError) {
    return NextResponse.json({ error: mutationError.message }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "A agenda foi alterada noutra sessão. Atualize o painel antes de guardar novamente." }, { status: 409 });

  revalidatePath("/admin");
  revalidatePath("/[locale]/sessoes", "page");
  return NextResponse.json({ item: { ...schedule, updatedAt: data.updated_at } });
}

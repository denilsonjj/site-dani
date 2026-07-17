import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { bookingScheduleSettingKey, normaliseBookingSchedule } from "@/lib/scheduling";

export async function POST(request: Request) {
  const { error, supabase } = requireAdminRequest(request);
  if (error) return error;

  const schedule = normaliseBookingSchedule(await request.json().catch(() => null));
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

  const { error: mutationError } = await supabase
    .from("admin_settings")
    .upsert(
      {
        key: bookingScheduleSettingKey,
        updated_at: new Date().toISOString(),
        value: JSON.stringify(schedule),
      },
      { onConflict: "key" },
    );

  if (mutationError) {
    return NextResponse.json({ error: mutationError.message }, { status: 500 });
  }

  revalidatePath("/admin");
  revalidatePath("/[locale]/sessoes", "page");
  return NextResponse.json({ item: schedule });
}

import { DateTime } from "luxon";
import { supabaseAdmin } from "@/lib/supabase-admin";
import AdminDashboard from "./admin-dashboard";

export const dynamic = "force-dynamic";

type Reservation = {
  id: string;
  title: string | null;
  source: string | null;
  start_date: string;
  end_date: string;
  status: string | null;
};

export default async function AdminPage() {
  const now = DateTime.now().setZone("Europe/Paris");
  const today = now.toISODate()!;
  const weekEnd = now.plus({ days: 7 }).toISODate()!;

  const { data, error } = await supabaseAdmin
    .from("reservations")
    .select("id, title, source, start_date, end_date, status")
    .neq("status", "cancelled")
    .lt("start_date", weekEnd)
    .gte("end_date", today)
    .order("start_date", { ascending: true });

  if (error) {
    throw new Error(`Impossible de charger les réservations : ${error.message}`);
  }

  const reservations = (data ?? []) as Reservation[];
  const arrivals = reservations.filter((reservation) => reservation.start_date === today);
  const departures = reservations.filter((reservation) => reservation.end_date === today);
  const present = reservations.filter(
    (reservation) => reservation.start_date <= today && reservation.end_date > today,
  );
  const upcoming = reservations.filter(
    (reservation) => reservation.start_date > today && reservation.start_date < weekEnd,
  );

  return (
    <AdminDashboard
      today={today}
      arrivals={arrivals}
      departuresCount={departures.length}
      presentCount={present.length}
      upcoming={upcoming}
    />
  );
}

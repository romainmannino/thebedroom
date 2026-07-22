export type RawReservation = {
  id: string;
  title: string | null;
  source: string | null;
  start_date: string;
  end_date: string;
  status: string | null;
};

export type NormalizedStay = {
  id: string;
  title: string;
  source: "airbnb" | "booking" | "manual" | "other";
  start_date: string;
  end_date: string;
  status: string | null;
  inferred: boolean;
  rawReservations: RawReservation[];
};

const genericTitles = [
  "reserved",
  "reservation",
  "occupé",
  "occupe",
  "blocked",
  "bloqué",
  "bloque",
  "closed",
  "not available",
  "unavailable",
  "airbnb",
  "booking",
  "booking.com",
  "airbnb (not available)",
  "closed - not available",
];

export function cleanTitle(title: string | null): string {
  return (title ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isGenericCalendarTitle(title: string | null): boolean {
  const normalized = cleanTitle(title)
    .toLowerCase()
    .replace(/[’']/g, "'");

  if (!normalized) {
    return true;
  }

  return genericTitles.some(
    (genericTitle) =>
      normalized === genericTitle ||
      normalized.startsWith(`${genericTitle} `) ||
      normalized.includes("not available") ||
      normalized.includes("indisponible"),
  );
}

function normalizedSource(
  source: string | null,
): "airbnb" | "booking" | "manual" | "other" {
  if (source === "airbnb") return "airbnb";
  if (source === "booking") return "booking";
  if (source === "manual") return "manual";

  return "other";
}

export function normalizeReservations(
  reservations: RawReservation[],
): NormalizedStay[] {
  const validReservations = reservations.filter(
    (reservation) =>
      reservation.status !== "cancelled" &&
      reservation.start_date &&
      reservation.end_date &&
      reservation.end_date > reservation.start_date,
  );

  const exactGroups = new Map<string, RawReservation[]>();

  for (const reservation of validReservations) {
    const key = `${reservation.start_date}|${reservation.end_date}`;
    const currentGroup = exactGroups.get(key) ?? [];

    currentGroup.push(reservation);
    exactGroups.set(key, currentGroup);
  }

  const normalizedStays: NormalizedStay[] = [];

  for (const group of exactGroups.values()) {
    const airbnbReservations = group.filter(
      (reservation) => reservation.source === "airbnb",
    );

    const bookingReservations = group.filter(
      (reservation) => reservation.source === "booking",
    );

    const manualReservations = group.filter(
      (reservation) => reservation.source === "manual",
    );

    const reservationWithRealName = group.find(
      (reservation) => !isGenericCalendarTitle(reservation.title),
    );

    const firstReservation = group[0];

    if (reservationWithRealName) {
      normalizedStays.push({
        id: reservationWithRealName.id,
        title: cleanTitle(reservationWithRealName.title),
        source: normalizedSource(reservationWithRealName.source),
        start_date: firstReservation.start_date,
        end_date: firstReservation.end_date,
        status: reservationWithRealName.status,
        inferred: false,
        rawReservations: group,
      });

      continue;
    }

    if (manualReservations.length > 0) {
      normalizedStays.push({
        id: manualReservations[0].id,
        title: "Blocage manuel",
        source: "manual",
        start_date: firstReservation.start_date,
        end_date: firstReservation.end_date,
        status: manualReservations[0].status,
        inferred: false,
        rawReservations: group,
      });

      continue;
    }

    /*
     * Le même créneau est bloqué dans les deux exports :
     * impossible d'attribuer sérieusement la réservation à une plateforme.
     * On le considère comme un blocage manuel ou une indisponibilité commune.
     */
    if (
      airbnbReservations.length > 0 &&
      bookingReservations.length > 0
    ) {
      normalizedStays.push({
        id: firstReservation.id,
        title: "Blocage manuel",
        source: "manual",
        start_date: firstReservation.start_date,
        end_date: firstReservation.end_date,
        status: firstReservation.status,
        inferred: true,
        rawReservations: group,
      });

      continue;
    }

    /*
     * Un blocage présent seulement dans l'export Airbnb est généralement
     * une réservation importée depuis Booking.
     */
    if (airbnbReservations.length > 0) {
      normalizedStays.push({
        id: airbnbReservations[0].id,
        title: "Réservation Booking",
        source: "booking",
        start_date: firstReservation.start_date,
        end_date: firstReservation.end_date,
        status: airbnbReservations[0].status,
        inferred: true,
        rawReservations: group,
      });

      continue;
    }

    /*
     * Un blocage présent seulement dans l'export Booking est généralement
     * une réservation importée depuis Airbnb.
     */
    if (bookingReservations.length > 0) {
      normalizedStays.push({
        id: bookingReservations[0].id,
        title: "Réservation Airbnb",
        source: "airbnb",
        start_date: firstReservation.start_date,
        end_date: firstReservation.end_date,
        status: bookingReservations[0].status,
        inferred: true,
        rawReservations: group,
      });

      continue;
    }

    normalizedStays.push({
      id: firstReservation.id,
      title: "Indisponible",
      source: "other",
      start_date: firstReservation.start_date,
      end_date: firstReservation.end_date,
      status: firstReservation.status,
      inferred: true,
      rawReservations: group,
    });
  }

  return normalizedStays.sort((firstStay, secondStay) =>
    firstStay.start_date.localeCompare(secondStay.start_date),
  );
}

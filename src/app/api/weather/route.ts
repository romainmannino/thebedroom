import { NextResponse } from "next/server";

export const revalidate = 900;

export async function GET() {
  try {
    const endpoint = new URL("https://api.open-meteo.com/v1/forecast");
    endpoint.searchParams.set("latitude", "45.796");
    endpoint.searchParams.set("longitude", "5.046");
    endpoint.searchParams.set(
      "current",
      "temperature_2m,apparent_temperature,weather_code,wind_speed_10m",
    );
    endpoint.searchParams.set(
      "daily",
      "weather_code,temperature_2m_max,temperature_2m_min",
    );
    endpoint.searchParams.set("forecast_days", "2");
    endpoint.searchParams.set("timezone", "Europe/Paris");

    const response = await fetch(endpoint, { next: { revalidate: 900 } });
    if (!response.ok) throw new Error("Service météo indisponible");

    const data = await response.json();

    return NextResponse.json({
      success: true,
      weather: {
        current: {
          temperature: Math.round(data.current.temperature_2m),
          apparentTemperature: Math.round(data.current.apparent_temperature),
          weatherCode: data.current.weather_code,
          windSpeed: Math.round(data.current.wind_speed_10m),
        },
        today: {
          weatherCode: data.daily.weather_code[0],
          min: Math.round(data.daily.temperature_2m_min[0]),
          max: Math.round(data.daily.temperature_2m_max[0]),
        },
        tomorrow: {
          weatherCode: data.daily.weather_code[1],
          min: Math.round(data.daily.temperature_2m_min[1]),
          max: Math.round(data.daily.temperature_2m_max[1]),
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erreur météo" },
      { status: 500 },
    );
  }
}

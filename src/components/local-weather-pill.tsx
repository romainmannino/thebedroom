"use client";

import { Cloud, CloudRain, CloudSun, Snowflake, Sun, Wind } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Weather = {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  windSpeed: number;
};

function weatherLabel(code: number) {
  if (code === 0) return "Ciel dégagé";
  if ([1, 2].includes(code)) return "Éclaircies";
  if (code === 3) return "Nuageux";
  if ([45, 48].includes(code)) return "Brouillard";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Pluie";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Neige";
  if ([95, 96, 99].includes(code)) return "Orage";
  return "Météo locale";
}

function WeatherIcon({ code }: { code: number }) {
  if (code === 0) return <Sun size={20} />;
  if ([1, 2].includes(code)) return <CloudSun size={20} />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <Snowflake size={20} />;
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) return <CloudRain size={20} />;
  return <Cloud size={20} />;
}

export function LocalWeatherPill() {
  const pathname = usePathname();
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;

    fetch("/api/weather")
      .then((response) => response.json())
      .then((result) => {
        if (result.success) setWeather(result.weather);
      })
      .catch(() => undefined);
  }, [pathname]);

  if (pathname !== "/" || !weather) return null;

  return (
    <div className="fixed left-4 top-20 z-30 rounded-[18px] border border-white/20 bg-black/55 px-3 py-2.5 text-white shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
          <WeatherIcon code={weather.weatherCode} />
        </span>
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/55">Météo à Jonage</p>
          <div className="mt-0.5 flex items-center gap-2">
            <strong className="text-lg leading-none">{weather.temperature}°</strong>
            <span className="text-[11px] text-white/70">{weatherLabel(weather.weatherCode)}</span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-[9px] text-white/45">
            <Wind size={10} /> Vent {weather.windSpeed} km/h
          </p>
        </div>
      </div>
    </div>
  );
}

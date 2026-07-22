"use client";

import { Cloud, CloudRain, CloudSun, Snowflake, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Forecast = {
  weatherCode: number;
  min: number;
  max: number;
};

type Weather = {
  current: {
    temperature: number;
    apparentTemperature: number;
    weatherCode: number;
    windSpeed: number;
  };
  today: Forecast;
  tomorrow: Forecast;
};

function weatherLabel(code: number) {
  if (code === 0) return "Dégagé";
  if ([1, 2].includes(code)) return "Éclaircies";
  if (code === 3) return "Nuageux";
  if ([45, 48].includes(code)) return "Brouillard";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Pluie";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Neige";
  if ([95, 96, 99].includes(code)) return "Orage";
  return "Météo";
}

function WeatherIcon({ code, size = 18 }: { code: number; size?: number }) {
  if (code === 0) return <Sun size={size} />;
  if ([1, 2].includes(code)) return <CloudSun size={size} />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <Snowflake size={size} />;
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) return <CloudRain size={size} />;
  return <Cloud size={size} />;
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
    <div className="fixed right-4 top-4 z-30 w-[178px] rounded-[20px] border border-white/20 bg-black/55 p-3 text-white shadow-xl backdrop-blur-md sm:right-[max(1rem,calc((100vw-860px)/2+1rem))]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.15em] text-white/55">Météo à Jonage</p>
          <div className="mt-1 flex items-center gap-2">
            <WeatherIcon code={weather.current.weatherCode} size={20} />
            <strong className="text-xl leading-none">{weather.current.temperature}°</strong>
          </div>
        </div>
        <span className="text-[10px] text-white/70">{weatherLabel(weather.current.weatherCode)}</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/15 pt-2.5">
        <ForecastItem label="Aujourd’hui" forecast={weather.today} />
        <ForecastItem label="Demain" forecast={weather.tomorrow} />
      </div>
    </div>
  );
}

function ForecastItem({ label, forecast }: { label: string; forecast: Forecast }) {
  return (
    <div className="rounded-[12px] bg-white/10 p-2 text-center">
      <p className="text-[8px] font-black uppercase tracking-[0.08em] text-white/50">{label}</p>
      <div className="mt-1 flex items-center justify-center gap-1.5">
        <WeatherIcon code={forecast.weatherCode} size={14} />
        <span className="text-[10px] font-bold">{forecast.min}° / {forecast.max}°</span>
      </div>
    </div>
  );
}

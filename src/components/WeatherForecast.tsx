import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  Cloud,
  Droplets,
  Moon,
  Sun,
  Thermometer,
  Wind,
  CloudRain,
  CloudSun,
  CloudMoon,
  MapPin,
  Gauge,
  AlertCircle,
} from "lucide-react";
import MyLocation from "./MyLocation";
import { pt } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { useMoonPhase } from "../hooks/useMoonPhase";
import { useSkyCondition } from "../hooks/useSkyCondition";
import { useWeather } from "../hooks/useWeather";
import { LocationDto } from "../types/locations";

interface WeatherForecastProps {
  position: LocationDto | null;
}

function getWeatherIcon(sky: string, isDay: boolean = true) {
  switch (sky) {
    case "clear":
      return isDay ? Sun : Moon;
    case "partly-cloudy":
      return isDay ? CloudSun : CloudMoon;
    case "cloudy":
    case "overcast":
      return Cloud;
    default:
      return CloudRain;
  }
}

export function WeatherForecast({ position }: WeatherForecastProps) {
  const { t, i18n } = useTranslation();
  const { translateMoonPhase } = useMoonPhase();
  const { translateSkyCondition } = useSkyCondition();
  const { weather, loading, error } = useWeather({
    position: position || { lat: 39.477037, lng: -8.24094 },
  });

  const formatDay = (date: Date, lang: string) => {
    const locale = lang === "pt" ? pt : enUS;
    return format(date, "EEE", { locale });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center text-red-500 dark:text-red-400">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{t("common.error")}</span>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const WeatherIcon = getWeatherIcon(weather.current.sky);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("dashboard.weather.title")}
        </h2>
        {location && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-1" />
            <span>
              {position?.lat?.toFixed(4)}°, {position?.lng?.toFixed(4)}°
            </span>
          </div>
        )}
      </div>

      {/* Current Weather */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <WeatherIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {Math.round(weather.current.temperature)}°C
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {translateSkyCondition(weather.current.sky)}
            </p>
            <MyLocation />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {weather.current.wind.speed} km/h {weather.current.wind.direction}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {weather.current.humidity}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {weather.current.pressure} hPa
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CloudRain className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {weather.current.precipitation} mm
            </span>
          </div>
        </div>
      </div>

      {/* Daily Forecast */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {weather?.daily?.map((day: any) => (
          <div
            key={day.date.toISOString()}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center"
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              {formatDay(day.date, i18n.language)}
            </p>
            <div className="flex items-center justify-center mb-2">
              <Thermometer className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
                {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
              </span>
            </div>
            <div className="flex items-center justify-center">
              <CloudRain className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-300 ml-1">
                {Math.round(day.precipitationProbability)}%
              </span>
            </div>
            <div className="flex items-center justify-center mt-2">
              <Moon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-300 ml-1">
                {translateMoonPhase(day.moonPhase)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

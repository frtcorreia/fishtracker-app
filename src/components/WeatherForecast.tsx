import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
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
  Gauge
} from 'lucide-react';
import MyLocation from './MyLocation'

interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    pressure: number;
    precipitation: number;
    sky: string;
    wind: {
      speed: number;
      direction: string;
    };
    visibility: number;
    moonPhase: string;
  };
  daily: Array<{
    date: Date;
    maxTemp: number;
    minTemp: number;
    precipitation: number;
    precipitationProbability: number;
    moonPhase: string;
    pressure: number;
  }>;
}

interface WeatherForecastProps {
  weather: WeatherData;
  loading: boolean;
  location?: {
    lat: number;
    lng: number;
  };
}

function getWeatherIcon(sky: string, isDay: boolean = true) {
  switch (sky) {
    case 'clear':
      return isDay ? Sun : Moon;
    case 'partly-cloudy':
      return isDay ? CloudSun : CloudMoon;
    case 'cloudy':
    case 'overcast':
      return Cloud;
    default:
      return CloudRain;
  }
}

export function WeatherForecast({ weather, loading, location }: WeatherForecastProps) {
  const { t } = useTranslation();

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

  const WeatherIcon = getWeatherIcon(weather.current.sky);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboard.weather.title')}
        </h2>
        {location && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°</span>
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
              {weather.current.sky}
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
        {weather.daily.slice(0, 7).map((day) => (
          <div
            key={day.date.toISOString()}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center"
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              {format(day.date, 'EEE')}
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
                {day.moonPhase.split(' ')[0]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
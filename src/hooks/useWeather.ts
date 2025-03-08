import { useState, useEffect } from "react";
import { getWeatherData } from "../lib/weatherApi";
import { getWeatherForecast } from "../lib/weather";
import { LocationDto } from "../types/locations";

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

interface UseWeatherProps {
  position: LocationDto;
}

export const useWeather = ({ position }: UseWeatherProps) => {
  const { lat, lng } = position;
  const [weather, setWeather] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!lat || !lng) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getWeatherForecast(lat, lng);

        setWeather(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch weather data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng]);

  const refetch = async () => {
    if (!lat || !lng) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getWeatherData(lat, lng);
      setWeather(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data"
      );
    } finally {
      setLoading(false);
    }
  };

  return { weather, loading, error, refetch };
};

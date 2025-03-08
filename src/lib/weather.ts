import { format } from "date-fns";

interface WeatherResponse {
  hourly: {
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation: number[];
    pressure_msl: number[];
    cloud_cover: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    visibility: number[];
    time: string[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
  };
  hourly_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    precipitation: string;
    pressure_msl: string;
    cloud_cover: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
    visibility: string;
  };
}

export const MOON_PHASES = [
  { value: "new-moon", label: "New Moon" },
  { value: "waxing-crescent", label: "Waxing Crescent" },
  { value: "first-quarter", label: "First Quarter" },
  { value: "waxing-gibbous", label: "Waxing Gibbous" },
  { value: "full-moon", label: "Full Moon" },
  { value: "waning-gibbous", label: "Waning Gibbous" },
  { value: "last-quarter", label: "Last Quarter" },
  { value: "waning-crescent", label: "Waning Crescent" },
];

export const getSkyCondition = (cloudCover: number) => {
  if (cloudCover < 10) return "clear";
  if (cloudCover < 30) return "partly-cloudy";
  if (cloudCover < 70) return "cloudy";
  return "overcast";
};

export const getWindDirection = (degrees: number) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

// Calculate moon phase based on date
export const getMoonPhase = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Calculating the Julian Date
  const jd =
    367 * year -
    Math.floor((7 * (year + Math.floor((month + 9) / 12))) / 4) +
    Math.floor((275 * month) / 9) +
    day -
    730530 +
    2451545.5;

  // Calculate the approximate phase of the moon
  const ip = (jd - 2451550.1) / 29.530588853; // Lunar cycle
  const age = ip - Math.floor(ip);

  // Convert phase to value between 0 and 8
  const phase = Math.round(age * 8);

  // Return the corresponding moon phase
  switch (phase % 8) {
    case 0:
      return MOON_PHASES[0].label; // New Moon
    case 1:
      return MOON_PHASES[1].label; // Waxing Crescent
    case 2:
      return MOON_PHASES[2].label; // First Quarter
    case 3:
      return MOON_PHASES[3].label; // Waxing Gibbous
    case 4:
      return MOON_PHASES[4].label; // Full Moon
    case 5:
      return MOON_PHASES[5].label; // Waning Gibbous
    case 6:
      return MOON_PHASES[6].label; // Last Quarter
    case 7:
      return MOON_PHASES[7].label; // Waning Crescent
    default:
      return MOON_PHASES[0].label; // New Moon
  }
};

export async function getWeatherData(
  lat: number,
  lng: number,
  date: string,
  time: string
) {
  const formattedDate = format(
    new Date(`${date}T${time}`),
    "yyyy-MM-dd'T'HH:mm"
  );

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,relative_humidity_2m,precipitation,pressure_msl,cloud_cover,wind_speed_10m,wind_direction_10m,visibility&start_date=${date}&end_date=${date}`;

  try {
    const response = await fetch(url);
    const data: WeatherResponse = await response.json();

    // Find the index for the closest hour
    const hours = data.hourly.temperature_2m.length;
    const targetTime = new Date(formattedDate);
    const startTime = new Date(`${date}T00:00`);
    const hourIndex = Math.floor(
      (targetTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
    );

    if (hourIndex >= 0 && hourIndex < hours) {
      return {
        temperature: data.hourly.temperature_2m[hourIndex],
        humidity: data.hourly.relative_humidity_2m[hourIndex],
        pressure: data.hourly.pressure_msl[hourIndex],
        precipitation: data.hourly.precipitation[hourIndex],
        sky: getSkyCondition(data.hourly.cloud_cover[hourIndex]),
        wind: {
          speed: data.hourly.wind_speed_10m[hourIndex],
          direction: getWindDirection(
            data.hourly.wind_direction_10m[hourIndex]
          ),
        },
        visibility: data.hourly.visibility[hourIndex] / 1000, // Convert to km
        moonPhase: getMoonPhase(targetTime),
      };
    }

    throw new Error("No weather data available for the specified time");
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

export async function getWeatherForecast(lat: number, lng: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,relative_humidity_2m,precipitation,pressure_msl,cloud_cover,wind_speed_10m,wind_direction_10m,visibility&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

  try {
    const response = await fetch(url);
    const data: WeatherResponse = await response.json();

    // Process daily forecast data
    const dailyForecast = data.daily.time.map((time, index) => {
      const date = new Date(time);
      return {
        date,
        maxTemp: data.daily.temperature_2m_max[index],
        minTemp: data.daily.temperature_2m_min[index],
        precipitation: data.daily.precipitation_sum[index],
        precipitationProbability:
          data.daily.precipitation_probability_max[index],
        moonPhase: getMoonPhase(date),
      };
    });

    // Get current conditions from the first hour
    const currentConditions = {
      temperature: data.hourly.temperature_2m[0],
      humidity: data.hourly.relative_humidity_2m[0],
      pressure: data.hourly.pressure_msl[0],
      precipitation: data.hourly.precipitation[0],
      sky: getSkyCondition(data.hourly.cloud_cover[0]),
      wind: {
        speed: data.hourly.wind_speed_10m[0],
        direction: getWindDirection(data.hourly.wind_direction_10m[0]),
      },
      visibility: data.hourly.visibility[0] / 1000,
      moonPhase: getMoonPhase(new Date()),
    };

    return {
      current: currentConditions,
      daily: dailyForecast,
    };
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    throw error;
  }
}

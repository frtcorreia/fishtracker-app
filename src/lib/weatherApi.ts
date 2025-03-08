interface WeatherAPIResponse {
  current: {
    temp_c: number;
    humidity: number;
    pressure_mb: number;
    precip_mm: number;
    condition: {
      text: string;
      code: number;
    };
    wind_kph: number;
    wind_dir: string;
    vis_km: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        totalprecip_mm: number;
        daily_chance_of_rain: number;
      };
      astro: {
        moon_phase: string;
      };
    }>;
  };
}

// Mapeia os códigos de condição do tempo para nosso formato interno
const mapConditionCode = (code: number): string => {
  // Códigos baseados na documentação da WeatherAPI.com
  switch (true) {
    case code === 1000:
      return "clear";
    case code === 1003:
      return "partly-cloudy";
    case [1006, 1009].includes(code):
      return "cloudy";
    case [1063, 1150, 1153, 1168, 1171].includes(code):
      return "light-rain";
    case [1180, 1183, 1186, 1189, 1192, 1195].includes(code):
      return "rain";
    case [1198, 1201, 1243, 1246].includes(code):
      return "heavy-rain";
    case [1087, 1273, 1276, 1279, 1282].includes(code):
      return "thunderstorm";
    case [1066, 1210, 1213, 1216].includes(code):
      return "light-snow";
    case [1219, 1222, 1225].includes(code):
      return "snow";
    case [1114, 1117, 1225, 1237, 1258, 1261, 1264].includes(code):
      return "heavy-snow";
    case [1030, 1135, 1147].includes(code):
      return "mist";
    case code === 1069:
      return "fog";
    default:
      return "cloudy";
  }
};

export const getWeatherData = async (lat: number, lon: number) => {
  try {
    const apiKey = process.env.VITE_WEATHER_API_KEY;
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=no`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data: WeatherAPIResponse = await response.json();

    return {
      current: {
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        pressure: data.current.pressure_mb,
        precipitation: data.current.precip_mm,
        sky: mapConditionCode(data.current.condition.code),
        wind: {
          speed: data.current.wind_kph,
          direction: data.current.wind_dir,
        },
        visibility: data.current.vis_km,
        moonPhase: data.forecast.forecastday[0].astro.moon_phase,
      },
      daily: data.forecast.forecastday.map((day) => ({
        date: new Date(day.date),
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
        precipitation: day.day.totalprecip_mm,
        precipitationProbability: day.day.daily_chance_of_rain,
        moonPhase: day.astro.moon_phase,
        pressure: data.current.pressure_mb, // A API gratuita não fornece previsão de pressão diária
      })),
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

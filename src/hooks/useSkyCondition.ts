import { useTranslation } from "react-i18next";

type SkyCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "overcast"
  | "rain"
  | "thunderstorm"
  | "snow"
  | "mist"
  | string;

export const useSkyCondition = () => {
  const { t } = useTranslation();

  const skyConditions: Record<string, string> = {
    clear: t("weather.sky.clear"),
    "partly-cloudy": t("weather.sky.partlyCloudy"),
    cloudy: t("weather.sky.cloudy"),
    overcast: t("weather.sky.overcast"),
    rain: t("weather.sky.rain"),
    "light-rain": t("weather.sky.lightRain"),
    "heavy-rain": t("weather.sky.heavyRain"),
    thunderstorm: t("weather.sky.thunderstorm"),
    snow: t("weather.sky.snow"),
    "light-snow": t("weather.sky.lightSnow"),
    "heavy-snow": t("weather.sky.heavySnow"),
    mist: t("weather.sky.mist"),
    fog: t("weather.sky.fog"),
    haze: t("weather.sky.haze"),
  };

  const translateSkyCondition = (condition: SkyCondition): string => {
    const normalizedCondition = condition.toLowerCase().trim();
    return skyConditions[normalizedCondition] || condition;
  };

  return { translateSkyCondition };
};

import { useTranslation } from "react-i18next";

type SkyCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "overcast"
  | "rain"
  | "light-rain"
  | "heavy-rain"
  | "thunderstorm"
  | "snow"
  | "light-snow"
  | "heavy-snow"
  | "mist"
  | "fog"
  | "haze"
  | string;

export const useSkyCondition = () => {
  const { t } = useTranslation();

  const translateSkyCondition = (condition: SkyCondition): string => {
    const normalizedCondition = condition.toLowerCase().trim();

    const conditionMap: Record<string, string> = {
      clear: "clear",
      "partly-cloudy": "partlyCloudy",
      cloudy: "cloudy",
      overcast: "overcast",
      rain: "rain",
      "light-rain": "lightRain",
      "heavy-rain": "heavyRain",
      thunderstorm: "thunderstorm",
      snow: "snow",
      "light-snow": "lightSnow",
      "heavy-snow": "heavySnow",
      mist: "mist",
      fog: "fog",
      haze: "haze",
    };

    const translationKey = conditionMap[normalizedCondition];

    if (translationKey) {
      return t(`weather.sky.${translationKey}`);
    }

    return condition;
  };

  return { translateSkyCondition };
};

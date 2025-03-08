import { useTranslation } from "react-i18next";

type MoonPhase =
  | "newMoon"
  | "waxingCrescent"
  | "firstQuarter"
  | "waxingGibbous"
  | "fullMoon"
  | "waningGibbous"
  | "lastQuarter"
  | "waningCrescent"
  | string;

export const useMoonPhase = () => {
  const { t } = useTranslation();

  const translateMoonPhase = (phase: MoonPhase): string => {
    // Normaliza a fase da lua para o formato esperado
    const normalizedPhase = phase
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace("moon", "")
      .replace("waning", "waning")
      .replace("waxing", "waxing");

    // Mapeia as fases normalizadas para as chaves de tradução
    const phaseMap: Record<string, string> = {
      new: "newMoon",
      waxingcrescent: "waxingCrescent",
      firstquarter: "firstQuarter",
      waxinggibbous: "waxingGibbous",
      full: "fullMoon",
      waninggibbous: "waningGibbous",
      lastquarter: "lastQuarter",
      waningcrescent: "waningCrescent",
    };

    const translationKey = phaseMap[normalizedPhase];

    if (translationKey) {
      return t(`weather.moonPhase.${translationKey}`);
    }

    // Se não encontrar uma tradução, retorna a fase original
    return phase;
  };

  return { translateMoonPhase };
};

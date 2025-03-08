type MoonPhaseTranslations = {
  [key: string]: string;
};

export function useMoonPhase() {
  const moonPhaseTranslations: MoonPhaseTranslations = {
    newMoon: "Lua Nova",
    waxingCrescent: "Lua Crescente",
    firstQuarter: "Quarto Crescente",
    waxingGibbous: "Lua Gibosa Crescente",
    fullMoon: "Lua Cheia",
    waningGibbous: "Lua Gibosa Minguante",
    lastQuarter: "Quarto Minguante",
    waningCrescent: "Lua Minguante",
  };

  function formatString(str: string) {
    let words = str.trim().split(/\s+/);

    if (words.length > 1) {
      words[0] = words[0].charAt(0).toLowerCase() + words[0].slice(1);
      words[1] = words[1].charAt(0).toUpperCase() + words[1].slice(1);
    }

    return words.join("");
  }

  const translateMoonPhase = (phase: string): string => {
    const normalizedPhase = formatString(phase.trim());

    if (moonPhaseTranslations[normalizedPhase]) {
      return moonPhaseTranslations[normalizedPhase];
    }

    return phase;
  };

  return { translateMoonPhase };
}

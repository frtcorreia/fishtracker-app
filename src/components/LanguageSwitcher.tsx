import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "pt" ? "en" : "pt";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 text-sm font-medium text-primary-light hover:text-primary transition-colors"
    >
      {i18n.language === "pt" ? "EN" : "PT"}
    </button>
  );
}

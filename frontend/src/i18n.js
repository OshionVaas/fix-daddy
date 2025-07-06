import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import en from "./locales/en/translation.json";
import ar from "./locales/ar/translation.json";
import si from "./locales/si/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      si: { translation: si },
    },
    fallbackLng: "en", // ✅ Fallback language
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;

// src/components/LanguageSwitcher.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex space-x-2 text-sm">
      <button
        onClick={() => i18n.changeLanguage("en")}
        className={`px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600`}
      >
        🇬🇧 English
      </button>
      <button
        onClick={() => i18n.changeLanguage("si")}
        className={`px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600`}
      >
        🇱🇰 Sinhala
      </button>
    </div>
  );
};

export default LanguageSwitcher;

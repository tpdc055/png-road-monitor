"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

// PNG Language Support - English and Tok Pisin
export type Language = "en" | "tp";

interface Translations {
  [key: string]: {
    en: string;
    tp: string; // Tok Pisin
  };
}

const translations: Translations = {
  // Navigation
  "nav.projects": {
    en: "Projects",
    tp: "Ol Wok",
  },
  "nav.gps": {
    en: "GPS Tracking",
    tp: "GPS Painim",
  },
  "nav.progress": {
    en: "Progress Mapping",
    tp: "Wok i Go Hap",
  },
  "nav.financial": {
    en: "Financial",
    tp: "Mani Samting",
  },

  // Header
  "header.title": {
    en: "PNG Road Construction Monitor",
    tp: "PNG Rot Bildim Lukautim Sistem",
  },
  "header.subtitle": {
    en: "Papua New Guinea Department of Works",
    tp: "Papua Niugini Gavman Wok Ofis",
  },
  "header.welcome": {
    en: "Welcome",
    tp: "Welkam",
  },

  // Common Actions
  "action.signin": {
    en: "Sign In",
    tp: "Go Insait",
  },
  "action.signout": {
    en: "Sign Out",
    tp: "Go Ausait",
  },
  "action.save": {
    en: "Save",
    tp: "Seiv",
  },
  "action.cancel": {
    en: "Cancel",
    tp: "Lusim",
  },
  "action.edit": {
    en: "Edit",
    tp: "Senisim",
  },
  "action.delete": {
    en: "Delete",
    tp: "Rausim",
  },

  // Project Status
  "status.planning": {
    en: "Planning",
    tp: "Tingting",
  },
  "status.active": {
    en: "Active",
    tp: "i Wok",
  },
  "status.completed": {
    en: "Completed",
    tp: "Pinis",
  },
  "status.onhold": {
    en: "On Hold",
    tp: "Wet Smol",
  },

  // Provinces
  "province.central": {
    en: "Central Province",
    tp: "Sentral Provins",
  },
  "province.western_highlands": {
    en: "Western Highlands",
    tp: "Westen Hailans",
  },
  "province.morobe": {
    en: "Morobe Province",
    tp: "Morobe Provins",
  },
  "province.ncd": {
    en: "Port Moresby (NCD)",
    tp: "Pot Mosbi (NCD)",
  },

  // Financial Terms
  "financial.budget": {
    en: "Budget",
    tp: "Mani Kaunim",
  },
  "financial.spent": {
    en: "Spent",
    tp: "Mani Pinis",
  },
  "financial.remaining": {
    en: "Remaining",
    tp: "Mani Stap",
  },
  "financial.funding_source": {
    en: "Funding Source",
    tp: "Mani i Kam Long We",
  },

  // Form Labels
  "form.email": {
    en: "Email Address",
    tp: "Imel Adres",
  },
  "form.password": {
    en: "Password",
    tp: "Passwot",
  },
  "form.project_name": {
    en: "Project Name",
    tp: "Nem Bilong Wok",
  },
  "form.location": {
    en: "Location",
    tp: "Ples",
  },
  "form.description": {
    en: "Description",
    tp: "Tok Klia",
  },

  // Demo Credentials
  "demo.title": {
    en: "Demo Credentials",
    tp: "Triaim Nem na Passwot",
  },
  "demo.description": {
    en: "Click on any credential below to auto-fill the login form",
    tp: "Klikim wanpela nem bilong triaim",
  },

  // User Roles
  "role.administrator": {
    en: "Administrator",
    tp: "Bosim Man",
  },
  "role.project_manager": {
    en: "Project Manager",
    tp: "Wok Bosim Man",
  },
  "role.site_engineer": {
    en: "Site Engineer",
    tp: "Enjinia",
  },
  "role.financial_officer": {
    en: "Financial Officer",
    tp: "Mani Man",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "png_road_monitor_language",
    ) as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "tp")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("png_road_monitor_language", lang);
  };

  const translate = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t: translate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Language selector component
export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage("en")}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          language === "en"
            ? "png-bg-red text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("tp")}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          language === "tp"
            ? "png-bg-yellow text-black"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        TP
      </button>
    </div>
  );
}

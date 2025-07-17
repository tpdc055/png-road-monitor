"use client";

import { createContext, useContext, useState } from "react";

interface SystemSettings {
  systemName: string;
  organizationName: string;
  timezone: string;
  language: string;
}

interface SystemSettingsContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
}

const SystemSettingsContext = createContext<
  SystemSettingsContextType | undefined
>(undefined);

export function SystemSettingsProvider({
  children,
}: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings>({
    systemName: "PNG Road Construction Monitor",
    organizationName: "Papua New Guinea Department of Works",
    timezone: "Pacific/Port_Moresby",
    language: "en",
  });

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SystemSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SystemSettingsContext.Provider>
  );
}

export function useSystemSettings() {
  const context = useContext(SystemSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useSystemSettings must be used within a SystemSettingsProvider",
    );
  }
  return context;
}

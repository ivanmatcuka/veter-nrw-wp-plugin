import { SettingsResponse } from '@/service';
import { createContext, useContext } from 'react';

type SettingsContextType = {
  settings: Partial<SettingsResponse>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
};

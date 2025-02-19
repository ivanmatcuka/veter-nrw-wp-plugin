import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { getSettings, SettingsResponse } from './service';
type SettingsContextType = {
  settings: Partial<SettingsResponse>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const AI_MODELS = ['ChatGPT', 'Claude'];

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Partial<SettingsResponse>>({});

  useEffect(() => {
    getSettings().then((settings) => {
      if (!settings) return;

      setSettings(settings);
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
};

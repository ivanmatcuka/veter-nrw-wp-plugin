import { Typography } from '@mui/material';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Page } from '@/app/components/Page';

import { getSettings, SettingsResponse } from './service';

type SettingsContextType = {
  settings: Partial<SettingsResponse>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const AI_MODELS = ['ChatGPT', 'Claude'];

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [settings, setSettings] = useState<Partial<SettingsResponse>>({});

  const { t } = useTranslation('common');

  const isSettingsValid = useMemo(
    () => Object.values(settings).every(Boolean),
    [settings],
  );

  useEffect(() => {
    getSettings().then((settings) => {
      if (!settings) return;
      setSettings(settings);
    });
  }, []);

  if (!isSettingsValid) {
    return (
      <Page>
        <Typography variant="h6" gutterBottom>
          {t('settingsError')}
        </Typography>
      </Page>
    );
  }

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

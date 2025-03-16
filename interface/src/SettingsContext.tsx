import { Typography } from '@mui/material';
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Page } from '@/components/Page';

import { getSettings, SettingsResponse } from '@/service';

type SettingsContextType = {
  settings: Partial<SettingsResponse>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

const REQUIRED_FIELDS: (keyof SettingsResponse)[] = [
  'api_chat_gpt',
  'api_claude',
  'default_model',
  'tones',
  'news_prompt',
  'news_header_prompt',
  'morning_prompt',
  'weather_prompt',
  'evening_prompt',
];

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [settings, setSettings] = useState<Partial<SettingsResponse>>({});

  const { t } = useTranslation('common');

  const isSettingsValid = useMemo(
    () => REQUIRED_FIELDS.every((field) => !!settings[field]),
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

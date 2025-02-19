import { Box, MenuItem, Select, TextField, Typography } from '@mui/material';
import { FC } from 'react';

import { Page } from '@/components/Page';

import { useTranslation } from 'react-i18next';
import { AI_MODELS, useSettings } from '../SettingsContext';

type SettingsFieldProps = { name: string; label: string; value?: string };
const SettingsField: FC<SettingsFieldProps> = ({ name, label, value = '' }) => (
  <TextField
    fullWidth
    label={label}
    name={name}
    value={value}
    slotProps={{ inputLabel: { shrink: true } }}
    disabled
  />
);

export const Settings = () => {
  const { settings } = useSettings();
  const { t } = useTranslation('settings');

  return (
    <Page>
      <Typography variant="h6" gutterBottom>
        {t('toneOfVoice')}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}></Box>

      <Box display="flex" flexDirection="column" gap={2} component="form">
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6" gutterBottom>
            {t('apiKeys')}
          </Typography>
          <SettingsField
            label="API ChatGPT"
            name="api_chat_gpt"
            value={settings.api_chat_gpt}
          />
          <SettingsField
            label="API Claude"
            name="api_claude"
            value={settings.api_claude}
          />
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6" gutterBottom>
            {t('defaultModel')}
          </Typography>
          <Select
            fullWidth
            name="default_model"
            value={settings.default_model}
            disabled
          >
            {AI_MODELS.map((model) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6" gutterBottom>
            {t('morningText')}
          </Typography>
          <SettingsField
            label={t('header')}
            name="morning_text_header"
            value={settings.morning_text_header}
          />
          <SettingsField
            label={t('before')}
            name="morning_text_before"
            value={settings.morning_text_before}
          />
          <SettingsField
            label={t('blockHeader')}
            name="morning_text_block_header"
            value={settings.morning_text_block_header}
          />
          <SettingsField
            label={t('after')}
            name="morning_text_after"
            value={settings.morning_text_after}
          />
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6" gutterBottom>
            {t('eveningText')}
          </Typography>
          <SettingsField
            label={t('header')}
            name="evening_text_header"
            value={settings.evening_text_header}
          />
          <SettingsField
            label={t('before')}
            name="evening_text_before"
            value={settings.evening_text_before}
          />
          <SettingsField
            label={t('blockHeader')}
            name="evening_text_block_header"
            value={settings.evening_text_block_header}
          />
          <SettingsField
            label={t('after')}
            name="evening_text_after"
            value={settings.evening_text_after}
          />
        </Box>
      </Box>
    </Page>
  );
};

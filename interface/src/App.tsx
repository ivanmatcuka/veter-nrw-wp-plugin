import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EventForm } from './app/components/EventForm';
import { NewsForm } from './app/components/NewsForm';
import { TabPanel } from './app/components/TabPanel';
import { a11yProps } from './utils/helpers';

function App() {
  const [value, setValue] = useState(0);
  const { t } = useTranslation('common');

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box maxWidth="md">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label={t('news')} {...a11yProps(0)} />
          <Tab label={t('morning')} {...a11yProps(1)} />
          <Tab label={t('evening')} {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <NewsForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <EventForm daytime="morning" />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <EventForm daytime="evening" />
      </TabPanel>
    </Box>
  );
}

export default App;

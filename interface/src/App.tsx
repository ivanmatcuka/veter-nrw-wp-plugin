import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EventForm } from './components/EventForm';
import { NewsForm } from './components/NewsForm';
import { TabPanel } from './components/TabPanel';
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
        <Tabs onChange={handleChange} value={value}>
          <Tab label={t('news')} {...a11yProps(0)} />
          <Tab label={t('morning')} {...a11yProps(1)} />
          <Tab label={t('evening')} {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel index={0} value={value}>
        <NewsForm />
      </TabPanel>
      <TabPanel index={1} value={value}>
        <EventForm daytime="morning" />
      </TabPanel>
      <TabPanel index={2} value={value}>
        <EventForm daytime="evening" />
      </TabPanel>
    </Box>
  );
}

export default App;

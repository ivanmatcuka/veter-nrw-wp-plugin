import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EventForm } from './EventForm';
import { NewsForm } from './NewsForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
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
      <CustomTabPanel value={value} index={0}>
        <NewsForm />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <EventForm daytime="morning" />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <EventForm daytime="evening" />
      </CustomTabPanel>
    </Box>
  );
}

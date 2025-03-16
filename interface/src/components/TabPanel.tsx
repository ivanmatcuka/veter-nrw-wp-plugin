import { Box } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

export const TabPanel: FC<PropsWithChildren<TabPanelProps>> = ({
  children,
  index,
  value,
  ...other
}) => (
  <div
    aria-labelledby={`simple-tab-${index}`}
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    role="tabpanel"
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

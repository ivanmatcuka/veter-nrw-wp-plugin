import { Box } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

export const Page: FC<PropsWithChildren> = ({ children }) => (
  <Box display="flex" flexDirection="column" gap={4}>
    {children}
  </Box>
);

import { Box } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

export const Page: FC<PropsWithChildren> = ({ children }) => (
  <Box
    display="flex"
    flexDirection="column"
    gap={4}
    minWidth={{ xs: '100%', md: '800px' }}
  >
    {children}
  </Box>
);

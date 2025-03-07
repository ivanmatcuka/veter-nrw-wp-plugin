import { Box, BoxProps } from '@mui/material';
import { FC, FormEventHandler, PropsWithChildren } from 'react';

type PageProps = Pick<BoxProps, 'component'> & {
  onSubmit?: FormEventHandler<HTMLFormElement>;
};
export const Page: FC<PropsWithChildren<PageProps>> = ({
  children,
  component = 'div',
  ...rest
}) => (
  <Box
    display="flex"
    flexDirection="column"
    gap={4}
    component={component}
    {...rest}
  >
    {children}
  </Box>
);

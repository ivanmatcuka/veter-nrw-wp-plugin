import { Box, BoxProps } from '@mui/material';
import { FC, FormEventHandler, PropsWithChildren } from 'react';

type PageProps = {
  onSubmit?: FormEventHandler<HTMLFormElement>;
} & Pick<BoxProps, 'component'>;
export const Page: FC<PropsWithChildren<PageProps>> = ({
  children,
  component = 'div',
  ...rest
}) => (
  <Box
    component={component}
    display="flex"
    flexDirection="column"
    gap={4}
    {...rest}
  >
    {children}
  </Box>
);

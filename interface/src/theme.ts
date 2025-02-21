import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: ['var(--font-ubuntu)'].join(','),
  },
  palette: {
    primary: {
      main: '#490678',
    },
    grey: {
      500: '#dfdfdf',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        disableElevation: true,
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        content: {
          width: '100%',
        },
      },
    },
  },
  cssVariables: true,
});

export default theme;

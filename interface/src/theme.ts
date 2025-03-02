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
    MuiAlert: {
      styleOverrides: {
        message: {
          flex: 1,
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        content: {
          width: '100%',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
  },
  cssVariables: true,
});

export default theme;

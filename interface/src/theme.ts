import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiAccordionSummary: {
      styleOverrides: {
        content: {
          width: '100%',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        message: {
          flex: 1,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
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
  palette: {
    grey: {
      500: '#dfdfdf',
    },
    primary: {
      main: '#490678',
    },
  },
  typography: {
    fontFamily: ['var(--font-ubuntu)'].join(','),
  },
});

export default theme;

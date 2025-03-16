import { ThemeProvider } from '@mui/material/styles';
import domReady from '@wordpress/dom-ready';
import React from 'react';
import { createRoot } from 'react-dom/client';

// Relative paths here to reflect this component is
// the root of the React app
import App from './App';
import './i18n';
import './index.css';
import { SettingsProvider } from './SettingsContext';
import theme from './theme';

const root = createRoot(document.getElementById('react-root') as HTMLElement);

domReady(() => {
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </ThemeProvider>
    </React.StrictMode>,
  );
});

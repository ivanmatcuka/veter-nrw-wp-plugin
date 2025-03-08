import { SettingsProvider } from '@/app/SettingsContext';
import { ThemeProvider } from '@mui/material/styles';
import domReady from '@wordpress/dom-ready';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n';
import './index.css';
import theme from './theme';

const root = createRoot(document.getElementById('root') as HTMLElement);

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

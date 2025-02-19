import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import './index.css';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: {
        generate: 'Generate',
        model: 'Model',
        news: 'News',
        morning: 'Morning',
        evening: 'Evening',
      },
      settings: {
        title: 'Settings',
        toneOfVoice: 'Tone of voice',
        apiKeys: 'API Keys',
        apiChatGPT: 'API ChatGPT',
        apiClaude: 'API Claude',
        defaultModel: 'Default Model',
        morningText: 'Morning Text',
        eveningText: 'Evening Text',
        header: 'Header',
        before: 'Before',
        blockHeader: 'Block Header',
        after: 'After',
        submit: 'Submit',
      },
      newsForm: {
        articleText: 'Article Text',
        articleUrl: 'Article URL',
        model: 'Model',
        paragraphCount: 'Paragraph Count',
        tone: 'Tone',
        additionalInstructions: 'Additional Instructions',
        generate: 'Generate',
      },
      morningForm: {
        weather: 'Weather',
        weatherTextPlaceholder: 'Enter weather text...',
        news: 'News',
        model: 'Model',
        newsTextPlaceholder: 'Enter news text...',
        newsUrlPlaceholder: 'Enter news URL...',
        removeNewsItem: 'Remove news item',
        addNewsItem: 'Add news item',
        additionalInstructionsPlaceholder: 'Enter additional instructions...',
        generate: 'Generate',
        text: 'Text',
        textHeaderPlaceholder: 'Enter text header...',
        textBeforePlaceholder: 'Enter text before...',
        textBlockHeaderPlaceholder: 'Enter text block header...',
        textAfterPlaceholder: 'Enter text after...',
      },
      eveningForm: {
        weather: 'Weather',
        weatherTextPlaceholder: 'Enter weather text...',
        news: 'News',
        model: 'Model',
        newsTextPlaceholder: 'Enter news text...',
        newsUrlPlaceholder: 'Enter news URL...',
        removeNewsItem: 'Remove news item',
        addNewsItem: 'Add news item',
        additionalInstructionsPlaceholder: 'Enter additional instructions...',
        generate: 'Generate',
      },
    },
  },
  lng: 'en', // if you're using a language detector, do not define the lng option
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
});

export default i18n;

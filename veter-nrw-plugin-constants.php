<?php

const OPTIONS_PAGE_TITLE = 'BETEP Plugin Settings';
const OPTIONS_MENU_TITLE = 'BETEP Plugin Settings';
const OPTIONS_MENU_SLUG = 'veter-options';
const PAGE_TITLE = 'BETEP';
const MENU_TITLE = 'BETEP';
const MENU_SLUG = 'veter';
const PLUGIN_SETTINGS_SLUG = 'veter-plugin-settings';
const SCRIPT_NAME = 'veter-nrw-script';
const STYLE_NAME = 'veter-nrw-style';
const SCRIPT_URL = 'interface/dist/assets/index.js';
const STYLE_URL = 'interface/dist/assets/index.css';
const AJAX_OBJECT_NAME = 'wp_ajax_obj';
const AJAX_NONCE_NAME = 'nonce';
const FIELDS = [
  'API Keys' => [
    'api_chat_gpt' => [
      'type' => 'text',
      'label' => 'API ChatGPT',
    ],
    'api_claude' => [
      'type' => 'text',
      'label' => 'API Claude',
    ]
  ],
  'Model' => [
    'default_model' => [
      'type' => 'select',
      'label' => 'Default Model',
      'options' => [
        'ChatGPT',
        'Claude',
      ],
    ],
    'tones' => [
      'type' => 'text',
      'label' => 'Tones',
    ],
  ],
  'Morning Text' => [
    'morning_text_header' => [
      'type' => 'text',
      'label' => 'Header',
    ],
    'morning_text_before' => [
      'type' => 'text',
      'label' => 'Before',
    ],
    'morning_text_block_header' => [
      'type' => 'text',
      'label' => 'Block Header',
    ],
    'morning_text_after' => [
      'type' => 'text',
      'label' => 'After',
    ]
  ],
  'Evening Text' => [
    'evening_text_header' => [
      'type' => 'text',
      'label' => 'Header',
    ],
    'evening_text_before' => [
      'type' => 'text',
      'label' => 'Before',
    ],
    'evening_text_block_header' => [
      'type' => 'text',
      'label' => 'Block Header',
    ],
    'evening_text_after' => [
      'type' => 'text',
      'label' => 'After',
    ],
  ],
  'Prompts' => [
    'news_prompt' => [
      'type' => 'textarea',
      'label' => 'News Prompt',
    ],
    'news_header_prompt' => [
      'type' => 'textarea',
      'label' => 'News Header Prompt',
    ],
    'morning_prompt' => [
      'type' => 'textarea',
      'label' => 'Morning Prompt',
    ],
    'weather_prompt' => [
      'type' => 'textarea',
      'label' => 'Weather Prompt',
    ],
    'evening_prompt' => [
      'type' => 'textarea',
      'label' => 'Evening Prompt',
    ],
  ]
];

<?php

/**
 * @package NRW
 * @version 1.0.0
 */
/*
Plugin Name: Veter NRW Plugin
Plugin URI: http://wordpress.org/plugins/hello-dolly/
Description: This is not just a plugin, it symbolizes the hope and enthusiasm of an entire generation summed up in two words sung most famously by Louis Armstrong: Hello, Dolly. When activated you will randomly see a lyric from <cite>Hello, Dolly</cite> in the upper right of your admin screen on every page.
Author: Ivan Matcuka
Version: 1.0.0
Author URI: https://github.com/ivanmatcuka
*/

namespace VeterNRWPlugin;

use Twig\Loader\FilesystemLoader;
use Twig\Environment;
use buzzingpixel\twigswitch\SwitchTwigExtension;

defined('ABSPATH') or die();

require(__DIR__ . '/vendor/autoload.php');

const PLUGIN_SETTINGS = 'veter-plugin-settings';

class VeterNRWPlugin
{
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
          'Chat GPT',
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
      'weather_morning_prompt' => [
        'type' => 'textarea',
        'label' => 'Weather Morning Prompt',
      ],
      'evening_prompt' => [
        'type' => 'textarea',
        'label' => 'Evening Prompt',
      ],
      'weather_evening_prompt' => [
        'type' => 'textarea',
        'label' => 'Weather Evening Prompt',
      ],
    ]
  ];

  protected Environment $twig;

  public function __construct()
  {
    $this->twig = new Environment(new FilesystemLoader(__DIR__ . '/templates'), [
      'cache' => false,
    ]);
    $this->twig->addExtension(new SwitchTwigExtension());
  }

  public function load()
  {
    add_action('rest_api_init', [$this, 'registerApiRoutes']);
    add_action('admin_menu', [$this, 'addPluginOptionsPage']);
    add_action('admin_init', [$this, 'addPluginSettings']);
  }



  public function addPluginOptionsPage()
  {
    add_options_page(
      'Veter NRW Plugin Settings',
      'Veter NRW Plugin Settings',
      'manage_options',
      'veter',
      [$this, 'renderAdminPage'],
    );

    $this->addExtraMenuPage();
  }

  public function renderAdminPage()
  {
    $output = file_get_contents(__DIR__ . '/dist/index.html');

    echo $output;
    echo $this->twig->render('settings.twig', [
      'output' => $this->getOutput()
    ]);
  }

  public function addExtraMenuPage()
  {
    add_menu_page(
      'Veter NRW',
      'Veter NRW',
      'manage_options',
      'veter-nrw',
      [$this, 'renderExtraSettingsPage'],
      'dashicons-welcome-widgets-menus',
      80
    );
  }

  public function renderExtraSettingsPage()
  {
    wp_enqueue_script_module(
      'veter-nrw-script',
      plugins_url('interface/dist/assets/index.js', __FILE__),
    );
    wp_enqueue_style(
      'veter-nrw-style',
      plugins_url('interface/dist/assets/index.css', __FILE__),
    );

    echo $this->twig->render('index.twig');
  }

  public function renderRield($field, $key)
  {
    try {
      $value = get_option($key, $field['value']);
      echo $this->twig->render('field.twig', [
        'field' => $field,
        'value' => $value,
        'key' => $key,
      ]);
    } catch (\Exception $e) {
      echo $e->getMessage();
    }
  }

  public function addField($field, $key, $section)
  {
    $renderer = function () use ($field, $key) {
      $this->renderRield($field, $key);
    };

    add_settings_field(
      $key,
      $field['label'],
      $renderer,
      PLUGIN_SETTINGS,
      $section,
    );
  }

  public function addFields($fields, $section)
  {
    foreach ($fields as $key => $field) {
      register_setting(PLUGIN_SETTINGS, $key);
      $this->addField($field, $key, $section);
    }
  }


  public function addPluginSettings()
  {
    foreach (self::FIELDS as $section => $fields) {
      $renderer = function () use ($section) {
        echo "<p>Settings for {$section}</p>";
      };

      add_settings_section(
        $section,
        $section,
        $renderer,
        PLUGIN_SETTINGS
      );

      $this->addFields($fields, $section);
    }
  }

  public function registerApiRoutes()
  {
    register_rest_route('veter-nrw-plugin/v1', '/settings', [
      'methods' => 'GET',
      'callback' => [$this, 'getSettings'],
      'permission_callback' => '__return_true'
    ]);
  }

  public function getSettings()
  {
    $settings = [];

    foreach (self::FIELDS as $_ => $fields) {
      foreach ($fields as $key => $field) {
        $settings[$key] = get_option($key, $field['value']);
      }
    }

    return rest_ensure_response($settings);
  }

  private function getOutput()
  {
    // TODO: refactor
    ob_start();
    settings_fields(PLUGIN_SETTINGS);
    do_settings_sections(PLUGIN_SETTINGS);
    submit_button();
    $output = ob_get_contents();
    ob_end_clean();

    return $output;
  }
}

$plugin = new VeterNRWPlugin();
$plugin->load();

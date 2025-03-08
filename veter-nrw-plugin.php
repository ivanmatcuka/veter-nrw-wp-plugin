<?php

/**
 * @package NRW
 * @version 1.0.0
 */
/*
Plugin Name: Veter NRW Plugin
Plugin URI: http://wordpress.org/plugins/veter-nrw/
Description: This plugin is meant to generate news for Veter NRW.
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
include_once(__DIR__ . 'include.php');

class VeterNRWPlugin
{

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
    add_action('admin_init', [$this, 'registerPluginOptions']);
  }

  public function addPluginOptionsPage()
  {
    add_options_page(
      OPTIONS_PAGE_TITLE,
      OPTIONS_MENU_TITLE,
      'manage_options',
      OPTIONS_MENU_SLUG,
      [$this, 'renderOptionsPage'],
    );

    $this->addMenuPage();
  }

  public function renderOptionsPage()
  {
    echo $this->twig->render('options.twig', [
      'output' => $this->getOutput()
    ]);
  }

  public function addMenuPage()
  {
    add_menu_page(
      PAGE_TITLE,
      MENU_TITLE,
      'manage_options',
      MENU_SLUG,
      [$this, 'renderMenuPage'],
      'dashicons-welcome-widgets-menus',
      80
    );
  }

  public function renderMenuPage()
  {
    wp_enqueue_script_module(
      SCRIPT_NAME,
      plugins_url(SCRIPT_URL, __FILE__),
    );

    wp_enqueue_style(
      STYLE_NAME,
      plugins_url(STYLE_URL, __FILE__),
    );

    echo $this->twig->render('index.twig');
  }

  public function registerPluginOptions()
  {
    foreach (FIELDS as $section => $fields) {
      $renderer = function () use ($section) {
        echo "<p>Settings for {$section}</p>";
      };

      add_settings_section(
        $section,
        $section,
        $renderer,
        PLUGIN_SETTINGS_SLUG
      );

      $this->addFields($fields, $section);
    }
  }

  public function addFields($fields, $section)
  {
    foreach ($fields as $key => $field) {
      register_setting(PLUGIN_SETTINGS_SLUG, $key);
      $this->addField($field, $key, $section);
    }
  }

  public function addField($field, $key, $section)
  {
    $renderer = function () use ($field, $key) {
      $this->renderField($field, $key);
    };

    add_settings_field(
      $key,
      $field['label'],
      $renderer,
      PLUGIN_SETTINGS_SLUG,
      $section,
    );
  }

  public function renderField($field, $key)
  {
    $value = get_option($key, $field['value']);

    echo $this->twig->render('field.twig', [
      'field' => $field,
      'value' => $value,
      'key' => $key,
    ]);
  }

  public function registerApiRoutes()
  {
    register_rest_route('veter-nrw-plugin/v1', '/settings', [
      'methods' => 'GET',
      'callback' => [$this, 'getSettings'],
      'permission_callback' => '__return_true'
    ]);

    register_rest_route('veter-nrw-plugin/v1', '/create-news-draft', [
      'methods' => 'POST',
      'callback' => [$this, 'createNewsDraft'],
      'permission_callback' => '__return_true'
    ]);

    register_rest_route('veter-nrw-plugin/v1', '/create-daytime-draft', [
      'methods' => 'POST',
      'callback' => [$this, 'createDaytimeDraft'],
      'permission_callback' => '__return_true'
    ]);
  }

  public function getSettings()
  {
    $settings = [];

    foreach (FIELDS as $_ => $fields) {
      foreach ($fields as $key => $field) {
        $settings[$key] = get_option($key, $field['value']);
      }
    }

    return rest_ensure_response($settings);
  }

  public function createNewsDraft($request)
  {
    $paragraphs = explode("\n", $request['content']);

    return rest_ensure_response(wp_insert_post([
      'post_type' => 'post',
      'post_title' => sanitize_text_field($paragraphs[0]),
      'post_content' => implode("\n", array_slice($paragraphs, 1)),
      'post_status' => 'draft',
    ]));
  }

  public function createDaytimeDraft($request)
  {
    $weather = $request['weather'];
    $news = $request['news'];
    $textBefore = $request['textBefore'];
    $textBlockHeader = $request['textBlockHeader'];
    $textAfter = $request['textAfter'];

    $blocks = $this->twig->render('post.twig', [
      'weather' => sanitize_text_field($weather),
      'textBefore' => sanitize_text_field($textBefore),
      'textBlockHeader' => sanitize_text_field($textBlockHeader),
      'news' => json_decode($news),
      'textAfter' => sanitize_text_field($textAfter),
    ]);


    return rest_ensure_response(wp_insert_post([
      'post_type' => 'post',
      'post_title' => $request['title'],
      'post_content' => $blocks,
      'post_status' => 'draft',
    ]));
  }

  private function getOutput()
  {
    // TODO: refactor
    ob_start();
    settings_fields(PLUGIN_SETTINGS_SLUG);
    do_settings_sections(PLUGIN_SETTINGS_SLUG);
    submit_button();
    $output = ob_get_contents();
    ob_end_clean();

    return $output;
  }
}

$plugin = new VeterNRWPlugin();
$plugin->load();

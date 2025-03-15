<?php

/**
 * @package BETEP
 * @version 1.0.0
 */
/*
Plugin Name: BETEP Plugin
Plugin URI: http://wordpress.org/plugins/veter-nrw/
Description: This plugin is meant to generate news for BETEP.
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
require(__DIR__ . '/veter-nrw-plugin-constants.php');

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
    add_action('admin_menu', [$this, 'addOptionsPage']);
    add_action('admin_init', [$this, 'registerOptions']);

    add_action('wp_ajax_get_settings', [$this, 'getSettings']);
    add_action('wp_ajax_create_news_draft', [$this, 'createNewsDraft']);
    add_action('wp_ajax_create_daytime_draft', [$this, 'createDaytimeDraft']);
  }

  public function enqueueScripts()
  {
    $src = plugins_url(SCRIPT_URL, __FILE__);

    wp_register_script(SCRIPT_NAME, $src);
    wp_localize_script(
      SCRIPT_NAME,
      AJAX_OBJECT_NAME,
      array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce(AJAX_NONCE_NAME),
      )
    );
    wp_enqueue_script(SCRIPT_NAME, $src, NULL, NULL, array(
      'in_footer' => true,
      'strategy'  => 'defer',
    ));
    wp_enqueue_style(
      STYLE_NAME,
      plugins_url(STYLE_URL, __FILE__),
    );
  }


  /**
   * Registers the options page where the plugin settings live.
   */
  public function addOptionsPage()
  {
    add_options_page(
      OPTIONS_PAGE_TITLE,
      OPTIONS_MENU_TITLE,
      'publish_posts',
      OPTIONS_MENU_SLUG,
      [$this, 'renderOptionsPage'],
    );

    $this->addMenuPage();
  }

  /**
   * Registers the menu page where the main plugin interface lives.
   * Then registered a dynamic hook that only loads the assets on
   * that page.
   */
  public function addMenuPage()
  {
    $suffix = add_menu_page(
      PAGE_TITLE,
      MENU_TITLE,
      'publish_posts',
      MENU_SLUG,
      [$this, 'renderMenuPage'],
      'dashicons-welcome-widgets-menus',
      80
    );

    add_action('admin_print_scripts-' . $suffix, [$this, 'enqueueScripts']);
  }

  public function renderOptionsPage()
  {
    echo $this->twig->render('options.twig', [
      'output' => $this->getOutput()
    ]);
  }

  public function renderMenuPage()
  {
    echo $this->twig->render('index.twig');
  }

  public function registerOptions()
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

  public function getSettings()
  {
    check_ajax_referer(AJAX_NONCE_NAME);

    $settings = [];

    foreach (FIELDS as $_ => $fields) {
      foreach ($fields as $key => $_) {
        $settings[$key] = get_option($key);
      }
    }

    return wp_send_json($settings);
  }

  public function createNewsDraft()
  {
    check_ajax_referer(AJAX_NONCE_NAME);

    $paragraphs = explode("\n", $_REQUEST['content']);

    return wp_send_json(wp_insert_post([
      'post_type' => 'post',
      'post_title' => sanitize_text_field($paragraphs[0]),
      'post_content' => implode("\n", array_slice($paragraphs, 1)),
      'post_status' => 'draft',
    ]));
  }

  public function createDaytimeDraft()
  {
    check_ajax_referer(AJAX_NONCE_NAME);

    $weather = $_POST['weather'];
    $news = $_POST['news'];
    $textBefore = $_POST['textBefore'];
    $textBlockHeader = $_POST['textBlockHeader'];
    $textAfter = $_POST['textAfter'];

    $blocks = $this->twig->render('post.twig', [
      'weather' => sanitize_text_field($weather),
      'textBefore' => sanitize_text_field($textBefore),
      'textBlockHeader' => sanitize_text_field($textBlockHeader),
      'news' => json_decode(html_entity_decode(stripslashes($news))),
      'textAfter' => sanitize_text_field($textAfter),
    ]);

    return wp_send_json(wp_insert_post([
      'post_type' => 'post',
      'post_title' => $_REQUEST['title'],
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

if (is_admin()) {
  $plugin = new VeterNRWPlugin();
  $plugin->load();
}

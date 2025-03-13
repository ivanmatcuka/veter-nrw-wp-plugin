declare module 'stringinject';

/**
 * The object that is passed to the client side
 * via wp_localize_script.
 */
declare const wp_ajax_obj: {
  nonce: string;
  ajax_url: string;
};

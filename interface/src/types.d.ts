declare module 'stringinject';

/**
 * The object that is passed to the client side
 * via wp_localize_script.
 */
declare const wp_ajax_obj: {
  ajax_url: string;
  nonce: string;
};

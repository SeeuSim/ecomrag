/**
* A map from configuration value name to value all the configuration values and secrets in ecomrag.
* __Note__: Any encrypted configuration values are decrypted and ready for use in this map.
*/
export interface AppConfiguration {
  GADGET_ENV: string | undefined;
  /**
  * The value for the NODE_ENV environment variable set in the Gadget Environment Variables settings section. 
  */
  NODE_ENV: string | undefined;
  /**
  * The value for the EMBEDDING_ENDPOINT environment variable set in the Gadget Environment Variables settings section. 
  */
  EMBEDDING_ENDPOINT: string | undefined;
  /**
  * The value for the BUCKET_NAME environment variable set in the Gadget Environment Variables settings section. 
  */
  BUCKET_NAME: string | undefined;
  /**
  * The value for the ACCESS_KEY_ID environment variable set in the Gadget Environment Variables settings section. 
  */
  ACCESS_KEY_ID: string | undefined;
  /**
  * The value for the SECRET_ACCESS_KEY environment variable set in the Gadget Environment Variables settings section. 
  */
  SECRET_ACCESS_KEY: string | undefined;
  /**
  * The value for the BUCKET_NAME_CHAT environment variable set in the Gadget Environment Variables settings section. 
  */
  BUCKET_NAME_CHAT: string | undefined;
  /**
  * The value for the CAPTIONING_ENDPOINT environment variable set in the Gadget Environment Variables settings section. 
  */
  CAPTIONING_ENDPOINT: string | undefined;
  /**
  * The value for the SHOPIFY_APP_CLIENT_SECRET environment variable set in the Gadget Environment Variables settings section. 
  */
  SHOPIFY_APP_CLIENT_SECRET: string | undefined;
  /**
  * The value for the CAPTION_QUEUE_URL environment variable set in the Gadget Environment Variables settings section. 
  */
  CAPTION_QUEUE_URL: string | undefined;
  /**
  * The value for the EMBED_QUEUE_URL environment variable set in the Gadget Environment Variables settings section. 
  */
  EMBED_QUEUE_URL: string | undefined;
};


declare global {
  namespace NodeJS {
    interface ProcessEnv extends AppConfiguration {
    }
  }
}

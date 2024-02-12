import type { OperationContext, Exchange } from "@urql/core";
import { pipe, map } from "wonka";
import { GadgetConnection, AuthenticationMode, GadgetTransaction, InternalModelManager } from "@gadgetinc/api-client-core";
import type { ClientOptions as ApiClientOptions, AnyClient } from '@gadgetinc/api-client-core';
import type { DocumentNode } from 'graphql';
import type {
  Scalars,
} from "./types";
import { ChatLogManager } from "./models/ChatLog.js";
import { SessionManager } from "./models/Session.js";
import { ShopifyGdprRequestManager } from "./models/ShopifyGdprRequest.js";
import { ShopifyProductManager } from "./models/ShopifyProduct.js";
import { ShopifyProductImageManager } from "./models/ShopifyProductImage.js";
import { ShopifyShopManager } from "./models/ShopifyShop.js";
import { ShopifySyncManager } from "./models/ShopifySync.js";
import { RecommendedProductManager } from "./models/RecommendedProduct.js";
import { CurrentSessionManager } from "./models/CurrentSession.js";

type InternalModelManagers = {
  chatLog: InternalModelManager;
  session: InternalModelManager;
  shopifyGdprRequest: InternalModelManager;
  shopifyProduct: InternalModelManager;
  shopifyProductImage: InternalModelManager;
  shopifyShop: InternalModelManager;
  shopifySync: InternalModelManager;
  recommendedProduct: InternalModelManager;
};

type ClientOptions = Omit<ApiClientOptions, "environment"> & { environment?: string };
const productionEnv = "production";
const fallbackEnv = "development";
const $modelRelationships = Symbol.for("gadget/modelRelationships");

/**
 * Return the implicit environment
 * We specifically use the string `process.env.NODE_ENV` or similar so that bundlers like webpack or vite can string replace this value in built source codes with the user's desired value.
 * In browsers or other environments, `process` may be undefined, so we catch any errors and return undefined.
 */
const getImplicitEnv = () => {
  try {
    return process.env.NODE_ENV;
  } catch (error) {
    return undefined;
  }
}

/**
 * Root object used for interacting with the "ecomrag" API. `Client` has `query` and `mutation` functions for executing raw GraphQL queries and mutations, as well as `ModelManager` objects for manipulating models with a JavaScript API. Client also wraps a `connection`, which implements the transport layer if you need access to that.
 * */
export class Client implements AnyClient {
  connection: GadgetConnection;

  chatLog: ChatLogManager;
  session: SessionManager;
  shopifyGdprRequest: ShopifyGdprRequestManager;
  shopifyProduct: ShopifyProductManager;
  shopifyProductImage: ShopifyProductImageManager;
  shopifyShop: ShopifyShopManager;
  shopifySync: ShopifySyncManager;
  recommendedProduct: RecommendedProductManager;
  currentSession: CurrentSessionManager;

  /**
  * Namespaced object for accessing models via the Gadget internal APIs, which provide lower level and higher privileged operations directly against the database. Useful for maintenance operations like migrations or correcting broken data, and for implementing the high level actions.
  *
  * Returns an object of model API identifiers to `InternalModelManager` objects.
  *
  * Example:
  * `api.internal.user.findOne(...)`
  */
  internal: InternalModelManagers;

  /**
   * The list of environments with a customized API root endpoint
   */
  apiRoots: Record<string, string> = {"development":"https://ecomrag--development.gadget.app/","production":"https://ecomrag.gadget.app/"};

  /** @deprecated */
  developmentApiRoot = this.apiRoots[fallbackEnv];
  /** @deprecated */
  productionApiRoot = this.apiRoots[productionEnv];

  applicationId = "89286";
  [$modelRelationships] = {"chatLog":{"recommendedProducts":{"type":"HasManyThrough","model":"shopifyProduct"}},"session":{"shop":{"type":"BelongsTo","model":"shopifyShop"}},"shopifyGdprRequest":{"shop":{"type":"BelongsTo","model":"shopifyShop"}},"shopifyProduct":{"images":{"type":"HasMany","model":"shopifyProductImage"},"shop":{"type":"BelongsTo","model":"shopifyShop"},"chatRecommendations":{"type":"HasManyThrough","model":"chatLog"}},"shopifyProductImage":{"product":{"type":"BelongsTo","model":"shopifyProduct"},"shop":{"type":"BelongsTo","model":"shopifyShop"}},"shopifyShop":{"gdprRequests":{"type":"HasMany","model":"shopifyGdprRequest"},"syncs":{"type":"HasMany","model":"shopifySync"},"products":{"type":"HasMany","model":"shopifyProduct"},"productImages":{"type":"HasMany","model":"shopifyProductImage"}},"shopifySync":{"shop":{"type":"BelongsTo","model":"shopifyShop"}},"recommendedProduct":{"chatLog":{"type":"BelongsTo","model":"chatLog"},"product":{"type":"BelongsTo","model":"shopifyProduct"}}};
  environment: string;

  constructor(options?: ClientOptions) {
    // for old, non-multi-environment apps (this one), we only accept development or production as environments, and we look in NODE_ENV to determine the environment if not passed explicitly
    this.environment = (options?.environment ?? getImplicitEnv() ?? fallbackEnv).toLocaleLowerCase();

    if (this.environment != fallbackEnv && this.environment != productionEnv) {
      console.warn("Invalid environment", this.environment, `defaulting to ${fallbackEnv}`);
      this.environment = fallbackEnv;
    }
    const apiRoot = this.environment == productionEnv ? this.productionApiRoot : this.developmentApiRoot

    const exchanges = {...options?.exchanges};
    if (this.environment !== productionEnv) {
      const devHarnessExchange: Exchange = ({ forward }) => {
        return operations$ => {
          const operationResult$ = forward(operations$)

          return pipe(
            operationResult$,
            map(result => {
              if (typeof window !== "undefined" && typeof CustomEvent === "function") {
                const event = new CustomEvent("gadget:devharness:graphqlresult", { detail: result });
                window.dispatchEvent(event);
              }


              return result;
            })
          );
        };
      };

      exchanges.beforeAll = [
        devHarnessExchange,
        ...(exchanges.beforeAll ?? []),
      ];
    }

    this.connection = new GadgetConnection({
      endpoint: new URL("api/graphql", apiRoot).toString(),
      applicationId: this.applicationId,
      authenticationMode: options?.authenticationMode ?? (typeof window == 'undefined' ? { anonymous: true } : { browserSession: true }),
      ...options,
      exchanges,
      environment: this.environment,
    });

    if (typeof window != 'undefined' && this.connection.authenticationMode == AuthenticationMode.APIKey && !(options as any)?.authenticationMode?.dangerouslyAllowBrowserApiKey) {
      throw new Error("GGT_BROWSER_API_KEY_USAGE: Using a Gadget API key to authenticate this client object is insecure and will leak your API keys to attackers. Please use a different authentication mode.")

    }

    this.chatLog = new ChatLogManager(this.connection);
    this.session = new SessionManager(this.connection);
    this.shopifyGdprRequest = new ShopifyGdprRequestManager(this.connection);
    this.shopifyProduct = new ShopifyProductManager(this.connection);
    this.shopifyProductImage = new ShopifyProductImageManager(this.connection);
    this.shopifyShop = new ShopifyShopManager(this.connection);
    this.shopifySync = new ShopifySyncManager(this.connection);
    this.recommendedProduct = new RecommendedProductManager(this.connection);
    this.currentSession = new CurrentSessionManager(this.connection);

    this.internal = {
      chatLog: new InternalModelManager("chatLog", this.connection, {
      	pluralApiIdentifier: "chatLogs",
        // @ts-ignore
	      hasAmbiguousIdentifier: false,
      }),
      session: new InternalModelManager("session", this.connection, {
      	pluralApiIdentifier: "sessions",
        // @ts-ignore
	      hasAmbiguousIdentifier: false,
      }),
      shopifyGdprRequest: new InternalModelManager("shopifyGdprRequest", this.connection, {
      	pluralApiIdentifier: "shopifyGdprRequests",
        // @ts-ignore
	      hasAmbiguousIdentifier: false,
      }),
      shopifyProduct: new InternalModelManager("shopifyProduct", this.connection, {
      	pluralApiIdentifier: "shopifyProducts",
        // @ts-ignore
	      hasAmbiguousIdentifier: false,
      }),
      shopifyProductImage: new InternalModelManager("shopifyProductImage", this.connection, {
      	pluralApiIdentifier: "shopifyProductImages",
        // @ts-ignore
	      hasAmbiguousIdentifier: false,
      }),
      shopifyShop: new InternalModelManager("shopifyShop", this.connection, {
      	pluralApiIdentifier: "shopifyShops",
        // @ts-ignore
	      hasAmbiguousIdentifier: false,
      }),
      shopifySync: new InternalModelManager("shopifySync", this.connection, {
      	pluralApiIdentifier: "shopifySyncs",
        // @ts-ignore
	      hasAmbiguousIdentifier: false,
      }),
      recommendedProduct: new InternalModelManager("recommendedProduct", this.connection, {
      	pluralApiIdentifier: "recommendedProducts",
        // @ts-ignore
	      hasAmbiguousIdentifier: false,
      }),
    };
  }



  /** Run an arbitrary GraphQL query. */
  async query(graphQL: string | DocumentNode, variables?: Record<string, any>, options?: Partial<OperationContext>) {
    const {data, error} = await this.connection.currentClient.query(graphQL, variables, options).toPromise();
    if (error) throw error
    return data;
  }

  /** Run an arbitrary GraphQL mutation. */
  async mutate(graphQL: string | DocumentNode, variables?: Record<string, any>, options?: Partial<OperationContext>) {
    const {data, error} = await this.connection.currentClient.mutation(graphQL, variables, options).toPromise();
    if (error) throw error
    return data;
  }

  /** Start a transaction against the Gadget backend which will atomically commit (or rollback). */
  transaction = async <T>(callback: (transaction: GadgetTransaction) => Promise<T>): Promise<T> => {
    return await this.connection.transaction(callback)
  }

  /**
   * `fetch` function that works the same as the built-in `fetch` function, but automatically passes authentication information for this API client.
   *
   * @example
   * await api.fetch("https://myapp--development.gadget.app/foo/bar");
   *
   * @example
   * // fetch a relative URL from the endpoint this API client is configured to fetch from
   * await api.fetch("/foo/bar");
   **/
  async fetch(input: RequestInfo | URL, init: RequestInit = {}) {
    return await this.connection.fetch(input, init);
  }

  /**
  * Get a new direct upload token for file uploads to directly to cloud storage.
  * See https://docs.gadget.dev/guides/storing-files#direct-uploads-using-tokens for more information
  * @return { url: string, token: string } A `url` to upload one file to, and a token for that file to pass back to Gadget as an action input.
  */
  getDirectUploadToken = async (): Promise<{url: string, token: string}> => {
    const result = await this.query(`query GetDirectUploadToken($nonce: String) { gadgetMeta { directUploadToken(nonce: $nonce) { url, token } } }`, {nonce: Math.random().toString(36).slice(2, 7)}, {
      requestPolicy: "network-only",
    });
    return result.gadgetMeta.directUploadToken;
  }

  toString() {
    return `GadgetAPIClient<${this.environment}>`;
  }

  toJSON() {
    return this.toString()
  }
}

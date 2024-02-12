import type { OperationContext } from "@urql/core";
import { GadgetConnection, GadgetTransaction, InternalModelManager } from "@gadgetinc/api-client-core";
import type { ClientOptions as ApiClientOptions, AnyClient } from '@gadgetinc/api-client-core';
import type { DocumentNode } from 'graphql';
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
type ClientOptions = Omit<ApiClientOptions, "environment"> & {
    environment?: string;
};
declare const $modelRelationships: unique symbol;
/**
 * Root object used for interacting with the "ecomrag" API. `Client` has `query` and `mutation` functions for executing raw GraphQL queries and mutations, as well as `ModelManager` objects for manipulating models with a JavaScript API. Client also wraps a `connection`, which implements the transport layer if you need access to that.
 * */
export declare class Client implements AnyClient {
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
    apiRoots: Record<string, string>;
    /** @deprecated */
    developmentApiRoot: string;
    /** @deprecated */
    productionApiRoot: string;
    applicationId: string;
    [$modelRelationships]: {
        chatLog: {
            recommendedProducts: {
                type: string;
                model: string;
            };
        };
        session: {
            shop: {
                type: string;
                model: string;
            };
        };
        shopifyGdprRequest: {
            shop: {
                type: string;
                model: string;
            };
        };
        shopifyProduct: {
            images: {
                type: string;
                model: string;
            };
            shop: {
                type: string;
                model: string;
            };
            chatRecommendations: {
                type: string;
                model: string;
            };
        };
        shopifyProductImage: {
            product: {
                type: string;
                model: string;
            };
            shop: {
                type: string;
                model: string;
            };
        };
        shopifyShop: {
            gdprRequests: {
                type: string;
                model: string;
            };
            syncs: {
                type: string;
                model: string;
            };
            products: {
                type: string;
                model: string;
            };
            productImages: {
                type: string;
                model: string;
            };
        };
        shopifySync: {
            shop: {
                type: string;
                model: string;
            };
        };
        recommendedProduct: {
            chatLog: {
                type: string;
                model: string;
            };
            product: {
                type: string;
                model: string;
            };
        };
    };
    environment: string;
    constructor(options?: ClientOptions);
    /** Run an arbitrary GraphQL query. */
    query(graphQL: string | DocumentNode, variables?: Record<string, any>, options?: Partial<OperationContext>): Promise<any>;
    /** Run an arbitrary GraphQL mutation. */
    mutate(graphQL: string | DocumentNode, variables?: Record<string, any>, options?: Partial<OperationContext>): Promise<any>;
    /** Start a transaction against the Gadget backend which will atomically commit (or rollback). */
    transaction: <T>(callback: (transaction: GadgetTransaction) => Promise<T>) => Promise<T>;
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
    fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
    /**
    * Get a new direct upload token for file uploads to directly to cloud storage.
    * See https://docs.gadget.dev/guides/storing-files#direct-uploads-using-tokens for more information
    * @return { url: string, token: string } A `url` to upload one file to, and a token for that file to pass back to Gadget as an action input.
    */
    getDirectUploadToken: () => Promise<{
        url: string;
        token: string;
    }>;
    toString(): string;
    toJSON(): string;
}
export {};

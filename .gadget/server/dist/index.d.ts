/**
* This is the Gadget server side types library for:
*
*
*    ___  ___ ___  _ __ ___  _ __ __ _  __ _
*   / _ \/ __/ _ \| '_ ` _ \| '__/ _` |/ _` |
*  |  __/ (_| (_) | | | | | | | | (_| | (_| |
*   \___|\___\___/|_| |_| |_|_|  \__,_|\__, |
*                                      |___/
*
* Built for environment `Development` at version 6
* Framework version: ^0.3.1
* Edit this app here: https://ecomrag.gadget.dev/edit
*/
import type { Client } from "@gadget-client/ecomrag";
import { Logger } from "./AmbientContext";
export * from "./metadataFileTypes";
export * from "./AmbientContext";
export * from "./AppConfigs";
export * from "./AppConfiguration";
export * from "./AppConnections";
export * from "./auth";
export * from "./effects";
export * as DefaultEmailTemplates from "./email-templates";
export * from "./emails";
export { InvalidStateTransitionError } from "./errors";
export * from "./global-actions";
export * from "./routes";
export * from "./state-chart";
export * from "./types";
export * from "./ActionOptions";
export * from "./models/ChatLog";
export * from "./models/Session";
export * from "./models/ShopifyGdprRequest";
export * from "./models/ShopifyProduct";
export * from "./models/ShopifyProductImage";
export * from "./models/ShopifyShop";
export * from "./models/ShopifySync";
export * from "./models/RecommendedProduct";
/**
 * An instance of the Gadget logger
 */
declare let logger: Logger;
/**
 * An instance of the Gadget API client that has admin permissions
 */
declare let api: Client;
export { api, logger };

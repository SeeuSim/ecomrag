// All the generated types for the "shopifyShop" model preconditions, actions, params, etc
import { AmbientContext } from "../AmbientContext";
import { ActionExecutionScope, NotYetTyped, ValidationErrors, ActionTrigger } from "../types";
import { GadgetRecord, ShopifyShop } from "@gadget-client/ecomrag";
import { Select } from "@gadgetinc/api-client-core";
export type DefaultShopifyShopServerSelection = {
  readonly __typename: true;
      readonly id: true;
      readonly createdAt: true;
      readonly updatedAt: true;
      readonly state: true;
      readonly gdprRequests: false;
      readonly syncs: false;
      readonly customerAccountsV2: true;
      readonly accessToken: true;
      readonly address1: true;
      readonly address2: true;
      readonly checkoutApiSupported: true;
      readonly city: true;
      readonly cookieConsentLevel: true;
      readonly country: true;
      readonly countryCode: true;
      readonly countryName: true;
      readonly countyTaxes: true;
      readonly shopifyCreatedAt: true;
      readonly currency: true;
      readonly customerEmail: true;
      readonly disabledWebhooks: true;
      readonly domain: true;
      readonly eligibleForCardReaderGiveaway: true;
      readonly eligibleForPayments: true;
      readonly email: true;
      readonly enabledPresentmentCurrencies: true;
      readonly finances: true;
      readonly forceSsl: true;
      readonly googleAppsDomain: true;
      readonly googleAppsLoginEnabled: true;
      readonly products: false;
      readonly grantedScopes: true;
      readonly hasDiscounts: true;
      readonly hasGiftCards: true;
      readonly hasStorefront: true;
      readonly ianaTimezone: true;
      readonly installedViaApiKey: true;
      readonly latitude: true;
      readonly longitude: true;
      readonly productImages: false;
      readonly marketingSmsContentEnabledAtCheckout: true;
      readonly moneyFormat: true;
      readonly moneyInEmailsFormat: true;
      readonly moneyWithCurrencyFormat: true;
      readonly moneyWithCurrencyInEmailsFormat: true;
      readonly multiLocationEnabled: true;
      readonly myshopifyDomain: true;
      readonly name: true;
      readonly passwordEnabled: true;
      readonly phone: true;
      readonly planDisplayName: true;
      readonly planName: true;
      readonly preLaunchEnabled: true;
      readonly primaryLocale: true;
      readonly province: true;
      readonly provinceCode: true;
      readonly registeredWebhooks: true;
      readonly requiresExtraPaymentsAgreement: true;
      readonly setupRequired: true;
      readonly shopOwner: true;
      readonly source: true;
      readonly taxShipping: true;
      readonly taxesIncluded: true;
      readonly timezone: true;
      readonly transactionalSmsDisabled: true;
      readonly shopifyUpdatedAt: true;
      readonly weightUnit: true;
      readonly zipCode: true;
      readonly ChatbotSettings: false;
      readonly confirmationUrl: true;
      readonly subscriptionId: true;
      readonly plan: false;
      readonly orders: false;
      readonly orderLineItems: false;
  };

  
/** Context of the `update` action on the `shopifyShop` model. */
export interface UpdateShopifyShopActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `shopifyShop` record this action is operating on.
  */
  record: GadgetRecord<Select<ShopifyShop, DefaultShopifyShopServerSelection>>;
  /**
  * @deprecated Use 'return' instead.
  */
  scope: ActionExecutionScope;
  /**
  * An object specifying the trigger to this action (e.g. API call, webhook events etc.).
  */
  trigger: ActionTrigger;
  /**
  * An object containing the incoming data(this models fields) passed by triggers or user inputs.
  */
  params: {

};
  /**
  * @private The context of this action.
  */
  context: UpdateShopifyShopActionContext;
};


    
/** Context of the `createAppCharge` action on the `shopifyShop` model. */
export interface CreateAppChargeShopifyShopActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `shopifyShop` record this action is operating on.
  */
  record: GadgetRecord<Select<ShopifyShop, DefaultShopifyShopServerSelection>>;
  /**
  * @deprecated Use 'return' instead.
  */
  scope: ActionExecutionScope;
  /**
  * An object specifying the trigger to this action (e.g. API call, webhook events etc.).
  */
  trigger: ActionTrigger;
  /**
  * An object containing the incoming data(this models fields) passed by triggers or user inputs.
  */
  params: {
plan?: string;
};
  /**
  * @private The context of this action.
  */
  context: CreateAppChargeShopifyShopActionContext;
};


    
/** Context of the `install` action on the `shopifyShop` model. */
export interface InstallShopifyShopActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `shopifyShop` record this action is operating on.
  */
  record: GadgetRecord<Select<ShopifyShop, DefaultShopifyShopServerSelection>>;
  /**
  * @deprecated Use 'return' instead.
  */
  scope: ActionExecutionScope;
  /**
  * An object specifying the trigger to this action (e.g. API call, webhook events etc.).
  */
  trigger: ActionTrigger;
  /**
  * An object containing the incoming data(this models fields) passed by triggers or user inputs.
  */
  params: {

};
  /**
  * @private The context of this action.
  */
  context: InstallShopifyShopActionContext;
};


    
/** Context of the `reinstall` action on the `shopifyShop` model. */
export interface ReinstallShopifyShopActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `shopifyShop` record this action is operating on.
  */
  record: GadgetRecord<Select<ShopifyShop, DefaultShopifyShopServerSelection>>;
  /**
  * @deprecated Use 'return' instead.
  */
  scope: ActionExecutionScope;
  /**
  * An object specifying the trigger to this action (e.g. API call, webhook events etc.).
  */
  trigger: ActionTrigger;
  /**
  * An object containing the incoming data(this models fields) passed by triggers or user inputs.
  */
  params: {

};
  /**
  * @private The context of this action.
  */
  context: ReinstallShopifyShopActionContext;
};


    
/** Context of the `subscribe` action on the `shopifyShop` model. */
export interface SubscribeShopifyShopActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `shopifyShop` record this action is operating on.
  */
  record: GadgetRecord<Select<ShopifyShop, DefaultShopifyShopServerSelection>>;
  /**
  * @deprecated Use 'return' instead.
  */
  scope: ActionExecutionScope;
  /**
  * An object specifying the trigger to this action (e.g. API call, webhook events etc.).
  */
  trigger: ActionTrigger;
  /**
  * An object containing the incoming data(this models fields) passed by triggers or user inputs.
  */
  params: {
plan?: string;
};
  /**
  * @private The context of this action.
  */
  context: SubscribeShopifyShopActionContext;
};


    
/** Context of the `uninstall` action on the `shopifyShop` model. */
export interface UninstallShopifyShopActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `shopifyShop` record this action is operating on.
  */
  record: GadgetRecord<Select<ShopifyShop, DefaultShopifyShopServerSelection>>;
  /**
  * @deprecated Use 'return' instead.
  */
  scope: ActionExecutionScope;
  /**
  * An object specifying the trigger to this action (e.g. API call, webhook events etc.).
  */
  trigger: ActionTrigger;
  /**
  * An object containing the incoming data(this models fields) passed by triggers or user inputs.
  */
  params: {

};
  /**
  * @private The context of this action.
  */
  context: UninstallShopifyShopActionContext;
};


  
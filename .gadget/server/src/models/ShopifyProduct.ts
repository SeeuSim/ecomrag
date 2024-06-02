// All the generated types for the "shopifyProduct" model preconditions, actions, params, etc
import { AmbientContext } from "../AmbientContext";
import { ActionExecutionScope, NotYetTyped, ValidationErrors, ActionTrigger } from "../types";
import { GadgetRecord, ShopifyProduct } from "@gadget-client/ecomrag";
import { Select } from "@gadgetinc/api-client-core";
export type DefaultShopifyProductServerSelection = {
  readonly __typename: true;
      readonly id: true;
      readonly createdAt: true;
      readonly updatedAt: true;
      readonly descriptionEmbedding: true;
      readonly compareAtPriceRange: true;
      readonly productCategory: true;
      readonly body: true;
      readonly shopifyCreatedAt: true;
      readonly handle: true;
      readonly images: false;
      readonly productType: true;
      readonly publishedAt: true;
      readonly publishedScope: true;
      readonly status: true;
      readonly tags: true;
      readonly templateSuffix: true;
      readonly title: true;
      readonly shopifyUpdatedAt: true;
      readonly vendor: true;
      readonly shopId: true;
    readonly shop: false;
      readonly chatRecommendations: false;
      readonly imageCount: true;
      readonly orderLineItems: false;
      readonly price: true;
      readonly analyticsEntry: false;
  };

  
/** Context of the `create` action on the `shopifyProduct` model. */
export interface CreateShopifyProductActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `shopifyProduct` record this action is operating on.
  */
  record: GadgetRecord<Select<ShopifyProduct, DefaultShopifyProductServerSelection>>;
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
  context: CreateShopifyProductActionContext;
};


    
/** Context of the `update` action on the `shopifyProduct` model. */
export interface UpdateShopifyProductActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `shopifyProduct` record this action is operating on.
  */
  record: GadgetRecord<Select<ShopifyProduct, DefaultShopifyProductServerSelection>>;
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
  context: UpdateShopifyProductActionContext;
};


    
/** Context of the `delete` action on the `shopifyProduct` model. */
export interface DeleteShopifyProductActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `shopifyProduct` record this action is operating on.
  */
  record: GadgetRecord<Select<ShopifyProduct, DefaultShopifyProductServerSelection>>;
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
  context: DeleteShopifyProductActionContext;
};


  
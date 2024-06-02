// All the generated types for the "shopifyProductImage" model preconditions, actions, params, etc
import { AmbientContext } from "../AmbientContext";
import { ActionExecutionScope, NotYetTyped, ValidationErrors, ActionTrigger } from "../types";
import { GadgetRecord, ShopifyProductImage } from "@gadget-client/ecomrag";
import { Select } from "@gadgetinc/api-client-core";
export type DefaultShopifyProductImageServerSelection = {
  readonly __typename: true;
      readonly id: true;
      readonly createdAt: true;
      readonly updatedAt: true;
      readonly alt: true;
      readonly shopifyCreatedAt: true;
      readonly height: true;
      readonly position: true;
      readonly source: true;
      readonly shopifyUpdatedAt: true;
      readonly width: true;
      readonly productId: true;
    readonly product: false;
      readonly shopId: true;
    readonly shop: false;
      readonly imageDescriptionEmbedding: true;
      readonly imageDescription: true;
  };

  
/** Context of the `create` action on the `shopifyProductImage` model. */
export interface CreateShopifyProductImageActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `shopifyProductImage` record this action is operating on.
  */
  record: GadgetRecord<Select<ShopifyProductImage, DefaultShopifyProductImageServerSelection>>;
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
  context: CreateShopifyProductImageActionContext;
};


    
/** Context of the `update` action on the `shopifyProductImage` model. */
export interface UpdateShopifyProductImageActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `shopifyProductImage` record this action is operating on.
  */
  record: GadgetRecord<Select<ShopifyProductImage, DefaultShopifyProductImageServerSelection>>;
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
  context: UpdateShopifyProductImageActionContext;
};


    
/** Context of the `delete` action on the `shopifyProductImage` model. */
export interface DeleteShopifyProductImageActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `shopifyProductImage` record this action is operating on.
  */
  record: GadgetRecord<Select<ShopifyProductImage, DefaultShopifyProductImageServerSelection>>;
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
  context: DeleteShopifyProductImageActionContext;
};


  
// All the generated types for the "recommendedProduct" model preconditions, actions, params, etc
import { AmbientContext } from "../AmbientContext";
import { ActionExecutionScope, NotYetTyped, ValidationErrors, ActionTrigger } from "../types";
import { GadgetRecord, RecommendedProduct } from "@gadget-client/ecomrag";
import { Select } from "@gadgetinc/api-client-core";
export type DefaultRecommendedProductServerSelection = {
  readonly __typename: true;
      readonly id: true;
      readonly createdAt: true;
      readonly updatedAt: true;
      readonly productId: true;
    readonly product: false;
      readonly chatLogId: true;
    readonly chatLog: false;
      readonly recommendationSource: true;
  };

  
/** Context of the `create` action on the `recommendedProduct` model. */
export interface CreateRecommendedProductActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `recommendedProduct` record this action is operating on.
  */
  record: GadgetRecord<Select<RecommendedProduct, DefaultRecommendedProductServerSelection>>;
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
  context: CreateRecommendedProductActionContext;
};


    
/** Context of the `update` action on the `recommendedProduct` model. */
export interface UpdateRecommendedProductActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `recommendedProduct` record this action is operating on.
  */
  record: GadgetRecord<Select<RecommendedProduct, DefaultRecommendedProductServerSelection>>;
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
  context: UpdateRecommendedProductActionContext;
};


    
/** Context of the `delete` action on the `recommendedProduct` model. */
export interface DeleteRecommendedProductActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `recommendedProduct` record this action is operating on.
  */
  record: GadgetRecord<Select<RecommendedProduct, DefaultRecommendedProductServerSelection>>;
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
  context: DeleteRecommendedProductActionContext;
};


  
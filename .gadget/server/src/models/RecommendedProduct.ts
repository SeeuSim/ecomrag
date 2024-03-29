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
      readonly chatLogId: true;
    readonly chatLog: false;
      readonly productId: true;
    readonly product: false;
  };

  
/** All the data passed to an effect or precondition within the `create` action on the `recommendedProduct` model. */
export interface CreateRecommendedProductActionContext extends AmbientContext {
  /**
  * The model of the record this action is operating on
  */
  model: NotYetTyped;
  /**
  * The `recommendedProduct` record this action is operating on.
  */
  record: GadgetRecord<Select<RecommendedProduct, DefaultRecommendedProductServerSelection>>;
  /**
  * An object passed between all preconditions and effects of an action execution at the `scope` property.
  * Useful for transferring data between effects.
  */
  scope: ActionExecutionScope;
  /**
  * An object describing what started this action execution.
  */
  trigger: ActionTrigger;
  /**
  * An object containing all the incoming params that have been defined for this action. Includes params added by any triggers, as well as custom params defined in the action.
  */
  params: {

};
  /**
  * The context of this action. This context does not have a defined inner context.
  */
  context: CreateRecommendedProductActionContext;
};


    
/** All the data passed to an effect or precondition within the `update` action on the `recommendedProduct` model. */
export interface UpdateRecommendedProductActionContext extends AmbientContext {
  /**
  * The model of the record this action is operating on
  */
  model: NotYetTyped;
  /**
  * The `recommendedProduct` record this action is operating on.
  */
  record: GadgetRecord<Select<RecommendedProduct, DefaultRecommendedProductServerSelection>>;
  /**
  * An object passed between all preconditions and effects of an action execution at the `scope` property.
  * Useful for transferring data between effects.
  */
  scope: ActionExecutionScope;
  /**
  * An object describing what started this action execution.
  */
  trigger: ActionTrigger;
  /**
  * An object containing all the incoming params that have been defined for this action. Includes params added by any triggers, as well as custom params defined in the action.
  */
  params: {

};
  /**
  * The context of this action. This context does not have a defined inner context.
  */
  context: UpdateRecommendedProductActionContext;
};


    
/** All the data passed to an effect or precondition within the `delete` action on the `recommendedProduct` model. */
export interface DeleteRecommendedProductActionContext extends AmbientContext {
  /**
  * The model of the record this action is operating on
  */
  model: NotYetTyped;
  /**
  * The `recommendedProduct` record this action is operating on.
  */
  record: GadgetRecord<Select<RecommendedProduct, DefaultRecommendedProductServerSelection>>;
  /**
  * An object passed between all preconditions and effects of an action execution at the `scope` property.
  * Useful for transferring data between effects.
  */
  scope: ActionExecutionScope;
  /**
  * An object describing what started this action execution.
  */
  trigger: ActionTrigger;
  /**
  * An object containing all the incoming params that have been defined for this action. Includes params added by any triggers, as well as custom params defined in the action.
  */
  params: {

};
  /**
  * The context of this action. This context does not have a defined inner context.
  */
  context: DeleteRecommendedProductActionContext;
};


  
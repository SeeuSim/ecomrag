// All the generated types for the "chatLog" model preconditions, actions, params, etc
import { AmbientContext } from "../AmbientContext";
import { ActionExecutionScope, NotYetTyped, ValidationErrors, ActionTrigger } from "../types";
import { GadgetRecord, ChatLog } from "@gadget-client/ecomrag";
import { Select } from "@gadgetinc/api-client-core";
export type DefaultChatLogServerSelection = {
  readonly __typename: true;
      readonly id: true;
      readonly createdAt: true;
      readonly updatedAt: true;
      readonly response: true;
      readonly recommendedProducts: false;
  };

  
/** Context of the `create` action on the `chatLog` model. */
export interface CreateChatLogActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `chatLog` record this action is operating on.
  */
  record: GadgetRecord<Select<ChatLog, DefaultChatLogServerSelection>>;
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
  context: CreateChatLogActionContext;
};


    
/** Context of the `update` action on the `chatLog` model. */
export interface UpdateChatLogActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `chatLog` record this action is operating on.
  */
  record: GadgetRecord<Select<ChatLog, DefaultChatLogServerSelection>>;
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
  context: UpdateChatLogActionContext;
};


    
/** Context of the `delete` action on the `chatLog` model. */
export interface DeleteChatLogActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `chatLog` record this action is operating on.
  */
  record: GadgetRecord<Select<ChatLog, DefaultChatLogServerSelection>>;
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
  context: DeleteChatLogActionContext;
};


  
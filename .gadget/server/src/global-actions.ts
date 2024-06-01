import type { AmbientContext } from "./AmbientContext";
import type { ActionTrigger, ActionExecutionScope } from "./types";

/** Context of the `validatePlan` action. */
export interface ValidatePlanGlobalActionContext extends AmbientContext {
  /**
  * @deprecated Use 'returnType' instead.
  * Useful for returning data from this action by setting `scope.result`.
  */
  scope: ActionExecutionScope;
  /**
  * An object specifying the trigger to this action (e.g. API call, custom params).
  */
  params: {
newPlanName?: string;    
shopId?: string;
};
  /**
  * An object specifying the trigger to this action (e.g. api call, scheduler etc.)
  */
  trigger: ActionTrigger;
  /**
  * @private The context of this action.
  */
  context: ValidatePlanGlobalActionContext;
};



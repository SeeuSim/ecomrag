import type { AnyClient, InternalModelManager, RecordData } from "@gadgetinc/api-client-core";
import { ChangeTracking, GadgetRecord } from "@gadgetinc/api-client-core";
import {
  InternalError,
  InvalidActionInputError,
  InvalidStateTransitionError,
  MisconfiguredActionError,
  NoSessionForAuthenticationError,
  PermissionDeniedError,
  UserNotSetOnSessionError,
} from "./errors";
import { Globals, actionContextLocalStorage } from "./globals";
import { frameworkVersion, modelListIndex, modelsMap } from "./metadata";
import { AppTenancyKey } from "./tenancy";
import type { AnyParams, FieldMetadata, ModelDescriptor, ModelMetadata, NotYetTyped } from "./types";
import { assert } from "./utils";

function getBelongsToRelationParams(model: ModelMetadata, params: Record<string, any>) {
  const belongsToParams: any = {};

  for (const field of Object.values(model.fields) as any[]) {
    if (field.fieldType != "BelongsTo") continue;
    const modelParams = typeof params[model.apiIdentifier] === "object" ? params[model.apiIdentifier] : undefined;
    const belongsToParam =
      modelParams && typeof modelParams[field.apiIdentifier] === "object" ? modelParams[field.apiIdentifier] : undefined;
    const belongsToId = belongsToParam?.[LINK_PARAM] !== undefined ? belongsToParam[LINK_PARAM] : belongsToParam?.id;
    if (belongsToId !== undefined) {
      belongsToParams[`${field.apiIdentifier}Id`] = belongsToId;
    }
  }

  return belongsToParams;
}

export function createGadgetRecord<Shape>(apiIdentifier: string, data: Shape): GadgetRecord<Shape & { __typename: string }> {
  const model = getModelByApiIdentifier(apiIdentifier);
  return new GadgetRecord({
    ...data,
    __typename: model.graphqlTypeName,
  });
}

/**
 * Applies incoming API params (your model’s fields) to a record
 *
 * @param params - data passed from API calls, webhook events, or direct user inputs.
 * @param record - object used to pass params to
 */
export function applyParams(params: AnyParams, record: GadgetRecord<any>) {
  const model = getModelByTypename(record.__typename);
  Object.assign(record, params[model.apiIdentifier], getBelongsToRelationParams(model, params));
}

/**
 * Get the internal model manager for the model from its maybe-namespaced spot
 */
const internalModelManagerForModel = (api: AnyClient, apiIdentifier: string, namespace: string[]) => {
  const modelPath = [...namespace, apiIdentifier];
  const manager: InternalModelManager | undefined = Globals.platformModules.lodash().get(api, ["internal", ...modelPath]);
  if (!manager) {
    throw new InternalError(
      `Gadget needs but can't find an internal model manager for ${modelPath.join(
        "."
      )} on the API client -- has it finished regenerating or was it recently removed?`
    );
  }

  return manager;
};

/**
 * Get the internal model manager for the model from its maybe-namespaced spot
 */
const internalModelManagerForTypename = (api: AnyClient, typename: string) => {
  const model = getModelByTypename(typename);

  return internalModelManagerForModel(api, model.apiIdentifier, model.namespace);
};

/**
 * Saves record to the database:
 * 1. Checks field validations of a given record, then saves the record to the database.
 * 2. Uses your apps Internal API to persist data. This API quickly interacts with data without running any business logic.
 *
 * @param record - object saved to the database
 */
export async function save(record: GadgetRecord<any>) {
  const context = maybeGetActionContextFromLocalStorage();
  const api = assert(context ? context.api : getCurrentContext().api, "api client is missing from the current context");
  const model = getModelByTypename(record.__typename);

  await (await Globals.modelValidator(model.key)).validate({ api, logger: Globals.logger }, record);

  const internalModelManager = internalModelManagerForTypename(api, record.__typename);

  let result: GadgetRecord<any>;

  if ("createdAt" in record && record.createdAt) {
    result = await internalModelManager.update(record.id, {
      [model.apiIdentifier]: changedAttributes(model, record),
    });
  } else {
    result = await internalModelManager.create({
      [model.apiIdentifier]: writableAttributes(model, record),
    });
  }

  Object.assign(record, { ...result });
  record.flushChanges(ChangeTracking.SinceLastPersisted);
}

/**
 * Deletes record from the database.
 *
 * @param record - object deleted from the database
 */
export async function deleteRecord(record: GadgetRecord<any>) {
  const context = maybeGetActionContextFromLocalStorage();

  const api = assert(context ? context.api : getCurrentContext().api, "api client is missing from the current context");
  const scope = context ? context.scope : {};

  const id = assert(record.id, `record.id not set on record in scope, has the record been persisted?`);

  const internalModelManager = internalModelManagerForTypename(api, record.__typename);
  await internalModelManager.delete(id);

  scope.recordDeleted = true;
}

export const ShopifyShopState = {
  Installed: { created: "installed" },
  Uninstalled: { created: "uninstalled" },
};

export const ShopifySyncState = {
  Created: "created",
  Running: "running",
  Completed: "completed",
  Errored: "errored",
};

export const ShopifyBulkOperationState = {
  Created: "created",
  Completed: "completed",
  Canceled: "canceled",
  Failed: "failed",
  Expired: "expired",
};

export const ShopifySellingPlanGroupProductVariantState = {
  Started: "started",
  Created: "created",
  Deleted: "deleted",
};

export const ShopifySellingPlanGroupProductState = {
  Started: "started",
  Created: "created",
  Deleted: "deleted",
};

export function transitionState(
  record: GadgetRecord<any>,
  transition: {
    from?: string | Record<string, string>;
    to: string | Record<string, string>;
  }
) {
  const model = getModelByTypename(record.__typename);
  const isShopifyModel =
    model.apiIdentifier === "shopifyShop" || model.apiIdentifier === "shopifySync" || model.apiIdentifier === "shopifyBulkOperation";

  if (isShopifyModel && doesVersionSupportSourceControl()) {
    // In apps framework version 1.0.0+, we handle the state transition internally to Shopify models based on the above API identifiers.
    // This function becomes a no-op for those models.
    return;
  }

  const stringRecordState = typeof record.state === "string" ? record.state : JSON.stringify(record.state);
  const stringTransitionFrom = typeof transition.from === "string" ? transition.from : JSON.stringify(transition.from);

  if (transition.from && stringRecordState !== stringTransitionFrom) {
    throw new InvalidStateTransitionError(undefined, {
      state: record.state,
      expectedFrom: transition.from,
    });
  }

  record.state = transition.to;
}

/**
 * The following is used to power shopifySync model.
 * Learn more about syncing visit our docs: https://docs.gadget.dev/guides/plugins/shopify/syncing-shopify-data#syncing
 */

export async function shopifySync(params: AnyParams, record: GadgetRecord<any>) {
  const context = getActionContextFromLocalStorage();
  const effectAPIs = context.effectAPIs;

  const syncRecord: { syncSince?: Date; id: bigint; shopId: string; models: any; force: boolean } = assert(
    record,
    "cannot start a shop sync from this action"
  );

  const shopId = assert(syncRecord.shopId, "a shop is required to start a sync");

  if (!syncRecord.models || (Array.isArray(syncRecord.models) && syncRecord.models.every((m) => typeof m == "string"))) {
    try {
      await effectAPIs.sync(
        syncRecord.id.toString(),
        shopId,
        syncRecord.syncSince,
        syncRecord.models,
        syncRecord.force,
        params.startReason
      );
    } catch (error) {
      Globals.logger.error({ error, connectionSyncId: syncRecord.id }, "an error occurred starting shop sync");
      throw error;
    }
  } else {
    throw new InvalidActionInputError("Models must be an array of api identifiers");
  }
}

export async function abortSync(params: AnyParams, record: GadgetRecord<any>) {
  const context = getActionContextFromLocalStorage();
  const effectAPIs = context.effectAPIs;

  const syncRecord: { id: bigint } = assert(record, "a record is required to abort a shop sync");

  const syncId = assert(syncRecord.id, "a sync id is required to start a sync");

  if (!params.errorMessage) {
    record.errorMessage = "Sync aborted";
  }

  Globals.logger.info({ userVisible: true, connectionSyncId: syncId }, "aborting sync");

  try {
    await effectAPIs.abortSync(syncId.toString());
  } catch (error) {
    Globals.logger.error({ error, connectionSyncId: syncId }, "an error occurred aborting sync");
    throw error;
  }
}

/**
 * Applicable for multi-tenant Shopify apps(public apps), or Shopify Customer Extension apps
 * Enforces that the given record is only accessible by the current shop or customer
 *
 * For new records: sets the the current session's `shopId` to the record. If the tenant is a customer then will set the current sessions' customerId to the record.
 * For existing records: Verifies the record objects `shopId` and/or `customerId` matches the one from the current session.
 *
 * *
 * @param params - incoming data validated against the current `shopId`
 * @param record - record used to validate or set the `shopId` on
 * @param {Object} options - Additional options for cross-shop or cross-customer validation
 * @param {string} options.shopBelongsToField - Specifies which related model is used for cross-shop validation.
 * @param {string} options.customerBelongsToField - Specifies which related model is used for cross-customer validation.
 * @param {boolean} options.enforceCustomerTenancy - Whether or not to enforce customer tenacy. Defaults to true.
 */
export async function preventCrossShopDataAccess(
  params: AnyParams,
  record: GadgetRecord<any>,
  options?: { shopBelongsToField?: string; customerBelongsToField?: string; enforceCustomerTenancy?: boolean }
) {
  const enforceCustomerTenancy = options?.enforceCustomerTenancy ?? true;
  const context = getActionContextFromLocalStorage();

  if (context.type != "effect") {
    throw new Error("Can't prevent cross shop data access outside of an action effect");
  }
  if (!params) {
    throw new Error(
      "The `params` parameter is required in preventCrossShopDataAccess(params, record, options?: { shopBelongsToField: string })"
    );
  }
  if (!record) {
    throw new Error(
      "The `record` parameter is required in preventCrossShopDataAccess(params, record, options?: { shopBelongsToField: string })"
    );
  }
  const model = context.model;
  const appTenancy = context[AppTenancyKey];
  const shopBelongsToField = options?.shopBelongsToField;
  const customerBelongsToField = options?.customerBelongsToField;

  // if there's no tenancy let's continue
  if (appTenancy?.shopify?.shopId === undefined) {
    return;
  }
  // if this effect is not run in the context of a model then it does not apply
  if (!model) {
    return;
  }

  const shopId = String(appTenancy.shopify.shopId);
  const customerId = appTenancy.shopify.customerId ? String(appTenancy.shopify.customerId) : undefined;

  const input = params[model.apiIdentifier];
  validateBelongsToLink(input, record, params, shopId, model, ShopifyShopKey, shopBelongsToField, TenantType.Shop);

  if (customerId && enforceCustomerTenancy) {
    validateBelongsToLink(input, record, params, customerId, model, ShopifyCustomerKey, customerBelongsToField, TenantType.Customer);
  }
}

const validateBelongsToLink = (
  input: any,
  record: any,
  params: AnyParams,
  tenantId: string,
  model: ModelDescriptor,
  relatedModelKey: string,
  tenantBelongsToField: string | undefined,
  tenantType: TenantType
) => {
  if (relatedModelKey != ShopifyShopKey && relatedModelKey != ShopifyCustomerKey) {
    throw new Error("Validation for tenancy can only be for Shopify Shop or Shopify Customer models");
  }
  // If this effect is being added to the related tenant model (Shopify Shop or Shopify Customer), simply compare the record's ID
  if (model.key == relatedModelKey) {
    if (record && String(record.id) !== tenantId) {
      throw new PermissionDeniedError();
    }
    return;
  }

  const fieldsIsBelongsToRelatedModel = Object.values(model.fields).filter(
    (f) => f.fieldType === (FieldType.BelongsTo as string) && f.configuration.relatedModelKey === relatedModelKey
  );

  if (fieldsIsBelongsToRelatedModel.length === 0) {
    throw new MisconfiguredActionError(`This model is missing a related ${tenantType} field.`);
  }

  if (fieldsIsBelongsToRelatedModel.length > 1 && !tenantBelongsToField) {
    throw new MisconfiguredActionError(
      `This function is missing a related ${tenantType} field option. \`${tenantType}BelongsToField\` is a required option parameter if the model has more than one related ${tenantType} field.`
    );
  }
  let relatedTenantField = fieldsIsBelongsToRelatedModel[0];

  if (tenantBelongsToField) {
    const selectedField = Object.values(model.fields).find((f) => f.apiIdentifier === tenantBelongsToField);
    if (!selectedField) {
      throw new MisconfiguredActionError(`The selected ${tenantType} relation field does not exist.`);
    }

    if (selectedField.fieldType !== (FieldType.BelongsTo as string) || selectedField.configuration.relatedModelKey !== relatedModelKey) {
      throw new MisconfiguredActionError(
        `The selected ${tenantType} relation field should be a \`Belongs To\` relationship to the \`Shopify ${Globals.platformModules
          .lodash()
          .capitalize(tenantType)}\` model.`
      );
    } else {
      relatedTenantField = selectedField;
    }
  }

  setBelongsToLink(input, record, params, model, relatedTenantField, tenantId);
};

const setBelongsToLink = (
  input: any,
  record: any,
  params: AnyParams,
  model: ModelDescriptor,
  relatedField: FieldMetadata,
  tenantId: string
) => {
  // if we're trying to set the params to a shop other than the tenant we should reject
  if (Globals.platformModules.lodash().isObjectLike(input)) {
    const objectInput = input as Record<string, any>;
    if (objectInput[relatedField.apiIdentifier]) {
      if (String(objectInput[relatedField.apiIdentifier][LINK_PARAM]) !== tenantId) {
        throw new PermissionDeniedError();
      }
    } else {
      objectInput[relatedField.apiIdentifier] = {
        [LINK_PARAM]: tenantId,
      };
    }
  } else {
    params[model.apiIdentifier] = {
      [relatedField.apiIdentifier]: {
        [LINK_PARAM]: tenantId,
      },
    };
  }

  if (record) {
    const value = record.getField(relatedField.apiIdentifier);
    // if the record doesn't have a shop set then anyone can update it
    if (value) {
      const recordShopId = typeof value === "object" ? value[LINK_PARAM] : value;
      if (String(recordShopId) !== tenantId) {
        throw new PermissionDeniedError();
      }
    } else {
      // we have to re-apply the params to the record to ensure that this still works correctly if it occurs after "applyParams"
      record.setField(relatedField.apiIdentifier, {
        [LINK_PARAM]: tenantId,
      });
    }
  }
};

/**
 * Updates the state of a `bulkOperation` record from Shopify when the operation completes.
 *
 * @param record - the `bulkOperation` record updated
 */
export async function finishBulkOperation(record: GadgetRecord<any>) {
  if (!record?.id) {
    Globals.logger.warn(`Expected bulk operation record to be present for action`);
    return;
  }

  const context = getActionContextFromLocalStorage();
  const shopifyAPI = await (context.connections as Record<string, any>).shopify.forShopId(record.shopId);
  if (!shopifyAPI) {
    Globals.logger.error(`Could not instantiate Shopify client for shop ID ${record.shopId}`);
    return;
  }
  const bulkOperation = (
    await shopifyAPI.graphql(`query {
        node(id: "${ShopifyBulkOperationGIDForId(record.id)}") {
          ... on BulkOperation {
            id
            status
            errorCode
            createdAt
            completedAt
            objectCount
            fileSize
            url
            type
            partialDataUrl
            rootObjectCount
          }
        }
      }`)
  ).node;
  // normalize the mixed upper/lowercase (GraphQL/REST) to lowercase
  const { status, errorCode, type } = bulkOperation;
  Object.assign(record, {
    ...bulkOperation,
    status: status?.toLowerCase(),
    errorCode: errorCode?.toLowerCase(),
    type: type?.toLowerCase(),
    id: record.id,
  });
}

/**
 * Syncs Shopify models across all models
 *
 * @param params - list of Shopify app credentials to sync data from
 * @param syncSince - starting point for data sync (default: all time)
 * @param models - list of model names to sync data from
 * @param force - enforces syncswithout checking if they're up to date
 * @param startReason - a string reason stored on the created 'shopifySync' records
 */
export async function globalShopifySync(params: {
  apiKeys: string[];
  syncSince: string;
  models: string[];
  force: boolean;
  startReason: string;
}) {
  const context = maybeGetActionContextFromLocalStorage();
  const effectAPIs = assert(
    context ? context.effectAPIs : getCurrentContext().effectAPIs,
    "effect apis is missing from the current context"
  );
  const api = assert(context ? context.api : getCurrentContext().api, "api client is missing from the current context");

  const { apiKeys, syncSince, models, force, startReason } = params;

  const {
    shopModelIdentifier,
    installedViaKeyFieldIdentifier,
    shopifySyncModelApiIdentifier,
    runShopifySyncAction,
    accessTokenIdentifier,
    forceFieldIdentifier,
  } = await effectAPIs.getSyncIdentifiers();
  const manager = internalModelManagerForModel(api, shopModelIdentifier, []);

  const pageSize = 250;
  let pageInfo: { first?: number; endCursor?: string; hasNextPage: boolean } = { first: pageSize, hasNextPage: true };
  const results: { id: string; domain: string; state: Record<string, any>; [key: string]: any }[] = [];

  if (apiKeys && apiKeys.length > 0) {
    try {
      while (pageInfo.hasNextPage) {
        const records = await manager.findMany({
          filter: {
            [installedViaKeyFieldIdentifier]: {
              in: apiKeys,
            },
            state: {
              inState: "created.installed",
            },
            planName: {
              notIn: ["frozen", "fraudulent", "cancelled"],
            },
          },
          first: pageInfo.first,
          after: pageInfo.endCursor,
        });
        results.push(...(records as any[]));
        pageInfo = records.pagination.pageInfo;
      }
    } catch (error) {
      Globals.logger.info({ userVisible: true, error, apiKeys }, "could not get shops for all API keys");
      throw error;
    }

    for (const result of results) {
      // skip the sync if there is no accessToken set or if the state is uninstalled
      if (Globals.platformModules.lodash().isEmpty(result[accessTokenIdentifier]) || result.state?.created == "uninstalled") {
        Globals.logger.info({ shopId: result.id }, "skipping sync for shop without access token or is uninstalled");
        continue;
      }

      try {
        const shopifySyncModelManager = Globals.platformModules.lodash().get(api, runShopifySyncAction.dotNotationPath);
        await shopifySyncModelManager[runShopifySyncAction.apiIdentifier]({
          [shopifySyncModelApiIdentifier]: {
            shop: {
              _link: result.id,
            },
            domain: result.domain,
            syncSince,
            models,
            ...(forceFieldIdentifier ? { force } : undefined),
          },
          startReason,
        });
      } catch (error) {
        // log that the sync could not be started for the shop but continue
        Globals.logger.warn({ userVisible: true, error, shop: result }, "couldn't start sync for shop");
      }
    }
  } else {
    throw new InvalidActionInputError("missing at least 1 api key");
  }
}

export function legacySetUser() {
  const context = getActionContextFromLocalStorage();

  if (!context.scope.authenticatedUser) {
    throw new UserNotSetOnSessionError(
      "The authenticated user could not be saved to the session when logging in. Make sure the user has a role assigned to them."
    );
  }
  if (!context.session) {
    throw new NoSessionForAuthenticationError(
      "Unable to authenticate because the request was made with no session in context to transition."
    );
  }
  context.session.set("user", { [LINK_PARAM]: context.scope.authenticatedUser.id });
}

export function legacyUnsetUser() {
  const context = getActionContextFromLocalStorage();

  if (!context.session) {
    throw new NoSessionForAuthenticationError("Unable to unset users on session because the request was made with no session.");
  }
  context.session.delete("user");
}

export async function legacySuccessfulAuthentication(params: AnyParams) {
  const context = getActionContextFromLocalStorage();
  const { api, scope } = context;
  const manager = api.internal.user as InternalModelManager;

  const user = (await manager.findMany({ filter: { email: { equals: params.email } } }))[0];
  let result = false;
  if (user && params.password && user.password?.hash) {
    if (await Globals.platformModules.bcrypt().compare(params.password, user.password.hash)) {
      scope.authenticatedUser = user;
      result = true;
    }
  }
  Globals.logger.info({ email: params.email, userId: user?.id, result }, "login attempt");

  if (!result) {
    throw new Error("Invalid email or password");
  }
}

/**
 * @private helper functions and variables
 */

function doesVersionSupportSourceControl(): boolean {
  return Globals.platformModules.compareVersions().satisfies(frameworkVersion, ">=1.0.0");
}

/**
 * @private Get action context without `params` and `record` from async local storage.
 */
function getActionContextFromLocalStorage() {
  return assert(actionContextLocalStorage.getStore(), "this effect function should only be called from within an action");
}

/**
 * @private Similar to `getActionContextFromLocalStorage` but returns `undefined` if there is no action context. (i.e. possibly called from a route)
 */
function maybeGetActionContextFromLocalStorage() {
  return actionContextLocalStorage.getStore();
}

function getCurrentContext() {
  return assert(Globals.requestContext.get("requestContext"), "no gadget context found on request");
}

const LINK_PARAM = "_link";

function writableAttributes(model: ModelMetadata, record: GadgetRecord<RecordData>) {
  const fieldsByApiIdentifier = Globals.platformModules.lodash().keyBy(Object.values(model.fields) as NotYetTyped[], "apiIdentifier");
  return Globals.platformModules.lodash().pickBy(record, (v: any, k: any) => fieldsByApiIdentifier[k]?.internalWritable);
}

function changedAttributes(model: ModelMetadata, record: GadgetRecord<RecordData>) {
  const changes = record.changes();
  const attributes = Object.keys(changes).reduce((attrs, key) => {
    attrs[key] = record[key];
    return attrs;
  }, {} as any);
  return writableAttributes(model, attributes);
}

const getModelByApiIdentifier = (apiIdentifier: string): ModelMetadata => {
  const typename = modelListIndex[`api:${apiIdentifier}`];
  if (!typename) {
    throw new InternalError(`Model ${apiIdentifier} not found in available model metadata`, {
      availableApiIdentifiers: Object.keys(modelListIndex),
    });
  }

  return getModelByTypename(typename);
};

const getModelByTypename = (typename: string): ModelMetadata => {
  if (!typename) {
    throw new InternalError(`No typename found on record, __typename must be set for accessing model metadata`);
  }

  const model = modelsMap[typename];
  if (!model) {
    throw new InternalError(`Model with typename ${typename} not found in available model metadata`, {
      availableTypenames: Object.keys(modelsMap),
    });
  }

  return model;
};

export enum FieldType {
  ID = "ID",
  Number = "Number",
  String = "String",
  Enum = "Enum",
  RichText = "RichText",
  DateTime = "DateTime",
  Email = "Email",
  URL = "URL",
  Money = "Money",
  File = "File",
  Color = "Color",
  Password = "Password",
  Computed = "Computed",
  HasManyThrough = "HasManyThrough",
  BelongsTo = "BelongsTo",
  HasMany = "HasMany",
  HasOne = "HasOne",
  Boolean = "Boolean",
  Model = "Model",
  Object = "Object",
  Array = "Array",
  JSON = "JSON",
  Code = "Code",
  EncryptedString = "EncryptedString",
  Vector = "Vector",
  /**
   * Any value at all.
   * Prefer FieldType.JSON where possible, it's more descriptive.
   */
  Any = "Any",
  Null = "Null",
  RecordState = "RecordState",
  RoleAssignments = "RoleAssignments",
}

const enum TenantType {
  Shop = "shop",
  Customer = "customer",
}

const shopifyModelKey = (modelName: string) => {
  const modelKey = modelName.replaceAll(" ", "");
  return `DataModel-Shopify-${modelKey}`;
};

const ShopifyShopKey = shopifyModelKey("Shop");
const ShopifyCustomerKey = shopifyModelKey("Customer");

const ShopifyBulkOperationGIDForId = (id: string) => `gid://shopify/BulkOperation/${id}`;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldType = exports.legacySuccessfulAuthentication = exports.legacyUnsetUser = exports.legacySetUser = exports.globalShopifySync = exports.finishBulkOperation = exports.preventCrossShopDataAccess = exports.abortSync = exports.shopifySync = exports.transitionState = exports.ShopifySellingPlanGroupProductState = exports.ShopifySellingPlanGroupProductVariantState = exports.ShopifyBulkOperationState = exports.ShopifySyncState = exports.ShopifyShopState = exports.deleteRecord = exports.save = exports.applyParams = exports.createGadgetRecord = void 0;
const api_client_core_1 = require("@gadgetinc/api-client-core");
const errors_1 = require("./errors");
const globals_1 = require("./globals");
const metadata_1 = require("./metadata");
const tenancy_1 = require("./tenancy");
const utils_1 = require("./utils");
function getBelongsToRelationParams(model, params) {
    const belongsToParams = {};
    for (const field of Object.values(model.fields)) {
        if (field.fieldType != "BelongsTo")
            continue;
        const modelParams = typeof params[model.apiIdentifier] === "object" ? params[model.apiIdentifier] : undefined;
        const belongsToParam = modelParams && typeof modelParams[field.apiIdentifier] === "object" ? modelParams[field.apiIdentifier] : undefined;
        const belongsToId = belongsToParam?.[LINK_PARAM] !== undefined ? belongsToParam[LINK_PARAM] : belongsToParam?.id;
        if (belongsToId !== undefined) {
            belongsToParams[`${field.apiIdentifier}Id`] = belongsToId;
        }
    }
    return belongsToParams;
}
function createGadgetRecord(apiIdentifier, data) {
    const model = getModelByApiIdentifier(apiIdentifier);
    return new api_client_core_1.GadgetRecord({
        ...data,
        __typename: model.graphqlTypeName,
    });
}
exports.createGadgetRecord = createGadgetRecord;
/**
 * Applies incoming API params (your model’s fields) to a record
 *
 * @param params - data passed from API calls, webhook events, or direct user inputs.
 * @param record - object used to pass params to
 */
function applyParams(params, record) {
    const model = getModelByTypename(record.__typename);
    Object.assign(record, params[model.apiIdentifier], getBelongsToRelationParams(model, params));
}
exports.applyParams = applyParams;
/**
 * Get the internal model manager for the model from its maybe-namespaced spot
 */
const internalModelManagerForModel = (api, apiIdentifier, namespace) => {
    const modelPath = [...namespace, apiIdentifier];
    const manager = globals_1.Globals.platformModules.lodash().get(api, ["internal", ...modelPath]);
    if (!manager) {
        throw new errors_1.InternalError(`Gadget needs but can't find an internal model manager for ${modelPath.join(".")} on the API client -- has it finished regenerating or was it recently removed?`);
    }
    return manager;
};
/**
 * Get the internal model manager for the model from its maybe-namespaced spot
 */
const internalModelManagerForTypename = (api, typename) => {
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
async function save(record) {
    const context = maybeGetActionContextFromLocalStorage();
    const api = (0, utils_1.assert)(context ? context.api : getCurrentContext().api, "api client is missing from the current context");
    const model = getModelByTypename(record.__typename);
    await (await globals_1.Globals.modelValidator(model.key)).validate({ api, logger: globals_1.Globals.logger }, record);
    const internalModelManager = internalModelManagerForTypename(api, record.__typename);
    let result;
    if ("createdAt" in record && record.createdAt) {
        result = await internalModelManager.update(record.id, {
            [model.apiIdentifier]: changedAttributes(model, record),
        });
    }
    else {
        result = await internalModelManager.create({
            [model.apiIdentifier]: writableAttributes(model, record),
        });
    }
    Object.assign(record, { ...result });
    record.flushChanges(api_client_core_1.ChangeTracking.SinceLastPersisted);
}
exports.save = save;
/**
 * Deletes record from the database.
 *
 * @param record - object deleted from the database
 */
async function deleteRecord(record) {
    const context = maybeGetActionContextFromLocalStorage();
    const api = (0, utils_1.assert)(context ? context.api : getCurrentContext().api, "api client is missing from the current context");
    const scope = context ? context.scope : {};
    const id = (0, utils_1.assert)(record.id, `record.id not set on record in scope, has the record been persisted?`);
    const internalModelManager = internalModelManagerForTypename(api, record.__typename);
    await internalModelManager.delete(id);
    scope.recordDeleted = true;
}
exports.deleteRecord = deleteRecord;
exports.ShopifyShopState = {
    Installed: { created: "installed" },
    Uninstalled: { created: "uninstalled" },
};
exports.ShopifySyncState = {
    Created: "created",
    Running: "running",
    Completed: "completed",
    Errored: "errored",
};
exports.ShopifyBulkOperationState = {
    Created: "created",
    Completed: "completed",
    Canceled: "canceled",
    Failed: "failed",
    Expired: "expired",
};
exports.ShopifySellingPlanGroupProductVariantState = {
    Started: "started",
    Created: "created",
    Deleted: "deleted",
};
exports.ShopifySellingPlanGroupProductState = {
    Started: "started",
    Created: "created",
    Deleted: "deleted",
};
function transitionState(record, transition) {
    const model = getModelByTypename(record.__typename);
    const isShopifyModel = model.apiIdentifier === "shopifyShop" || model.apiIdentifier === "shopifySync" || model.apiIdentifier === "shopifyBulkOperation";
    if (isShopifyModel && doesVersionSupportSourceControl()) {
        // In apps framework version 1.0.0+, we handle the state transition internally to Shopify models based on the above API identifiers.
        // This function becomes a no-op for those models.
        return;
    }
    const stringRecordState = typeof record.state === "string" ? record.state : JSON.stringify(record.state);
    const stringTransitionFrom = typeof transition.from === "string" ? transition.from : JSON.stringify(transition.from);
    if (transition.from && stringRecordState !== stringTransitionFrom) {
        throw new errors_1.InvalidStateTransitionError(undefined, {
            state: record.state,
            expectedFrom: transition.from,
        });
    }
    record.state = transition.to;
}
exports.transitionState = transitionState;
/**
 * The following is used to power shopifySync model.
 * Learn more about syncing visit our docs: https://docs.gadget.dev/guides/plugins/shopify/syncing-shopify-data#syncing
 */
async function shopifySync(params, record) {
    const context = getActionContextFromLocalStorage();
    const effectAPIs = context.effectAPIs;
    const syncRecord = (0, utils_1.assert)(record, "cannot start a shop sync from this action");
    const shopId = (0, utils_1.assert)(syncRecord.shopId, "a shop is required to start a sync");
    if (!syncRecord.models || (Array.isArray(syncRecord.models) && syncRecord.models.every((m) => typeof m == "string"))) {
        try {
            await effectAPIs.sync(syncRecord.id.toString(), shopId, syncRecord.syncSince, syncRecord.models, syncRecord.force, params.startReason);
        }
        catch (error) {
            globals_1.Globals.logger.error({ error, connectionSyncId: syncRecord.id }, "an error occurred starting shop sync");
            throw error;
        }
    }
    else {
        throw new errors_1.InvalidActionInputError("Models must be an array of api identifiers");
    }
}
exports.shopifySync = shopifySync;
async function abortSync(params, record) {
    const context = getActionContextFromLocalStorage();
    const effectAPIs = context.effectAPIs;
    const syncRecord = (0, utils_1.assert)(record, "a record is required to abort a shop sync");
    const syncId = (0, utils_1.assert)(syncRecord.id, "a sync id is required to start a sync");
    if (!params.errorMessage) {
        record.errorMessage = "Sync aborted";
    }
    globals_1.Globals.logger.info({ userVisible: true, connectionSyncId: syncId }, "aborting sync");
    try {
        await effectAPIs.abortSync(syncId.toString());
    }
    catch (error) {
        globals_1.Globals.logger.error({ error, connectionSyncId: syncId }, "an error occurred aborting sync");
        throw error;
    }
}
exports.abortSync = abortSync;
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
async function preventCrossShopDataAccess(params, record, options) {
    const enforceCustomerTenancy = options?.enforceCustomerTenancy ?? true;
    const context = getActionContextFromLocalStorage();
    if (context.type != "effect") {
        throw new Error("Can't prevent cross shop data access outside of an action effect");
    }
    if (!params) {
        throw new Error("The `params` parameter is required in preventCrossShopDataAccess(params, record, options?: { shopBelongsToField: string })");
    }
    if (!record) {
        throw new Error("The `record` parameter is required in preventCrossShopDataAccess(params, record, options?: { shopBelongsToField: string })");
    }
    const model = context.model;
    const appTenancy = context[tenancy_1.AppTenancyKey];
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
exports.preventCrossShopDataAccess = preventCrossShopDataAccess;
const validateBelongsToLink = (input, record, params, tenantId, model, relatedModelKey, tenantBelongsToField, tenantType) => {
    if (relatedModelKey != ShopifyShopKey && relatedModelKey != ShopifyCustomerKey) {
        throw new Error("Validation for tenancy can only be for Shopify Shop or Shopify Customer models");
    }
    // If this effect is being added to the related tenant model (Shopify Shop or Shopify Customer), simply compare the record's ID
    if (model.key == relatedModelKey) {
        if (record && String(record.id) !== tenantId) {
            throw new errors_1.PermissionDeniedError();
        }
        return;
    }
    const fieldsIsBelongsToRelatedModel = Object.values(model.fields).filter((f) => f.fieldType === FieldType.BelongsTo && f.configuration.relatedModelKey === relatedModelKey);
    if (fieldsIsBelongsToRelatedModel.length === 0) {
        throw new errors_1.MisconfiguredActionError(`This model is missing a related ${tenantType} field.`);
    }
    if (fieldsIsBelongsToRelatedModel.length > 1 && !tenantBelongsToField) {
        throw new errors_1.MisconfiguredActionError(`This function is missing a related ${tenantType} field option. \`${tenantType}BelongsToField\` is a required option parameter if the model has more than one related ${tenantType} field.`);
    }
    let relatedTenantField = fieldsIsBelongsToRelatedModel[0];
    if (tenantBelongsToField) {
        const selectedField = Object.values(model.fields).find((f) => f.apiIdentifier === tenantBelongsToField);
        if (!selectedField) {
            throw new errors_1.MisconfiguredActionError(`The selected ${tenantType} relation field does not exist.`);
        }
        if (selectedField.fieldType !== FieldType.BelongsTo || selectedField.configuration.relatedModelKey !== relatedModelKey) {
            throw new errors_1.MisconfiguredActionError(`The selected ${tenantType} relation field should be a \`Belongs To\` relationship to the \`Shopify ${globals_1.Globals.platformModules
                .lodash()
                .capitalize(tenantType)}\` model.`);
        }
        else {
            relatedTenantField = selectedField;
        }
    }
    setBelongsToLink(input, record, params, model, relatedTenantField, tenantId);
};
const setBelongsToLink = (input, record, params, model, relatedField, tenantId) => {
    // if we're trying to set the params to a shop other than the tenant we should reject
    if (globals_1.Globals.platformModules.lodash().isObjectLike(input)) {
        const objectInput = input;
        if (objectInput[relatedField.apiIdentifier]) {
            if (String(objectInput[relatedField.apiIdentifier][LINK_PARAM]) !== tenantId) {
                throw new errors_1.PermissionDeniedError();
            }
        }
        else {
            objectInput[relatedField.apiIdentifier] = {
                [LINK_PARAM]: tenantId,
            };
        }
    }
    else {
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
                throw new errors_1.PermissionDeniedError();
            }
        }
        else {
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
async function finishBulkOperation(record) {
    if (!record?.id) {
        globals_1.Globals.logger.warn(`Expected bulk operation record to be present for action`);
        return;
    }
    const context = getActionContextFromLocalStorage();
    const shopifyAPI = await context.connections.shopify.forShopId(record.shopId);
    if (!shopifyAPI) {
        globals_1.Globals.logger.error(`Could not instantiate Shopify client for shop ID ${record.shopId}`);
        return;
    }
    const bulkOperation = (await shopifyAPI.graphql(`query {
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
      }`)).node;
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
exports.finishBulkOperation = finishBulkOperation;
/**
 * Syncs Shopify models across all models
 *
 * @param params - list of Shopify app credentials to sync data from
 * @param syncSince - starting point for data sync (default: all time)
 * @param models - list of model names to sync data from
 * @param force - enforces syncswithout checking if they're up to date
 * @param startReason - a string reason stored on the created 'shopifySync' records
 */
async function globalShopifySync(params) {
    const context = maybeGetActionContextFromLocalStorage();
    const effectAPIs = (0, utils_1.assert)(context ? context.effectAPIs : getCurrentContext().effectAPIs, "effect apis is missing from the current context");
    const api = (0, utils_1.assert)(context ? context.api : getCurrentContext().api, "api client is missing from the current context");
    const { apiKeys, syncSince, models, force, startReason } = params;
    const { shopModelIdentifier, installedViaKeyFieldIdentifier, shopifySyncModelApiIdentifier, runShopifySyncAction, accessTokenIdentifier, forceFieldIdentifier, } = await effectAPIs.getSyncIdentifiers();
    const manager = internalModelManagerForModel(api, shopModelIdentifier, []);
    const pageSize = 250;
    let pageInfo = { first: pageSize, hasNextPage: true };
    const results = [];
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
                results.push(...records);
                pageInfo = records.pagination.pageInfo;
            }
        }
        catch (error) {
            globals_1.Globals.logger.info({ userVisible: true, error, apiKeys }, "could not get shops for all API keys");
            throw error;
        }
        for (const result of results) {
            // skip the sync if there is no accessToken set or if the state is uninstalled
            if (globals_1.Globals.platformModules.lodash().isEmpty(result[accessTokenIdentifier]) || result.state?.created == "uninstalled") {
                globals_1.Globals.logger.info({ shopId: result.id }, "skipping sync for shop without access token or is uninstalled");
                continue;
            }
            try {
                const shopifySyncModelManager = globals_1.Globals.platformModules.lodash().get(api, runShopifySyncAction.dotNotationPath);
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
            }
            catch (error) {
                // log that the sync could not be started for the shop but continue
                globals_1.Globals.logger.warn({ userVisible: true, error, shop: result }, "couldn't start sync for shop");
            }
        }
    }
    else {
        throw new errors_1.InvalidActionInputError("missing at least 1 api key");
    }
}
exports.globalShopifySync = globalShopifySync;
function legacySetUser() {
    const context = getActionContextFromLocalStorage();
    if (!context.scope.authenticatedUser) {
        throw new errors_1.UserNotSetOnSessionError("The authenticated user could not be saved to the session when logging in. Make sure the user has a role assigned to them.");
    }
    if (!context.session) {
        throw new errors_1.NoSessionForAuthenticationError("Unable to authenticate because the request was made with no session in context to transition.");
    }
    context.session.set("user", { [LINK_PARAM]: context.scope.authenticatedUser.id });
}
exports.legacySetUser = legacySetUser;
function legacyUnsetUser() {
    const context = getActionContextFromLocalStorage();
    if (!context.session) {
        throw new errors_1.NoSessionForAuthenticationError("Unable to unset users on session because the request was made with no session.");
    }
    context.session.delete("user");
}
exports.legacyUnsetUser = legacyUnsetUser;
async function legacySuccessfulAuthentication(params) {
    const context = getActionContextFromLocalStorage();
    const { api, scope } = context;
    const manager = api.internal.user;
    const user = (await manager.findMany({ filter: { email: { equals: params.email } } }))[0];
    let result = false;
    if (user && params.password && user.password?.hash) {
        if (await globals_1.Globals.platformModules.bcrypt().compare(params.password, user.password.hash)) {
            scope.authenticatedUser = user;
            result = true;
        }
    }
    globals_1.Globals.logger.info({ email: params.email, userId: user?.id, result }, "login attempt");
    if (!result) {
        throw new Error("Invalid email or password");
    }
}
exports.legacySuccessfulAuthentication = legacySuccessfulAuthentication;
/**
 * @private helper functions and variables
 */
function doesVersionSupportSourceControl() {
    return globals_1.Globals.platformModules.compareVersions().satisfies(metadata_1.frameworkVersion, ">=1.0.0");
}
/**
 * @private Get action context without `params` and `record` from async local storage.
 */
function getActionContextFromLocalStorage() {
    return (0, utils_1.assert)(globals_1.actionContextLocalStorage.getStore(), "this effect function should only be called from within an action");
}
/**
 * @private Similar to `getActionContextFromLocalStorage` but returns `undefined` if there is no action context. (i.e. possibly called from a route)
 */
function maybeGetActionContextFromLocalStorage() {
    return globals_1.actionContextLocalStorage.getStore();
}
function getCurrentContext() {
    return (0, utils_1.assert)(globals_1.Globals.requestContext.get("requestContext"), "no gadget context found on request");
}
const LINK_PARAM = "_link";
function writableAttributes(model, record) {
    const fieldsByApiIdentifier = globals_1.Globals.platformModules.lodash().keyBy(Object.values(model.fields), "apiIdentifier");
    return globals_1.Globals.platformModules.lodash().pickBy(record, (v, k) => fieldsByApiIdentifier[k]?.internalWritable);
}
function changedAttributes(model, record) {
    const changes = record.changes();
    const attributes = Object.keys(changes).reduce((attrs, key) => {
        attrs[key] = record[key];
        return attrs;
    }, {});
    return writableAttributes(model, attributes);
}
const getModelByApiIdentifier = (apiIdentifier) => {
    const typename = metadata_1.modelListIndex[`api:${apiIdentifier}`];
    if (!typename) {
        throw new errors_1.InternalError(`Model ${apiIdentifier} not found in available model metadata`, {
            availableApiIdentifiers: Object.keys(metadata_1.modelListIndex),
        });
    }
    return getModelByTypename(typename);
};
const getModelByTypename = (typename) => {
    if (!typename) {
        throw new errors_1.InternalError(`No typename found on record, __typename must be set for accessing model metadata`);
    }
    const model = metadata_1.modelsMap[typename];
    if (!model) {
        throw new errors_1.InternalError(`Model with typename ${typename} not found in available model metadata`, {
            availableTypenames: Object.keys(metadata_1.modelsMap),
        });
    }
    return model;
};
var FieldType;
(function (FieldType) {
    FieldType["ID"] = "ID";
    FieldType["Number"] = "Number";
    FieldType["String"] = "String";
    FieldType["Enum"] = "Enum";
    FieldType["RichText"] = "RichText";
    FieldType["DateTime"] = "DateTime";
    FieldType["Email"] = "Email";
    FieldType["URL"] = "URL";
    FieldType["Money"] = "Money";
    FieldType["File"] = "File";
    FieldType["Color"] = "Color";
    FieldType["Password"] = "Password";
    FieldType["Computed"] = "Computed";
    FieldType["HasManyThrough"] = "HasManyThrough";
    FieldType["BelongsTo"] = "BelongsTo";
    FieldType["HasMany"] = "HasMany";
    FieldType["HasOne"] = "HasOne";
    FieldType["Boolean"] = "Boolean";
    FieldType["Model"] = "Model";
    FieldType["Object"] = "Object";
    FieldType["Array"] = "Array";
    FieldType["JSON"] = "JSON";
    FieldType["Code"] = "Code";
    FieldType["EncryptedString"] = "EncryptedString";
    FieldType["Vector"] = "Vector";
    /**
     * Any value at all.
     * Prefer FieldType.JSON where possible, it's more descriptive.
     */
    FieldType["Any"] = "Any";
    FieldType["Null"] = "Null";
    FieldType["RecordState"] = "RecordState";
    FieldType["RoleAssignments"] = "RoleAssignments";
})(FieldType || (exports.FieldType = FieldType = {}));
var TenantType;
(function (TenantType) {
    TenantType["Shop"] = "shop";
    TenantType["Customer"] = "customer";
})(TenantType || (TenantType = {}));
const shopifyModelKey = (modelName) => {
    const modelKey = modelName.replaceAll(" ", "");
    return `DataModel-Shopify-${modelKey}`;
};
const ShopifyShopKey = shopifyModelKey("Shop");
const ShopifyCustomerKey = shopifyModelKey("Customer");
const ShopifyBulkOperationGIDForId = (id) => `gid://shopify/BulkOperation/${id}`;
//# sourceMappingURL=effects.js.map
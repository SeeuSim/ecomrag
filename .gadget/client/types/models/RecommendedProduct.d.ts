import { GadgetConnection, GadgetRecord, GadgetRecordList, DefaultSelection, LimitToKnownKeys, Selectable } from "@gadgetinc/api-client-core";
import { Query, Select, DeepFilterNever, IDsList, RecommendedProduct, RecommendedProductSort, RecommendedProductFilter, AvailableRecommendedProductSelection, CreateRecommendedProductInput, UpdateRecommendedProductInput } from "../types.js";
export declare const DefaultRecommendedProductSelection: {
    readonly __typename: true;
    readonly createdAt: true;
    readonly id: true;
    readonly updatedAt: true;
};
/**
* Produce a type that holds only the selected fields (and nested fields) of "recommendedProduct". The present fields in the result type of this are dynamic based on the options to each call that uses it.
* The selected fields are sometimes given by the `Options` at `Options["select"]`, and if a selection isn't made in the options, we use the default selection from above.
*/
export type SelectedRecommendedProductOrDefault<Options extends Selectable<AvailableRecommendedProductSelection>> = DeepFilterNever<Select<RecommendedProduct, DefaultSelection<AvailableRecommendedProductSelection, Options, typeof DefaultRecommendedProductSelection>>>;
/** Options that can be passed to the `RecommendedProductManager#findOne` method */
export interface FindOneRecommendedProductOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableRecommendedProductSelection;
}
/** Options that can be passed to the `RecommendedProductManager#maybeFindOne` method */
export interface MaybeFindOneRecommendedProductOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableRecommendedProductSelection;
}
/** Options that can be passed to the `RecommendedProductManager#findMany` method */
export interface FindManyRecommendedProductsOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableRecommendedProductSelection;
    /** Return records sorted by these sorts */
    sort?: RecommendedProductSort | RecommendedProductSort[] | null;
    /** Only return records matching these filters. */
    filter?: RecommendedProductFilter | RecommendedProductFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
    first?: number | null;
    last?: number | null;
    after?: string | null;
    before?: string | null;
}
/** Options that can be passed to the `RecommendedProductManager#findFirst` method */
export interface FindFirstRecommendedProductOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableRecommendedProductSelection;
    /** Return records sorted by these sorts */
    sort?: RecommendedProductSort | RecommendedProductSort[] | null;
    /** Only return records matching these filters. */
    filter?: RecommendedProductFilter | RecommendedProductFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
}
/** Options that can be passed to the `RecommendedProductManager#maybeFindFirst` method */
export interface MaybeFindFirstRecommendedProductOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableRecommendedProductSelection;
    /** Return records sorted by these sorts */
    sort?: RecommendedProductSort | RecommendedProductSort[] | null;
    /** Only return records matching these filters. */
    filter?: RecommendedProductFilter | RecommendedProductFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
}
export interface CreateRecommendedProductOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableRecommendedProductSelection;
}
export interface UpdateRecommendedProductOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableRecommendedProductSelection;
}
export interface DeleteRecommendedProductOptions {
}
/**
 * The fully-qualified, expanded form of the inputs for executing this action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedCreateRecommendedProductVariables = {
    recommendedProduct?: CreateRecommendedProductInput;
};
/**
 * The inputs for executing create on recommendedProduct.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type CreateRecommendedProductVariables = CreateRecommendedProductInput;
/**
 * The return value from executing create on recommendedProduct.
 * "Is a GadgetRecord of the model's type."
 **/
export type CreateRecommendedProductResult<Options extends CreateRecommendedProductOptions> = SelectedRecommendedProductOrDefault<Options> extends void ? void : GadgetRecord<SelectedRecommendedProductOrDefault<Options>>;
/**
  * Executes the create action. Accepts the parameters for the action via the `variables` argument. Runs the action and returns a Promise for the updated record.
  */
declare function createRecommendedProduct<Options extends CreateRecommendedProductOptions>(variables: CreateRecommendedProductVariables, options?: LimitToKnownKeys<Options, CreateRecommendedProductOptions>): Promise<CreateRecommendedProductResult<Options>>;
declare function createRecommendedProduct<Options extends CreateRecommendedProductOptions>(variables: FullyQualifiedCreateRecommendedProductVariables, options?: LimitToKnownKeys<Options, CreateRecommendedProductOptions>): Promise<CreateRecommendedProductResult<Options>>;
/**
 * The fully-qualified, expanded form of the inputs for executing this action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedUpdateRecommendedProductVariables = {
    recommendedProduct?: UpdateRecommendedProductInput;
};
/**
 * The inputs for executing update on recommendedProduct.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type UpdateRecommendedProductVariables = UpdateRecommendedProductInput;
/**
 * The return value from executing update on recommendedProduct.
 * "Is a GadgetRecord of the model's type."
 **/
export type UpdateRecommendedProductResult<Options extends UpdateRecommendedProductOptions> = SelectedRecommendedProductOrDefault<Options> extends void ? void : GadgetRecord<SelectedRecommendedProductOrDefault<Options>>;
/**
  * Executes the update action on one record specified by `id`. Runs the action and returns a Promise for the updated record.
  */
declare function updateRecommendedProduct<Options extends UpdateRecommendedProductOptions>(id: string, variables: UpdateRecommendedProductVariables, options?: LimitToKnownKeys<Options, UpdateRecommendedProductOptions>): Promise<UpdateRecommendedProductResult<Options>>;
declare function updateRecommendedProduct<Options extends UpdateRecommendedProductOptions>(id: string, variables: FullyQualifiedUpdateRecommendedProductVariables, options?: LimitToKnownKeys<Options, UpdateRecommendedProductOptions>): Promise<UpdateRecommendedProductResult<Options>>;
/**
 * The return value from executing delete on recommendedProduct.
 * "Is void because this action deletes the record"
 **/
export type DeleteRecommendedProductResult<Options extends DeleteRecommendedProductOptions> = void extends void ? void : GadgetRecord<SelectedRecommendedProductOrDefault<Options>>;
/**
  * Executes the delete action on one record specified by `id`. Deletes the record on the server. Returns a Promise that resolves if the delete succeeds.
  */
declare function deleteRecommendedProduct<Options extends DeleteRecommendedProductOptions>(id: string, options?: LimitToKnownKeys<Options, DeleteRecommendedProductOptions>): Promise<DeleteRecommendedProductResult<Options>>;
/** All the actions available at the collection level and record level for "recommendedProduct" */
export declare class RecommendedProductManager {
    readonly connection: GadgetConnection;
    constructor(connection: GadgetConnection);
    /**
 * Finds one recommendedProduct by ID. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
 **/
    findOne: {
        <Options extends FindOneRecommendedProductOptions>(id: string, options?: LimitToKnownKeys<Options, FindOneRecommendedProductOptions>): Promise<GadgetRecord<SelectedRecommendedProductOrDefault<Options>>>;
        type: "findOne";
        findByVariableName: "id";
        operationName: "recommendedProduct";
        modelApiIdentifier: "recommendedProduct";
        defaultSelection: typeof DefaultRecommendedProductSelection;
        selectionType: AvailableRecommendedProductSelection;
        optionsType: FindOneRecommendedProductOptions;
        schemaType: Query["recommendedProduct"];
    };
    /**
 * Finds one recommendedProduct by ID. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
 **/
    maybeFindOne: {
        <Options extends MaybeFindOneRecommendedProductOptions>(id: string, options?: LimitToKnownKeys<Options, MaybeFindOneRecommendedProductOptions>): Promise<GadgetRecord<SelectedRecommendedProductOrDefault<Options>> | null>;
        type: "maybeFindOne";
        findByVariableName: "id";
        operationName: "recommendedProduct";
        modelApiIdentifier: "recommendedProduct";
        defaultSelection: typeof DefaultRecommendedProductSelection;
        selectionType: AvailableRecommendedProductSelection;
        optionsType: MaybeFindOneRecommendedProductOptions;
        schemaType: Query["recommendedProduct"];
    };
    /**
 * Finds many recommendedProduct. Returns a `Promise` for a `GadgetRecordList` of objects according to the passed `options`. Optionally filters the returned records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
 **/
    findMany: {
        <Options extends FindManyRecommendedProductsOptions>(options?: LimitToKnownKeys<Options, FindManyRecommendedProductsOptions>): Promise<GadgetRecordList<SelectedRecommendedProductOrDefault<Options>>>;
        type: "findMany";
        operationName: "recommendedProducts";
        modelApiIdentifier: "recommendedProduct";
        defaultSelection: typeof DefaultRecommendedProductSelection;
        selectionType: AvailableRecommendedProductSelection;
        optionsType: FindManyRecommendedProductsOptions;
        schemaType: Query["recommendedProduct"];
    };
    /**
 * Finds the first matching recommendedProduct. Returns a `Promise` that resolves to a record if found and rejects the promise if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
 **/
    findFirst: {
        <Options extends FindFirstRecommendedProductOptions>(options?: LimitToKnownKeys<Options, FindFirstRecommendedProductOptions>): Promise<GadgetRecord<SelectedRecommendedProductOrDefault<Options>>>;
        type: "findFirst";
        operationName: "recommendedProducts";
        modelApiIdentifier: "recommendedProduct";
        defaultSelection: typeof DefaultRecommendedProductSelection;
        selectionType: AvailableRecommendedProductSelection;
        optionsType: FindFirstRecommendedProductOptions;
        schemaType: Query["recommendedProduct"];
    };
    /**
 * Finds the first matching recommendedProduct. Returns a `Promise` that resolves to a record if found, or null if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` pagination options.
 **/
    maybeFindFirst: {
        <Options extends MaybeFindFirstRecommendedProductOptions>(options?: LimitToKnownKeys<Options, MaybeFindFirstRecommendedProductOptions>): Promise<GadgetRecord<SelectedRecommendedProductOrDefault<Options>> | null>;
        type: "maybeFindFirst";
        operationName: "recommendedProducts";
        modelApiIdentifier: "recommendedProduct";
        defaultSelection: typeof DefaultRecommendedProductSelection;
        selectionType: AvailableRecommendedProductSelection;
        optionsType: MaybeFindFirstRecommendedProductOptions;
        schemaType: Query["recommendedProduct"];
    };
    /**
  * Finds one recommendedProduct by its id. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
  **/
    findById: {
        <Options extends FindOneRecommendedProductOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneRecommendedProductOptions>): Promise<GadgetRecord<SelectedRecommendedProductOrDefault<Options>>>;
        type: "findOne";
        findByVariableName: "id";
        operationName: "recommendedProducts";
        modelApiIdentifier: "recommendedProduct";
        defaultSelection: typeof DefaultRecommendedProductSelection;
        selectionType: AvailableRecommendedProductSelection;
        optionsType: FindOneRecommendedProductOptions;
        schemaType: Query["recommendedProduct"];
    };
    create: typeof createRecommendedProduct & {
        type: "action";
        operationName: "createRecommendedProduct";
        namespace: null;
        modelApiIdentifier: "recommendedProduct";
        modelSelectionField: "recommendedProduct";
        isBulk: false;
        defaultSelection: typeof DefaultRecommendedProductSelection;
        selectionType: AvailableRecommendedProductSelection;
        optionsType: CreateRecommendedProductOptions;
        schemaType: Query["recommendedProduct"];
        variablesType: ((FullyQualifiedCreateRecommendedProductVariables | CreateRecommendedProductVariables)) | undefined;
        variables: {
            "recommendedProduct": {
                required: false;
                type: "CreateRecommendedProductInput";
            };
        };
        hasAmbiguousIdentifier: false;
        /** @deprecated -- effects are dead, long live AAC */
        hasCreateOrUpdateEffect: true;
        paramOnlyVariables: [];
        hasReturnType: false;
        acceptsModelInput: true;
    };
    /**
* Executes the bulkCreate action with the given inputs.
*/
    bulkCreate: {
        <Options extends CreateRecommendedProductOptions>(inputs: (FullyQualifiedCreateRecommendedProductVariables | CreateRecommendedProductVariables)[], options?: LimitToKnownKeys<Options, CreateRecommendedProductOptions>): Promise<CreateRecommendedProductResult<Options>[]>;
        type: "action";
        operationName: "bulkCreateRecommendedProducts";
        namespace: null;
        modelApiIdentifier: "recommendedProduct";
        modelSelectionField: "recommendedProducts";
        isBulk: true;
        defaultSelection: typeof DefaultRecommendedProductSelection;
        selectionType: AvailableRecommendedProductSelection;
        optionsType: CreateRecommendedProductOptions;
        schemaType: Query["recommendedProduct"];
        variablesType: (FullyQualifiedCreateRecommendedProductVariables | CreateRecommendedProductVariables)[];
        variables: {
            inputs: {
                required: true;
                type: "[BulkCreateRecommendedProductsInput!]";
            };
        };
        hasReturnType: boolean;
        acceptsModelInput: boolean;
    };
    update: typeof updateRecommendedProduct & {
        type: "action";
        operationName: "updateRecommendedProduct";
        namespace: null;
        modelApiIdentifier: "recommendedProduct";
        modelSelectionField: "recommendedProduct";
        isBulk: false;
        defaultSelection: typeof DefaultRecommendedProductSelection;
        selectionType: AvailableRecommendedProductSelection;
        optionsType: UpdateRecommendedProductOptions;
        schemaType: Query["recommendedProduct"];
        variablesType: ({
            id: string;
        } & (FullyQualifiedUpdateRecommendedProductVariables | UpdateRecommendedProductVariables)) | undefined;
        variables: {
            id: {
                required: true;
                type: "GadgetID";
            };
            "recommendedProduct": {
                required: false;
                type: "UpdateRecommendedProductInput";
            };
        };
        hasAmbiguousIdentifier: false;
        /** @deprecated -- effects are dead, long live AAC */
        hasCreateOrUpdateEffect: true;
        paramOnlyVariables: [];
        hasReturnType: false;
        acceptsModelInput: true;
    };
    /**
* Executes the bulkUpdate action with the given inputs.
*/
    bulkUpdate: {
        <Options extends UpdateRecommendedProductOptions>(inputs: (FullyQualifiedUpdateRecommendedProductVariables | UpdateRecommendedProductVariables & {
            id: string;
        })[], options?: LimitToKnownKeys<Options, UpdateRecommendedProductOptions>): Promise<UpdateRecommendedProductResult<Options>[]>;
        type: "action";
        operationName: "bulkUpdateRecommendedProducts";
        namespace: null;
        modelApiIdentifier: "recommendedProduct";
        modelSelectionField: "recommendedProducts";
        isBulk: true;
        defaultSelection: typeof DefaultRecommendedProductSelection;
        selectionType: AvailableRecommendedProductSelection;
        optionsType: UpdateRecommendedProductOptions;
        schemaType: Query["recommendedProduct"];
        variablesType: (FullyQualifiedUpdateRecommendedProductVariables | UpdateRecommendedProductVariables & {
            id: string;
        })[];
        variables: {
            inputs: {
                required: true;
                type: "[BulkUpdateRecommendedProductsInput!]";
            };
        };
        hasReturnType: boolean;
        acceptsModelInput: boolean;
    };
    delete: typeof deleteRecommendedProduct & {
        type: "action";
        operationName: "deleteRecommendedProduct";
        namespace: null;
        modelApiIdentifier: "recommendedProduct";
        modelSelectionField: "recommendedProduct";
        isBulk: false;
        defaultSelection: null;
        selectionType: Record<string, never>;
        optionsType: DeleteRecommendedProductOptions;
        schemaType: null;
        variablesType: ({
            id: string;
        } & {}) | undefined;
        variables: {
            id: {
                required: true;
                type: "GadgetID";
            };
        };
        hasAmbiguousIdentifier: false;
        /** @deprecated -- effects are dead, long live AAC */
        hasCreateOrUpdateEffect: false;
        paramOnlyVariables: [];
        hasReturnType: false;
        acceptsModelInput: false;
    };
    /**
* Executes the bulkDelete action with the given inputs. Deletes the records on the server.
*/
    bulkDelete: {
        <Options extends DeleteRecommendedProductOptions>(ids: string[], options?: LimitToKnownKeys<Options, DeleteRecommendedProductOptions>): Promise<DeleteRecommendedProductResult<Options>[]>;
        type: "action";
        operationName: "bulkDeleteRecommendedProducts";
        namespace: null;
        modelApiIdentifier: "recommendedProduct";
        modelSelectionField: "recommendedProducts";
        isBulk: true;
        defaultSelection: null;
        selectionType: Record<string, never>;
        optionsType: DeleteRecommendedProductOptions;
        schemaType: null;
        variablesType: IDsList | undefined;
        variables: {
            ids: {
                required: true;
                type: "[GadgetID!]";
            };
        };
        hasReturnType: boolean;
        acceptsModelInput: boolean;
    };
}
export {};

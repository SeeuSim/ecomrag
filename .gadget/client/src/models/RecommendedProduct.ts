import {
  GadgetConnection,
  GadgetRecord,
  GadgetRecordImplementation,
  GadgetRecordList,
  GadgetNonUniqueDataError,
  actionRunner,
  findManyRunner,
  findOneRunner,
  findOneByFieldRunner,
  DefaultSelection,
  LimitToKnownKeys,
  Selectable
} from "@gadgetinc/api-client-core";

import {
  Query,
  ExplicitNestingRequired,
  Select,
  DeepFilterNever,
  IDsList,
      RecommendedProduct,
      RecommendedProductSort,
      RecommendedProductFilter,
      AvailableRecommendedProductSelection,
      CreateRecommendedProductInput,
      UpdateRecommendedProductInput,
  
} from "../types.js";

import { disambiguateActionParams } from "../support.js";

export const DefaultRecommendedProductSelection = {
  "__typename": true,
  "createdAt": true,
  "id": true,
  "updatedAt": true
} as const;

/**
* Produce a type that holds only the selected fields (and nested fields) of "recommendedProduct". The present fields in the result type of this are dynamic based on the options to each call that uses it.
* The selected fields are sometimes given by the `Options` at `Options["select"]`, and if a selection isn't made in the options, we use the default selection from above.
*/
export type SelectedRecommendedProductOrDefault<Options extends Selectable<AvailableRecommendedProductSelection>> = DeepFilterNever<
  Select<
    RecommendedProduct,
    DefaultSelection<
      AvailableRecommendedProductSelection,
      Options,
      typeof DefaultRecommendedProductSelection
    >
  >>;

/** Options that can be passed to the `RecommendedProductManager#findOne` method */
export interface FindOneRecommendedProductOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableRecommendedProductSelection;
};

/** Options that can be passed to the `RecommendedProductManager#maybeFindOne` method */
export interface MaybeFindOneRecommendedProductOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableRecommendedProductSelection;
};

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
};

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
};

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
};


export interface CreateRecommendedProductOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableRecommendedProductSelection;
};


export interface UpdateRecommendedProductOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableRecommendedProductSelection;
};


export interface DeleteRecommendedProductOptions {
};


const apiIdentifier = "recommendedProduct";
const pluralApiIdentifier = "recommendedProducts";


    
  /**
   * The fully-qualified, expanded form of the inputs for executing this action.
   * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
   **/
  export type FullyQualifiedCreateRecommendedProductVariables = {
          recommendedProduct?: CreateRecommendedProductInput,
      }

  /**
   * The inputs for executing create on recommendedProduct.
   * This is the flattened style of inputs, suitable for general use, and should be preferred.
   **/

    export type CreateRecommendedProductVariables = CreateRecommendedProductInput;



/**
 * The return value from executing create on recommendedProduct.
 * "Is a GadgetRecord of the model's type."
 **/
export type CreateRecommendedProductResult<Options extends CreateRecommendedProductOptions> =
  SelectedRecommendedProductOrDefault<Options> extends void ? void : GadgetRecord<SelectedRecommendedProductOrDefault<Options>>
;


/**
  * Executes the create action. Accepts the parameters for the action via the `variables` argument. Runs the action and returns a Promise for the updated record.
  */

// Flat style overload
async function createRecommendedProduct<Options extends CreateRecommendedProductOptions>(
  
    variables: CreateRecommendedProductVariables,

  options?: LimitToKnownKeys<Options, CreateRecommendedProductOptions>
): Promise<CreateRecommendedProductResult<Options>>;

// Fully qualified, nested api identifier overload
async function createRecommendedProduct<Options extends CreateRecommendedProductOptions>(
  
      variables: FullyQualifiedCreateRecommendedProductVariables,
  
  options?: LimitToKnownKeys<Options, CreateRecommendedProductOptions>
): Promise<CreateRecommendedProductResult<Options>>;

// Function implementation
async function createRecommendedProduct<Options extends CreateRecommendedProductOptions>(
  this: RecommendedProductManager,
  
      variables: CreateRecommendedProductVariables | FullyQualifiedCreateRecommendedProductVariables,
  
  options?: LimitToKnownKeys<Options, CreateRecommendedProductOptions>
): Promise<CreateRecommendedProductResult<Options>> {
    const newVariables = disambiguateActionParams(
      this["create"],
       undefined,
      variables
    );

  return (await actionRunner<SelectedRecommendedProductOrDefault<Options>>(
    this,
    "createRecommendedProduct",
    DefaultRecommendedProductSelection,
    apiIdentifier,
    apiIdentifier,
    false,
    {
                    "recommendedProduct": {
          value: newVariables.recommendedProduct,
          required: false,
          type: "CreateRecommendedProductInput",
        },
          },
    options,
    null,
    false
  ));
}

  
    
  /**
   * The fully-qualified, expanded form of the inputs for executing this action.
   * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
   **/
  export type FullyQualifiedUpdateRecommendedProductVariables = {
          recommendedProduct?: UpdateRecommendedProductInput,
      }

  /**
   * The inputs for executing update on recommendedProduct.
   * This is the flattened style of inputs, suitable for general use, and should be preferred.
   **/

    export type UpdateRecommendedProductVariables = UpdateRecommendedProductInput;



/**
 * The return value from executing update on recommendedProduct.
 * "Is a GadgetRecord of the model's type."
 **/
export type UpdateRecommendedProductResult<Options extends UpdateRecommendedProductOptions> =
  SelectedRecommendedProductOrDefault<Options> extends void ? void : GadgetRecord<SelectedRecommendedProductOrDefault<Options>>
;


/**
  * Executes the update action on one record specified by `id`. Runs the action and returns a Promise for the updated record.
  */

// Flat style overload
async function updateRecommendedProduct<Options extends UpdateRecommendedProductOptions>(
  id: string,
    variables: UpdateRecommendedProductVariables,

  options?: LimitToKnownKeys<Options, UpdateRecommendedProductOptions>
): Promise<UpdateRecommendedProductResult<Options>>;

// Fully qualified, nested api identifier overload
async function updateRecommendedProduct<Options extends UpdateRecommendedProductOptions>(
  id: string,
      variables: FullyQualifiedUpdateRecommendedProductVariables,
  
  options?: LimitToKnownKeys<Options, UpdateRecommendedProductOptions>
): Promise<UpdateRecommendedProductResult<Options>>;

// Function implementation
async function updateRecommendedProduct<Options extends UpdateRecommendedProductOptions>(
  this: RecommendedProductManager,
  id: string,
      variables: UpdateRecommendedProductVariables | FullyQualifiedUpdateRecommendedProductVariables,
  
  options?: LimitToKnownKeys<Options, UpdateRecommendedProductOptions>
): Promise<UpdateRecommendedProductResult<Options>> {
    const newVariables = disambiguateActionParams(
      this["update"],
       id,
      variables
    );

  return (await actionRunner<SelectedRecommendedProductOrDefault<Options>>(
    this,
    "updateRecommendedProduct",
    DefaultRecommendedProductSelection,
    apiIdentifier,
    apiIdentifier,
    false,
    {
              id: {
          value: id,
          required: true,
          type: "GadgetID",
        },
                    "recommendedProduct": {
          value: newVariables.recommendedProduct,
          required: false,
          type: "UpdateRecommendedProductInput",
        },
          },
    options,
    null,
    false
  ));
}

  
    

/**
 * The return value from executing delete on recommendedProduct.
 * "Is void because this action deletes the record"
 **/
export type DeleteRecommendedProductResult<Options extends DeleteRecommendedProductOptions> =
  void extends void ? void : GadgetRecord<SelectedRecommendedProductOrDefault<Options>>
;


/**
  * Executes the delete action on one record specified by `id`. Deletes the record on the server. Returns a Promise that resolves if the delete succeeds.
  */

// Fully qualified, nested api identifier overload
async function deleteRecommendedProduct<Options extends DeleteRecommendedProductOptions>(
  id: string,
  
  options?: LimitToKnownKeys<Options, DeleteRecommendedProductOptions>
): Promise<DeleteRecommendedProductResult<Options>>;

// Function implementation
async function deleteRecommendedProduct<Options extends DeleteRecommendedProductOptions>(
  this: RecommendedProductManager,
  id: string,
  
  options?: LimitToKnownKeys<Options, DeleteRecommendedProductOptions>
): Promise<DeleteRecommendedProductResult<Options>> {

  return (await actionRunner<void>(
    this,
    "deleteRecommendedProduct",
    null,
    apiIdentifier,
    apiIdentifier,
    false,
    {
              id: {
          value: id,
          required: true,
          type: "GadgetID",
        },
                },
    options,
    null,
    false
  ));
}

  



/** All the actions available at the collection level and record level for "recommendedProduct" */
export class RecommendedProductManager {
  constructor(readonly connection: GadgetConnection) {}

  
    /**
 * Finds one recommendedProduct by ID. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
 **/
findOne: {
  <Options extends FindOneRecommendedProductOptions>(id: string, options?: LimitToKnownKeys<Options, FindOneRecommendedProductOptions>):
    Promise<
      GadgetRecord<
        SelectedRecommendedProductOrDefault<Options>
      >
    >;
  type: "findOne",
  findByVariableName: "id";
  operationName: "recommendedProduct";
  modelApiIdentifier: "recommendedProduct";
  defaultSelection: typeof DefaultRecommendedProductSelection;
  selectionType: AvailableRecommendedProductSelection;
  optionsType: FindOneRecommendedProductOptions;
  schemaType: Query["recommendedProduct"];
} = Object.assign(
  async <Options extends FindOneRecommendedProductOptions>(id: string, options?: LimitToKnownKeys<Options, FindOneRecommendedProductOptions>) => {
    return await findOneRunner<SelectedRecommendedProductOrDefault<Options>>(
      this,
      "recommendedProduct",
      id,
      DefaultRecommendedProductSelection,
      apiIdentifier,
      options
    );
  },
  {
    type: "findOne",
    findByVariableName: "id",
    operationName: "recommendedProduct",
    modelApiIdentifier: apiIdentifier,
    defaultSelection: DefaultRecommendedProductSelection,
  } as any
)

  
    /**
 * Finds one recommendedProduct by ID. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
 **/
maybeFindOne: {
  <Options extends MaybeFindOneRecommendedProductOptions>(id: string, options?: LimitToKnownKeys<Options, MaybeFindOneRecommendedProductOptions>):
    Promise<
      GadgetRecord<
        SelectedRecommendedProductOrDefault<Options>
      > | null
    >;
  type: "maybeFindOne";
  findByVariableName: "id";
  operationName: "recommendedProduct";
  modelApiIdentifier: "recommendedProduct";
  defaultSelection: typeof DefaultRecommendedProductSelection;
  selectionType: AvailableRecommendedProductSelection;
  optionsType: MaybeFindOneRecommendedProductOptions;
  schemaType: Query["recommendedProduct"];
} = Object.assign(
  async <Options extends MaybeFindOneRecommendedProductOptions>(id: string, options?: LimitToKnownKeys<Options, MaybeFindOneRecommendedProductOptions>) => {
    const record = await findOneRunner<SelectedRecommendedProductOrDefault<Options>>(
      this,
      "recommendedProduct",
      id,
      DefaultRecommendedProductSelection,
      apiIdentifier,
      options,
      false
    );
    return record.isEmpty() ? null : record;
  },
  {
    type: "maybeFindOne",
    findByVariableName: "id",
    operationName: "recommendedProduct",
    modelApiIdentifier: "recommendedProduct",
    defaultSelection: DefaultRecommendedProductSelection,
  } as any
)

  
    /**
 * Finds many recommendedProduct. Returns a `Promise` for a `GadgetRecordList` of objects according to the passed `options`. Optionally filters the returned records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
 **/
findMany: {
  <Options extends FindManyRecommendedProductsOptions>(options?: LimitToKnownKeys<Options, FindManyRecommendedProductsOptions>):
    Promise<
      GadgetRecordList<
        SelectedRecommendedProductOrDefault<Options>
      >
    >;
  type: "findMany";
  operationName: "recommendedProducts";
  modelApiIdentifier: "recommendedProduct";
  defaultSelection: typeof DefaultRecommendedProductSelection;
  selectionType: AvailableRecommendedProductSelection;
  optionsType: FindManyRecommendedProductsOptions;
  schemaType: Query["recommendedProduct"];
} = Object.assign(
  async <Options extends FindManyRecommendedProductsOptions>(options?: LimitToKnownKeys<Options, FindManyRecommendedProductsOptions>):
    Promise<
      GadgetRecordList<
        SelectedRecommendedProductOrDefault<Options>
      >
    > =>
  {
    return await findManyRunner<SelectedRecommendedProductOrDefault<Options>>(
      this,
      "recommendedProducts",
      DefaultRecommendedProductSelection,
      "recommendedProduct",
      options
    );
  },
  {
    type: "findMany",
    operationName: "recommendedProducts",
    modelApiIdentifier: apiIdentifier,
    defaultSelection: DefaultRecommendedProductSelection,
  } as any
);

  
    /**
 * Finds the first matching recommendedProduct. Returns a `Promise` that resolves to a record if found and rejects the promise if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
 **/
findFirst: {
  <Options extends FindFirstRecommendedProductOptions>(options?: LimitToKnownKeys<Options, FindFirstRecommendedProductOptions>):
    Promise<
      GadgetRecord<
        SelectedRecommendedProductOrDefault<Options>
      >
    >;
  type: "findFirst";
  operationName: "recommendedProducts";
  modelApiIdentifier: "recommendedProduct";
  defaultSelection: typeof DefaultRecommendedProductSelection;
  selectionType: AvailableRecommendedProductSelection;
  optionsType: FindFirstRecommendedProductOptions;
  schemaType: Query["recommendedProduct"];
} = Object.assign(
  async <Options extends FindFirstRecommendedProductOptions>(options?: LimitToKnownKeys<Options, FindFirstRecommendedProductOptions>):
    Promise<
      GadgetRecord<
        SelectedRecommendedProductOrDefault<Options>
      >
    > =>
  {
    const list = await findManyRunner<SelectedRecommendedProductOrDefault<Options>>(
      this,
      "recommendedProducts",
      DefaultRecommendedProductSelection,
      apiIdentifier,
      { ...options, first: 1, last: undefined, before: undefined, after: undefined },
      true
    );
    return list[0];
  },
  {
    type: "findFirst",
    operationName: "recommendedProducts",
    modelApiIdentifier: apiIdentifier,
    defaultSelection: DefaultRecommendedProductSelection,
  } as any
);

  
    /**
 * Finds the first matching recommendedProduct. Returns a `Promise` that resolves to a record if found, or null if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` pagination options.
 **/
maybeFindFirst: {
  <Options extends MaybeFindFirstRecommendedProductOptions>(options?: LimitToKnownKeys<Options, MaybeFindFirstRecommendedProductOptions>):
    Promise<
      GadgetRecord<
        SelectedRecommendedProductOrDefault<Options>
      > | null
    >;
  type: "maybeFindFirst";
  operationName: "recommendedProducts";
  modelApiIdentifier: "recommendedProduct";
  defaultSelection: typeof DefaultRecommendedProductSelection;
  selectionType: AvailableRecommendedProductSelection;
  optionsType: MaybeFindFirstRecommendedProductOptions;
  schemaType: Query["recommendedProduct"];
} = Object.assign(
  async <Options extends MaybeFindFirstRecommendedProductOptions>(options?: LimitToKnownKeys<Options, MaybeFindFirstRecommendedProductOptions>):
    Promise<
      GadgetRecord<
        SelectedRecommendedProductOrDefault<Options>
      > | null
    > =>
  {
    const list = await findManyRunner<SelectedRecommendedProductOrDefault<Options>>(
      this,
      "recommendedProducts",
      DefaultRecommendedProductSelection,
      apiIdentifier,
      { ...options, first: 1, last: undefined, before: undefined, after: undefined },
      false
    );
    return list?.[0] ?? null;
  },
  {
    type: "maybeFindFirst",
    operationName: "recommendedProducts",
    modelApiIdentifier: apiIdentifier,
    defaultSelection: DefaultRecommendedProductSelection,
  } as any
);

  
    /**
  * Finds one recommendedProduct by its id. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
  **/
findById: {
  <Options extends FindOneRecommendedProductOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneRecommendedProductOptions>):
    Promise<
      GadgetRecord<
        SelectedRecommendedProductOrDefault<Options>
      >
    >;
  type: "findOne";
  findByVariableName: "id";
  operationName: "recommendedProducts";
  modelApiIdentifier: "recommendedProduct";
  defaultSelection: typeof DefaultRecommendedProductSelection;
  selectionType: AvailableRecommendedProductSelection;
  optionsType: FindOneRecommendedProductOptions;
  schemaType: Query["recommendedProduct"];
} = Object.assign(
  async <Options extends FindOneRecommendedProductOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneRecommendedProductOptions>):
    Promise<
      GadgetRecordImplementation<
        SelectedRecommendedProductOrDefault<Options>
      > & SelectedRecommendedProductOrDefault<Options>
    > =>
  {
    return await findOneByFieldRunner<SelectedRecommendedProductOrDefault<Options>>(
      this,
      "recommendedProducts",
      "id",
      value,
      DefaultRecommendedProductSelection,
      apiIdentifier,
      options
    );
  },
  {
    type: "findOne",
    findByVariableName: "id",
    operationName: "recommendedProducts",
    modelApiIdentifier: apiIdentifier,
    defaultSelection: DefaultRecommendedProductSelection,
  } as any
)

  
    create = Object.assign(createRecommendedProduct,
  {
    type: "action",
    operationName: "createRecommendedProduct",
    namespace: null,
    modelApiIdentifier: apiIdentifier,
    modelSelectionField: apiIdentifier,
    isBulk: false,
    defaultSelection: DefaultRecommendedProductSelection,
    variables: {
      "recommendedProduct": {
        required: false,
        type: "CreateRecommendedProductInput",
      },
    },
    hasAmbiguousIdentifier: false,
    /** @deprecated -- effects are dead, long live AAC */
    hasCreateOrUpdateEffect: true,
    paramOnlyVariables: [],
    hasReturnType: false,
    acceptsModelInput: true,
  } as unknown as {
    type: "action";
    operationName: "createRecommendedProduct";
    namespace: null;
    modelApiIdentifier: "recommendedProduct";
    modelSelectionField: "recommendedProduct";
    isBulk: false;
    defaultSelection: typeof DefaultRecommendedProductSelection;
    selectionType: AvailableRecommendedProductSelection;
    optionsType: CreateRecommendedProductOptions;
    schemaType:  Query["recommendedProduct"];

    variablesType: (

      (
        FullyQualifiedCreateRecommendedProductVariables          | CreateRecommendedProductVariables      )
    ) | undefined;
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
  }
)

  
      /**
  * Executes the bulkCreate action with the given inputs.
  */
  bulkCreate: {
    <Options extends CreateRecommendedProductOptions>(
        inputs: (FullyQualifiedCreateRecommendedProductVariables | CreateRecommendedProductVariables)[],
      options?: LimitToKnownKeys<Options, CreateRecommendedProductOptions>
    ): Promise<CreateRecommendedProductResult<Options>[]>;
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
  } = Object.assign(
    async <Options extends CreateRecommendedProductOptions>(
        inputs: (FullyQualifiedCreateRecommendedProductVariables | CreateRecommendedProductVariables)[],
      options?: LimitToKnownKeys<Options, CreateRecommendedProductOptions>
    ) => {
        const fullyQualifiedInputs = inputs.map(input =>
          disambiguateActionParams(
            this["create"],
            undefined,
            input
          )
        );
      
      return (await actionRunner<any>(
        this,
        "bulkCreateRecommendedProducts",
        DefaultRecommendedProductSelection,
        "recommendedProduct",
        "recommendedProducts",
        true,
          {
            inputs: {
              value: fullyQualifiedInputs,
              ...this["bulkCreate"].variables["inputs"]
            }
          }
,
        options,
        null,
        false
      )) as any[];
    },
    {
      type: "action",
      operationName: "bulkCreateRecommendedProducts",
      namespace: null,
      modelApiIdentifier: apiIdentifier,
      modelSelectionField: "recommendedProducts",
      isBulk: true,
      defaultSelection: DefaultRecommendedProductSelection,
      variables: {
        inputs: {
          required: true,
          type: "[BulkCreateRecommendedProductsInput!]",
        },
      },
      hasReturnType: false,
      acceptsModelInput: true,
    } as any
  );

  
    update = Object.assign(updateRecommendedProduct,
  {
    type: "action",
    operationName: "updateRecommendedProduct",
    namespace: null,
    modelApiIdentifier: apiIdentifier,
    modelSelectionField: apiIdentifier,
    isBulk: false,
    defaultSelection: DefaultRecommendedProductSelection,
    variables: {
      id: {
        required: true,
        type: "GadgetID",
      },
      "recommendedProduct": {
        required: false,
        type: "UpdateRecommendedProductInput",
      },
    },
    hasAmbiguousIdentifier: false,
    /** @deprecated -- effects are dead, long live AAC */
    hasCreateOrUpdateEffect: true,
    paramOnlyVariables: [],
    hasReturnType: false,
    acceptsModelInput: true,
  } as unknown as {
    type: "action";
    operationName: "updateRecommendedProduct";
    namespace: null;
    modelApiIdentifier: "recommendedProduct";
    modelSelectionField: "recommendedProduct";
    isBulk: false;
    defaultSelection: typeof DefaultRecommendedProductSelection;
    selectionType: AvailableRecommendedProductSelection;
    optionsType: UpdateRecommendedProductOptions;
    schemaType:  Query["recommendedProduct"];

    variablesType: (
        { id: string } &

      (
        FullyQualifiedUpdateRecommendedProductVariables          | UpdateRecommendedProductVariables      )
    ) | undefined;
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
  }
)

  
      /**
  * Executes the bulkUpdate action with the given inputs.
  */
  bulkUpdate: {
    <Options extends UpdateRecommendedProductOptions>(
        inputs: (FullyQualifiedUpdateRecommendedProductVariables | UpdateRecommendedProductVariables & { id: string })[],
      options?: LimitToKnownKeys<Options, UpdateRecommendedProductOptions>
    ): Promise<UpdateRecommendedProductResult<Options>[]>;
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
    variablesType: (FullyQualifiedUpdateRecommendedProductVariables | UpdateRecommendedProductVariables & { id: string })[];
    variables: {
        inputs: {
          required: true;
          type: "[BulkUpdateRecommendedProductsInput!]";
        };
      };
    hasReturnType: boolean;
    acceptsModelInput: boolean;
  } = Object.assign(
    async <Options extends UpdateRecommendedProductOptions>(
        inputs: (FullyQualifiedUpdateRecommendedProductVariables | UpdateRecommendedProductVariables & { id: string })[],
      options?: LimitToKnownKeys<Options, UpdateRecommendedProductOptions>
    ) => {
        const fullyQualifiedInputs = inputs.map(input =>
          disambiguateActionParams(
            this["update"],
            undefined,
            input
          )
        );
      
      return (await actionRunner<any>(
        this,
        "bulkUpdateRecommendedProducts",
        DefaultRecommendedProductSelection,
        "recommendedProduct",
        "recommendedProducts",
        true,
          {
            inputs: {
              value: fullyQualifiedInputs,
              ...this["bulkUpdate"].variables["inputs"]
            }
          }
,
        options,
        null,
        false
      )) as any[];
    },
    {
      type: "action",
      operationName: "bulkUpdateRecommendedProducts",
      namespace: null,
      modelApiIdentifier: apiIdentifier,
      modelSelectionField: "recommendedProducts",
      isBulk: true,
      defaultSelection: DefaultRecommendedProductSelection,
      variables: {
        inputs: {
          required: true,
          type: "[BulkUpdateRecommendedProductsInput!]",
        },
      },
      hasReturnType: false,
      acceptsModelInput: true,
    } as any
  );

  
    delete = Object.assign(deleteRecommendedProduct,
  {
    type: "action",
    operationName: "deleteRecommendedProduct",
    namespace: null,
    modelApiIdentifier: apiIdentifier,
    modelSelectionField: apiIdentifier,
    isBulk: false,
    defaultSelection: null,
    variables: {
      id: {
        required: true,
        type: "GadgetID",
      },
    },
    hasAmbiguousIdentifier: false,
    /** @deprecated -- effects are dead, long live AAC */
    hasCreateOrUpdateEffect: false,
    paramOnlyVariables: [],
    hasReturnType: false,
    acceptsModelInput: false,
  } as unknown as {
    type: "action";
    operationName: "deleteRecommendedProduct";
    namespace: null;
    modelApiIdentifier: "recommendedProduct";
    modelSelectionField: "recommendedProduct";
    isBulk: false;
    defaultSelection: null;
    selectionType: Record<string, never>;
    optionsType: DeleteRecommendedProductOptions;
    schemaType:  null ;

    variablesType: (
        { id: string } &

        {}
    ) | undefined;
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
  }
)

  
      /**
  * Executes the bulkDelete action with the given inputs. Deletes the records on the server.
  */
  bulkDelete: {
    <Options extends DeleteRecommendedProductOptions>(
        ids: string[],
      options?: LimitToKnownKeys<Options, DeleteRecommendedProductOptions>
    ): Promise<DeleteRecommendedProductResult<Options>[]>;
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
  } = Object.assign(
    async <Options extends DeleteRecommendedProductOptions>(
        ids: string[],
      options?: LimitToKnownKeys<Options, DeleteRecommendedProductOptions>
    ) => {

      return (await actionRunner<any>(
        this,
        "bulkDeleteRecommendedProducts",
        null,
        "recommendedProduct",
        "recommendedProducts",
        true,
          {
            ids: {
              value: ids,
              ...this["bulkDelete"].variables["ids"]
            }
          }
,
        options,
        null,
        false
      )) as any[];
    },
    {
      type: "action",
      operationName: "bulkDeleteRecommendedProducts",
      namespace: null,
      modelApiIdentifier: apiIdentifier,
      modelSelectionField: "recommendedProducts",
      isBulk: true,
      defaultSelection: null,
      variables: {
        ids: {
          required: true,
          type: "[GadgetID!]",
        },
      },
      hasReturnType: false,
      acceptsModelInput: false,
    } as any
  );

  
}

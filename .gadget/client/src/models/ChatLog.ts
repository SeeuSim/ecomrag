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
      ChatLog,
      ChatLogSort,
      ChatLogFilter,
      AvailableChatLogSelection,
      CreateChatLogInput,
      UpdateChatLogInput,
  
} from "../types.js";

import { disambiguateActionParams } from "../support.js";

export const DefaultChatLogSelection = {
  "__typename": true,
  "createdAt": true,
  "id": true,
  "response": true,
  "updatedAt": true
} as const;

/**
* Produce a type that holds only the selected fields (and nested fields) of "chatLog". The present fields in the result type of this are dynamic based on the options to each call that uses it.
* The selected fields are sometimes given by the `Options` at `Options["select"]`, and if a selection isn't made in the options, we use the default selection from above.
*/
export type SelectedChatLogOrDefault<Options extends Selectable<AvailableChatLogSelection>> = DeepFilterNever<
  Select<
    ChatLog,
    DefaultSelection<
      AvailableChatLogSelection,
      Options,
      typeof DefaultChatLogSelection
    >
  >>;

/** Options that can be passed to the `ChatLogManager#findOne` method */
export interface FindOneChatLogOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableChatLogSelection;
};

/** Options that can be passed to the `ChatLogManager#maybeFindOne` method */
export interface MaybeFindOneChatLogOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableChatLogSelection;
};

/** Options that can be passed to the `ChatLogManager#findMany` method */
export interface FindManyChatLogsOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableChatLogSelection;
  /** Return records sorted by these sorts */
  sort?: ChatLogSort | ChatLogSort[] | null;
  /** Only return records matching these filters. */
  filter?: ChatLogFilter | ChatLogFilter[] | null;
  /** Only return records matching this freeform search string */
  search?: string | null;
  first?: number | null;
  last?: number | null;
  after?: string | null;
  before?: string | null;
};

/** Options that can be passed to the `ChatLogManager#findFirst` method */
export interface FindFirstChatLogOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableChatLogSelection;
  /** Return records sorted by these sorts */
  sort?: ChatLogSort | ChatLogSort[] | null;
  /** Only return records matching these filters. */
  filter?: ChatLogFilter | ChatLogFilter[] | null;
  /** Only return records matching this freeform search string */
  search?: string | null;
};

/** Options that can be passed to the `ChatLogManager#maybeFindFirst` method */
export interface MaybeFindFirstChatLogOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableChatLogSelection;
  /** Return records sorted by these sorts */
  sort?: ChatLogSort | ChatLogSort[] | null;
  /** Only return records matching these filters. */
  filter?: ChatLogFilter | ChatLogFilter[] | null;
  /** Only return records matching this freeform search string */
  search?: string | null;
};


export interface CreateChatLogOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableChatLogSelection;
};


export interface UpdateChatLogOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableChatLogSelection;
};


export interface DeleteChatLogOptions {
};


const apiIdentifier = "chatLog";
const pluralApiIdentifier = "chatLogs";


    
  /**
   * The fully-qualified, expanded form of the inputs for executing this action.
   * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
   **/
  export type FullyQualifiedCreateChatLogVariables = {
          chatLog?: CreateChatLogInput,
      }

  /**
   * The inputs for executing create on chatLog.
   * This is the flattened style of inputs, suitable for general use, and should be preferred.
   **/

    export type CreateChatLogVariables = CreateChatLogInput;



/**
 * The return value from executing create on chatLog.
 * "Is a GadgetRecord of the model's type."
 **/
export type CreateChatLogResult<Options extends CreateChatLogOptions> =
  SelectedChatLogOrDefault<Options> extends void ? void : GadgetRecord<SelectedChatLogOrDefault<Options>>
;


/**
  * Executes the create action. Accepts the parameters for the action via the `variables` argument. Runs the action and returns a Promise for the updated record.
  */

// Flat style overload
async function createChatLog<Options extends CreateChatLogOptions>(
  
    variables: CreateChatLogVariables,

  options?: LimitToKnownKeys<Options, CreateChatLogOptions>
): Promise<CreateChatLogResult<Options>>;

// Fully qualified, nested api identifier overload
async function createChatLog<Options extends CreateChatLogOptions>(
  
      variables: FullyQualifiedCreateChatLogVariables,
  
  options?: LimitToKnownKeys<Options, CreateChatLogOptions>
): Promise<CreateChatLogResult<Options>>;

// Function implementation
async function createChatLog<Options extends CreateChatLogOptions>(
  this: ChatLogManager,
  
      variables: CreateChatLogVariables | FullyQualifiedCreateChatLogVariables,
  
  options?: LimitToKnownKeys<Options, CreateChatLogOptions>
): Promise<CreateChatLogResult<Options>> {
    const newVariables = disambiguateActionParams(
      this["create"],
       undefined,
      variables
    );

  return (await actionRunner<SelectedChatLogOrDefault<Options>>(
    this,
    "createChatLog",
    DefaultChatLogSelection,
    apiIdentifier,
    apiIdentifier,
    false,
    {
                    "chatLog": {
          value: newVariables.chatLog,
          required: false,
          type: "CreateChatLogInput",
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
  export type FullyQualifiedUpdateChatLogVariables = {
          chatLog?: UpdateChatLogInput,
      }

  /**
   * The inputs for executing update on chatLog.
   * This is the flattened style of inputs, suitable for general use, and should be preferred.
   **/

    export type UpdateChatLogVariables = UpdateChatLogInput;



/**
 * The return value from executing update on chatLog.
 * "Is a GadgetRecord of the model's type."
 **/
export type UpdateChatLogResult<Options extends UpdateChatLogOptions> =
  SelectedChatLogOrDefault<Options> extends void ? void : GadgetRecord<SelectedChatLogOrDefault<Options>>
;


/**
  * Executes the update action on one record specified by `id`. Runs the action and returns a Promise for the updated record.
  */

// Flat style overload
async function updateChatLog<Options extends UpdateChatLogOptions>(
  id: string,
    variables: UpdateChatLogVariables,

  options?: LimitToKnownKeys<Options, UpdateChatLogOptions>
): Promise<UpdateChatLogResult<Options>>;

// Fully qualified, nested api identifier overload
async function updateChatLog<Options extends UpdateChatLogOptions>(
  id: string,
      variables: FullyQualifiedUpdateChatLogVariables,
  
  options?: LimitToKnownKeys<Options, UpdateChatLogOptions>
): Promise<UpdateChatLogResult<Options>>;

// Function implementation
async function updateChatLog<Options extends UpdateChatLogOptions>(
  this: ChatLogManager,
  id: string,
      variables: UpdateChatLogVariables | FullyQualifiedUpdateChatLogVariables,
  
  options?: LimitToKnownKeys<Options, UpdateChatLogOptions>
): Promise<UpdateChatLogResult<Options>> {
    const newVariables = disambiguateActionParams(
      this["update"],
       id,
      variables
    );

  return (await actionRunner<SelectedChatLogOrDefault<Options>>(
    this,
    "updateChatLog",
    DefaultChatLogSelection,
    apiIdentifier,
    apiIdentifier,
    false,
    {
              id: {
          value: id,
          required: true,
          type: "GadgetID",
        },
                    "chatLog": {
          value: newVariables.chatLog,
          required: false,
          type: "UpdateChatLogInput",
        },
          },
    options,
    null,
    false
  ));
}

  
    

/**
 * The return value from executing delete on chatLog.
 * "Is void because this action deletes the record"
 **/
export type DeleteChatLogResult<Options extends DeleteChatLogOptions> =
  void extends void ? void : GadgetRecord<SelectedChatLogOrDefault<Options>>
;


/**
  * Executes the delete action on one record specified by `id`. Deletes the record on the server. Returns a Promise that resolves if the delete succeeds.
  */

// Fully qualified, nested api identifier overload
async function deleteChatLog<Options extends DeleteChatLogOptions>(
  id: string,
  
  options?: LimitToKnownKeys<Options, DeleteChatLogOptions>
): Promise<DeleteChatLogResult<Options>>;

// Function implementation
async function deleteChatLog<Options extends DeleteChatLogOptions>(
  this: ChatLogManager,
  id: string,
  
  options?: LimitToKnownKeys<Options, DeleteChatLogOptions>
): Promise<DeleteChatLogResult<Options>> {

  return (await actionRunner<void>(
    this,
    "deleteChatLog",
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

  



/** All the actions available at the collection level and record level for "chatLog" */
export class ChatLogManager {
  constructor(readonly connection: GadgetConnection) {}

  
    /**
 * Finds one chatLog by ID. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
 **/
findOne: {
  <Options extends FindOneChatLogOptions>(id: string, options?: LimitToKnownKeys<Options, FindOneChatLogOptions>):
    Promise<
      GadgetRecord<
        SelectedChatLogOrDefault<Options>
      >
    >;
  type: "findOne",
  findByVariableName: "id";
  operationName: "chatLog";
  modelApiIdentifier: "chatLog";
  defaultSelection: typeof DefaultChatLogSelection;
  selectionType: AvailableChatLogSelection;
  optionsType: FindOneChatLogOptions;
  schemaType: Query["chatLog"];
} = Object.assign(
  async <Options extends FindOneChatLogOptions>(id: string, options?: LimitToKnownKeys<Options, FindOneChatLogOptions>) => {
    return await findOneRunner<SelectedChatLogOrDefault<Options>>(
      this,
      "chatLog",
      id,
      DefaultChatLogSelection,
      apiIdentifier,
      options
    );
  },
  {
    type: "findOne",
    findByVariableName: "id",
    operationName: "chatLog",
    modelApiIdentifier: apiIdentifier,
    defaultSelection: DefaultChatLogSelection,
  } as any
)

  
    /**
 * Finds one chatLog by ID. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
 **/
maybeFindOne: {
  <Options extends MaybeFindOneChatLogOptions>(id: string, options?: LimitToKnownKeys<Options, MaybeFindOneChatLogOptions>):
    Promise<
      GadgetRecord<
        SelectedChatLogOrDefault<Options>
      > | null
    >;
  type: "maybeFindOne";
  findByVariableName: "id";
  operationName: "chatLog";
  modelApiIdentifier: "chatLog";
  defaultSelection: typeof DefaultChatLogSelection;
  selectionType: AvailableChatLogSelection;
  optionsType: MaybeFindOneChatLogOptions;
  schemaType: Query["chatLog"];
} = Object.assign(
  async <Options extends MaybeFindOneChatLogOptions>(id: string, options?: LimitToKnownKeys<Options, MaybeFindOneChatLogOptions>) => {
    const record = await findOneRunner<SelectedChatLogOrDefault<Options>>(
      this,
      "chatLog",
      id,
      DefaultChatLogSelection,
      apiIdentifier,
      options,
      false
    );
    return record.isEmpty() ? null : record;
  },
  {
    type: "maybeFindOne",
    findByVariableName: "id",
    operationName: "chatLog",
    modelApiIdentifier: "chatLog",
    defaultSelection: DefaultChatLogSelection,
  } as any
)

  
    /**
 * Finds many chatLog. Returns a `Promise` for a `GadgetRecordList` of objects according to the passed `options`. Optionally filters the returned records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
 **/
findMany: {
  <Options extends FindManyChatLogsOptions>(options?: LimitToKnownKeys<Options, FindManyChatLogsOptions>):
    Promise<
      GadgetRecordList<
        SelectedChatLogOrDefault<Options>
      >
    >;
  type: "findMany";
  operationName: "chatLogs";
  modelApiIdentifier: "chatLog";
  defaultSelection: typeof DefaultChatLogSelection;
  selectionType: AvailableChatLogSelection;
  optionsType: FindManyChatLogsOptions;
  schemaType: Query["chatLog"];
} = Object.assign(
  async <Options extends FindManyChatLogsOptions>(options?: LimitToKnownKeys<Options, FindManyChatLogsOptions>):
    Promise<
      GadgetRecordList<
        SelectedChatLogOrDefault<Options>
      >
    > =>
  {
    return await findManyRunner<SelectedChatLogOrDefault<Options>>(
      this,
      "chatLogs",
      DefaultChatLogSelection,
      "chatLog",
      options
    );
  },
  {
    type: "findMany",
    operationName: "chatLogs",
    modelApiIdentifier: apiIdentifier,
    defaultSelection: DefaultChatLogSelection,
  } as any
);

  
    /**
 * Finds the first matching chatLog. Returns a `Promise` that resolves to a record if found and rejects the promise if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
 **/
findFirst: {
  <Options extends FindFirstChatLogOptions>(options?: LimitToKnownKeys<Options, FindFirstChatLogOptions>):
    Promise<
      GadgetRecord<
        SelectedChatLogOrDefault<Options>
      >
    >;
  type: "findFirst";
  operationName: "chatLogs";
  modelApiIdentifier: "chatLog";
  defaultSelection: typeof DefaultChatLogSelection;
  selectionType: AvailableChatLogSelection;
  optionsType: FindFirstChatLogOptions;
  schemaType: Query["chatLog"];
} = Object.assign(
  async <Options extends FindFirstChatLogOptions>(options?: LimitToKnownKeys<Options, FindFirstChatLogOptions>):
    Promise<
      GadgetRecord<
        SelectedChatLogOrDefault<Options>
      >
    > =>
  {
    const list = await findManyRunner<SelectedChatLogOrDefault<Options>>(
      this,
      "chatLogs",
      DefaultChatLogSelection,
      apiIdentifier,
      { ...options, first: 1, last: undefined, before: undefined, after: undefined },
      true
    );
    return list[0];
  },
  {
    type: "findFirst",
    operationName: "chatLogs",
    modelApiIdentifier: apiIdentifier,
    defaultSelection: DefaultChatLogSelection,
  } as any
);

  
    /**
 * Finds the first matching chatLog. Returns a `Promise` that resolves to a record if found, or null if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` pagination options.
 **/
maybeFindFirst: {
  <Options extends MaybeFindFirstChatLogOptions>(options?: LimitToKnownKeys<Options, MaybeFindFirstChatLogOptions>):
    Promise<
      GadgetRecord<
        SelectedChatLogOrDefault<Options>
      > | null
    >;
  type: "maybeFindFirst";
  operationName: "chatLogs";
  modelApiIdentifier: "chatLog";
  defaultSelection: typeof DefaultChatLogSelection;
  selectionType: AvailableChatLogSelection;
  optionsType: MaybeFindFirstChatLogOptions;
  schemaType: Query["chatLog"];
} = Object.assign(
  async <Options extends MaybeFindFirstChatLogOptions>(options?: LimitToKnownKeys<Options, MaybeFindFirstChatLogOptions>):
    Promise<
      GadgetRecord<
        SelectedChatLogOrDefault<Options>
      > | null
    > =>
  {
    const list = await findManyRunner<SelectedChatLogOrDefault<Options>>(
      this,
      "chatLogs",
      DefaultChatLogSelection,
      apiIdentifier,
      { ...options, first: 1, last: undefined, before: undefined, after: undefined },
      false
    );
    return list?.[0] ?? null;
  },
  {
    type: "maybeFindFirst",
    operationName: "chatLogs",
    modelApiIdentifier: apiIdentifier,
    defaultSelection: DefaultChatLogSelection,
  } as any
);

  
    /**
  * Finds one chatLog by its id. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
  **/
findById: {
  <Options extends FindOneChatLogOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneChatLogOptions>):
    Promise<
      GadgetRecord<
        SelectedChatLogOrDefault<Options>
      >
    >;
  type: "findOne";
  findByVariableName: "id";
  operationName: "chatLogs";
  modelApiIdentifier: "chatLog";
  defaultSelection: typeof DefaultChatLogSelection;
  selectionType: AvailableChatLogSelection;
  optionsType: FindOneChatLogOptions;
  schemaType: Query["chatLog"];
} = Object.assign(
  async <Options extends FindOneChatLogOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneChatLogOptions>):
    Promise<
      GadgetRecordImplementation<
        SelectedChatLogOrDefault<Options>
      > & SelectedChatLogOrDefault<Options>
    > =>
  {
    return await findOneByFieldRunner<SelectedChatLogOrDefault<Options>>(
      this,
      "chatLogs",
      "id",
      value,
      DefaultChatLogSelection,
      apiIdentifier,
      options
    );
  },
  {
    type: "findOne",
    findByVariableName: "id",
    operationName: "chatLogs",
    modelApiIdentifier: apiIdentifier,
    defaultSelection: DefaultChatLogSelection,
  } as any
)

  
    create = Object.assign(createChatLog,
  {
    type: "action",
    operationName: "createChatLog",
    namespace: null,
    modelApiIdentifier: apiIdentifier,
    modelSelectionField: apiIdentifier,
    isBulk: false,
    defaultSelection: DefaultChatLogSelection,
    variables: {
      "chatLog": {
        required: false,
        type: "CreateChatLogInput",
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
    operationName: "createChatLog";
    namespace: null;
    modelApiIdentifier: "chatLog";
    modelSelectionField: "chatLog";
    isBulk: false;
    defaultSelection: typeof DefaultChatLogSelection;
    selectionType: AvailableChatLogSelection;
    optionsType: CreateChatLogOptions;
    schemaType:  Query["chatLog"];

    variablesType: (

      (
        FullyQualifiedCreateChatLogVariables          | CreateChatLogVariables      )
    ) | undefined;
    variables: {
                    "chatLog": {
          required: false;
          type: "CreateChatLogInput";
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
    <Options extends CreateChatLogOptions>(
        inputs: (FullyQualifiedCreateChatLogVariables | CreateChatLogVariables)[],
      options?: LimitToKnownKeys<Options, CreateChatLogOptions>
    ): Promise<CreateChatLogResult<Options>[]>;
    type: "action";
    operationName: "bulkCreateChatLogs";
    namespace: null;
    modelApiIdentifier: "chatLog";
    modelSelectionField: "chatLogs";
    isBulk: true;
    defaultSelection: typeof DefaultChatLogSelection;
    selectionType: AvailableChatLogSelection;
    optionsType: CreateChatLogOptions;
    schemaType: Query["chatLog"];
    variablesType: (FullyQualifiedCreateChatLogVariables | CreateChatLogVariables)[];
    variables: {
        inputs: {
          required: true;
          type: "[BulkCreateChatLogsInput!]";
        };
      };
    hasReturnType: boolean;
    acceptsModelInput: boolean;
  } = Object.assign(
    async <Options extends CreateChatLogOptions>(
        inputs: (FullyQualifiedCreateChatLogVariables | CreateChatLogVariables)[],
      options?: LimitToKnownKeys<Options, CreateChatLogOptions>
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
        "bulkCreateChatLogs",
        DefaultChatLogSelection,
        "chatLog",
        "chatLogs",
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
      operationName: "bulkCreateChatLogs",
      namespace: null,
      modelApiIdentifier: apiIdentifier,
      modelSelectionField: "chatLogs",
      isBulk: true,
      defaultSelection: DefaultChatLogSelection,
      variables: {
        inputs: {
          required: true,
          type: "[BulkCreateChatLogsInput!]",
        },
      },
      hasReturnType: false,
      acceptsModelInput: true,
    } as any
  );

  
    update = Object.assign(updateChatLog,
  {
    type: "action",
    operationName: "updateChatLog",
    namespace: null,
    modelApiIdentifier: apiIdentifier,
    modelSelectionField: apiIdentifier,
    isBulk: false,
    defaultSelection: DefaultChatLogSelection,
    variables: {
      id: {
        required: true,
        type: "GadgetID",
      },
      "chatLog": {
        required: false,
        type: "UpdateChatLogInput",
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
    operationName: "updateChatLog";
    namespace: null;
    modelApiIdentifier: "chatLog";
    modelSelectionField: "chatLog";
    isBulk: false;
    defaultSelection: typeof DefaultChatLogSelection;
    selectionType: AvailableChatLogSelection;
    optionsType: UpdateChatLogOptions;
    schemaType:  Query["chatLog"];

    variablesType: (
        { id: string } &

      (
        FullyQualifiedUpdateChatLogVariables          | UpdateChatLogVariables      )
    ) | undefined;
    variables: {
              id: {
          required: true;
          type: "GadgetID";
        };
                    "chatLog": {
          required: false;
          type: "UpdateChatLogInput";
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
    <Options extends UpdateChatLogOptions>(
        inputs: (FullyQualifiedUpdateChatLogVariables | UpdateChatLogVariables & { id: string })[],
      options?: LimitToKnownKeys<Options, UpdateChatLogOptions>
    ): Promise<UpdateChatLogResult<Options>[]>;
    type: "action";
    operationName: "bulkUpdateChatLogs";
    namespace: null;
    modelApiIdentifier: "chatLog";
    modelSelectionField: "chatLogs";
    isBulk: true;
    defaultSelection: typeof DefaultChatLogSelection;
    selectionType: AvailableChatLogSelection;
    optionsType: UpdateChatLogOptions;
    schemaType: Query["chatLog"];
    variablesType: (FullyQualifiedUpdateChatLogVariables | UpdateChatLogVariables & { id: string })[];
    variables: {
        inputs: {
          required: true;
          type: "[BulkUpdateChatLogsInput!]";
        };
      };
    hasReturnType: boolean;
    acceptsModelInput: boolean;
  } = Object.assign(
    async <Options extends UpdateChatLogOptions>(
        inputs: (FullyQualifiedUpdateChatLogVariables | UpdateChatLogVariables & { id: string })[],
      options?: LimitToKnownKeys<Options, UpdateChatLogOptions>
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
        "bulkUpdateChatLogs",
        DefaultChatLogSelection,
        "chatLog",
        "chatLogs",
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
      operationName: "bulkUpdateChatLogs",
      namespace: null,
      modelApiIdentifier: apiIdentifier,
      modelSelectionField: "chatLogs",
      isBulk: true,
      defaultSelection: DefaultChatLogSelection,
      variables: {
        inputs: {
          required: true,
          type: "[BulkUpdateChatLogsInput!]",
        },
      },
      hasReturnType: false,
      acceptsModelInput: true,
    } as any
  );

  
    delete = Object.assign(deleteChatLog,
  {
    type: "action",
    operationName: "deleteChatLog",
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
    operationName: "deleteChatLog";
    namespace: null;
    modelApiIdentifier: "chatLog";
    modelSelectionField: "chatLog";
    isBulk: false;
    defaultSelection: null;
    selectionType: Record<string, never>;
    optionsType: DeleteChatLogOptions;
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
    <Options extends DeleteChatLogOptions>(
        ids: string[],
      options?: LimitToKnownKeys<Options, DeleteChatLogOptions>
    ): Promise<DeleteChatLogResult<Options>[]>;
    type: "action";
    operationName: "bulkDeleteChatLogs";
    namespace: null;
    modelApiIdentifier: "chatLog";
    modelSelectionField: "chatLogs";
    isBulk: true;
    defaultSelection: null;
    selectionType: Record<string, never>;
    optionsType: DeleteChatLogOptions;
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
    async <Options extends DeleteChatLogOptions>(
        ids: string[],
      options?: LimitToKnownKeys<Options, DeleteChatLogOptions>
    ) => {

      return (await actionRunner<any>(
        this,
        "bulkDeleteChatLogs",
        null,
        "chatLog",
        "chatLogs",
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
      operationName: "bulkDeleteChatLogs",
      namespace: null,
      modelApiIdentifier: apiIdentifier,
      modelSelectionField: "chatLogs",
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

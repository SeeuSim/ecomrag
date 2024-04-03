const { NODE_ENV } = process.env;

/**@type {(record: { id: string, model: string, source?: string, description?: string}) => {}} */
export const getMessagePayload = (record) => {
  return {
    Id: {
      DataType: 'String',
      StringValue: `${record.id}`,
    },
    Model: {
      DataType: 'String',
      StringValue: record.model,
    },
    ...(record.source
      ? { Source: { DataType: 'String', StringValue: `${record.source}` } }
      : {
          Description: {
            DataType: 'String',
            StringValue: `${record.description}`,
          },
      }),
    Environment: {
      DataType: 'String',
      StringValue: `${NODE_ENV}`
    }
  };
};

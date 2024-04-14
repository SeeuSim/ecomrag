import { useQuery } from '@gadgetinc/react';

const gadgetMetaQuery = `
  query {
    gadgetMeta {
      slug
      editURL
    }
  }
`;

export const useGadgetMeta = () => {
  const [{ data: metaData, fetching: fetchingGadgetMeta }] = useQuery({
    query: gadgetMetaQuery,
  });

  return {
    metaData,
    fetchingGadgetMeta,
  };
};

import { useFindFirst, useQuery } from '@gadgetinc/react';
import { Link } from 'react-router-dom';

import {
  Card,
  Banner,
  FooterHelp,
  InlineStack,
  Icon,
  Layout,
  Page,
  Spinner,
  Text,
  BlockStack,
} from '@shopify/polaris';
import { StoreMajor } from '@shopify/polaris-icons';
import { api } from './api';

const gadgetMetaQuery = `
  query {
    gadgetMeta {
      slug
      editURL
    }
  }
`;

const ShopPage = () => {
  const [{ data, fetching, error }] = useFindFirst(api.shopifyShop);

  const [{ data: metaData, fetching: fetchingGadgetMeta }] = useQuery({
    query: gadgetMetaQuery,
  });

  if (error) {
    return (
      <Page title='Error'>
        <Text variant='bodyMd' as='p'>
          Error: {error.toString()}
        </Text>
      </Page>
    );
  }

  if (fetching || fetchingGadgetMeta) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <Spinner accessibilityLabel='Spinner example' size='large' />
      </div>
    );
  }

  return (
    <Page title='App'>
      <Layout>
        <Layout.Section>
          <Banner
            title={`${metaData.gadgetMeta.slug} is successfully connected to askshop.ai`}
            tone='success'
          />
        </Layout.Section>
        <Layout.Section>
          <Link to={'/settings'}>Go to settings page</Link>
        </Layout.Section>
        <Layout.Section>
          <Link to={'/pricing'}>Go to pricing page</Link>
        </Layout.Section>
        <Layout.Section>
          <Link to={'/privacy'}>Go to privacy page</Link>
        </Layout.Section>
        {/* <Layout.Section>
          <FooterHelp>
            <p>Build by James Liu.</p>
          </FooterHelp>
        </Layout.Section> */}
      </Layout>
    </Page>
  );
};

export default ShopPage;

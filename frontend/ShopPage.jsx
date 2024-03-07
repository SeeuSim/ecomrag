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
            title={`${metaData.gadgetMeta.slug} is successfully connected to Shopifysss`}
            tone='success'
          />
        </Layout.Section>
        <Layout.Section>
          <Link to={'/settings'}>Go to settings page</Link>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <div style={{ width: '100%' }}>
              <img
                src='https://assets.gadget.dev/assets/icon.svg'
                style={{
                  margin: '14px auto',
                  height: '56px',
                }}
              />
            </div>
            <BlockStack gap='200'>
              <Text variant='headingLg' as='h1' alignment='center'>
                This page is powered by{' '}
                <Link url={`${metaData.gadgetMeta.editURL}/files/frontend/ShopPage.jsx`} external>
                  <code
                    style={{
                      fontFamily:
                        'SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace',
                      fontSize: '0.95em',
                    }}
                  >
                    ShopPage.jsx
                  </code>
                </Link>
              </Text>
              <Text variant='bodyMd' as='p' alignment='center'>
                Start building your UI by editing file hosted on Gadget.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap='400'>
              <Text variant='headingMd' as='h6'>
                Example Shop Query from your Gadget Database
              </Text>
              <div
                style={{
                  border: '1px solid #e1e3e5',
                  padding: '12px',
                  borderRadius: '0.25rem',
                }}
              >
                <InlineStack align='space-between' blockAlign='center'>
                  <InlineStack gap='400' blockAlign='center'>
                    <Icon source={StoreMajor} tone='emphasis' />
                    <div>
                      <Text variant='headingMd' as='h6'>
                        {data.name}
                      </Text>
                      <Text variant='bodyMd' as='p'>
                        {data.city}, {data.countryName}
                      </Text>
                    </div>
                  </InlineStack>
                  <Text variant='bodyMd' as='p'>
                    Created at:{' '}
                    {data.shopifyCreatedAt.toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </InlineStack>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <FooterHelp>
            <p>Build by James Liu.</p>
          </FooterHelp>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ShopPage;

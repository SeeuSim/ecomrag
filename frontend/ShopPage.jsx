import { useFindFirst, useQuery } from '@gadgetinc/react';
import { Link } from 'react-router-dom';

import { Banner, BlockStack, Box, Card, Layout, Page, Spinner, Text } from '@shopify/polaris';
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
  const [
    {
      // data: _data,
      fetching,
      error,
    },
  ] = useFindFirst(api.shopifyShop);

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
          <Card roundedAbove='sm' padding={500}>
            <Text as='h1' variant='headingLg'>
              AskShop.AI
            </Text>
            <Box paddingBlock='400'>
              <BlockStack gap='200'>
                <Text as='h3' variant='headingMd' fontWeight='medium'>
                  <Link to={'/settings'}>Settings</Link>
                </Text>
                <Text as='p' variant='bodyLg'>
                  Tune your chatbot settings, such as its name, introduction message, personality
                  and talkativeness.
                </Text>
              </BlockStack>
            </Box>
            <Box paddingBlockStart='400'>
              <BlockStack gap='200'>
                <Text as='h3' variant='headingMd' fontWeight='medium'>
                  <Link to={'/pricing'}>Pricing</Link>
                </Text>
                <Text as='p' variant='bodyLg'>
                  Change your subscription plan to fit your shop's needs.
                </Text>
              </BlockStack>
            </Box>
            <Box paddingBlockStart='400'>
              <BlockStack gap='200'>
                <Text as='h3' variant='headingMd' fontWeight='medium'>
                  <Link to={'/privacy'}>Privacy</Link>
                </Text>
                <Text as='p' variant='bodyLg'>
                  Review the App's Privacy Policy
                </Text>
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ShopPage;

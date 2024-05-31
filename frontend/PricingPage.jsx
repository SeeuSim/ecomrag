// This example is for guidance purposes. Copying it will come with caveats.

import { BlockStack, Box, Card, InlineGrid, Page, Text, Button } from '@shopify/polaris';
import { useNavigate as useShopifyNavigate } from '@shopify/app-bridge-react';
import { useAction, useFindFirst } from '@gadgetinc/react';

import { useNavigate as useReactRouterNavigate } from 'react-router-dom';
import { useCallback } from 'react';

import { api } from './api';

const PricingPage = () => {
  const reactRouterNavigate = useReactRouterNavigate();
  const shopifyNavigate = useShopifyNavigate();
  const [
    {
      fetching,
      // error: _error,
      // data: _data
    },
    createSubscription,
  ] = useAction(api.shopifyShop.subscribe);
  const [{ data: shop }] = useFindFirst(api.shopifyShop);
  const shopPlan = shop?.Plan;

  const subscribe = useCallback(async (plan) => {
    // create the resource in the backend
    const currShop = await createSubscription({
      address1: 'example value for address1',
      customerAccountsV2: {
        example: true,
        key: 'value',
      },
      id: shop?.id,
      plan: plan,
    });
    console.log(currShop, 'curr shop1');
    console.log(currShop?.data?.confirmationUrl, 'curr shop');

    // redirect the merchant to accept the charge within Shopify's interface
    shopifyNavigate(currShop?.data?.confirmationUrl);
  });

  return (
    <Page
      divider
      backAction={{
        content: 'Home',
        onAction: () => reactRouterNavigate('/'),
      }}
      primaryAction={{ content: 'View on your store', disabled: true }}
      secondaryActions={[
        {
          content: 'Duplicate',
          accessibilityLabel: 'Secondary action label',
          // onAction: () => alert('Duplicate action'),
        },
      ]}
    >
      <BlockStack gap={{ xs: '800', sm: '400' }}>
        <InlineGrid columns={{ xs: '1fr', md: '2fr 5fr' }} gap='400'>
          <Box
            as='section'
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap='400'>
              <Text as='h3' variant='headingMd'>
                Pricing Plan
              </Text>
              <Text as='p' variant='bodyMd'>
                Upgrade your plan here!
              </Text>
            </BlockStack>
          </Box>

          <InlineGrid gap='400' columns={3}>
            {' '}
            <Card roundedAbove='sm'>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '500px',
                  width: '100%',
                }}
              >
                <Box as='section' padding={400}>
                  <Text variant='headingXl' as='h6' alignment='center'>
                    Free Plan
                  </Text>
                </Box>

                <Box as='section' padding={200}>
                  <Text variant='headingMd' as='h6' alignment='center'>
                    Perfect for trialing features
                  </Text>
                </Box>

                <Box as='section' padding={200}>
                  <Text variant='headingLg' as='h4' alignment='center'>
                    $0.00/month
                  </Text>
                </Box>

                <Box as='section' padding={200}>
                  <Text variant='headingMd' as='h4' alignment='center'>
                    Up to 100 Product Sync Limit
                  </Text>
                </Box>
                <Box as='section' padding={200}>
                  <Text variant='headingMd' as='h4' alignment='center'>
                    Up to 100 Image Upload Limit
                  </Text>
                </Box>

                <Box as='section' padding={200}>
                  <Text variant='headingMd' as='h4' alignment='center'>
                    No chatbot image upload
                  </Text>
                </Box>

                <Box as='section' padding={200}>
                  <Text variant='headingMd' as='h4' alignment='center'>
                    Customise Chatbot Name, logo and welcome message
                  </Text>
                </Box>
                <Box as='section' padding={100} width='80%'>
                  <Button
                    fullWidth
                    variant='primary'
                    onClick={() => {
                      subscribe('free');
                    }}
                    disabled={fetching || shopPlan == 'free'}
                  >
                    Subscribe
                  </Button>
                </Box>
              </div>
            </Card>
            <Card roundedAbove='sm'>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '500px',
                  width: '100%',
                }}
              >
                <Box as='section' padding={400}>
                  <Text variant='headingXl' as='h6' alignment='center'>
                    Growth Plan
                  </Text>
                </Box>

                <Box as='section' padding={200} minHeight='50px'>
                  <Text variant='headingMd' as='h6' alignment='center'>
                    Perfect for small businesses
                  </Text>
                </Box>

                <Box as='section' padding={200}>
                  <Text variant='headingLg' as='h4' alignment='center'>
                    $9.99/month
                  </Text>
                </Box>

                <Box as='section' padding={200}>
                  <Text variant='headingMd' as='h4' alignment='center'>
                    Up to 1000 Product Sync Limit
                  </Text>
                </Box>
                <Box as='section' padding={200}>
                  <Text variant='headingMd' as='h4' alignment='center'>
                    Up to 1000 Image Upload Limit, 2 images per product
                  </Text>
                </Box>

                <Box as='section' padding={200}>
                  <Text variant='headingMd' as='h4' alignment='center'>
                    Chatbot image upload
                  </Text>
                </Box>

                <Box as='section' padding={200}>
                  <Text variant='headingMd' as='h4' alignment='center'>
                    Free Tier + settings and personality
                  </Text>
                </Box>
                <Box as='section' padding={100} width='80%'>
                  <Button
                    fullWidth
                    variant='primary'
                    onClick={() => {
                      subscribe('growth');
                    }}
                    disabled={fetching || shopPlan == 'growth'}
                  >
                    Subscribe
                  </Button>
                </Box>
              </div>
            </Card>
            <Card roundedAbove='sm'>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '500px',
                  width: '100%',
                }}
              >
                <Box as='section' padding={400}>
                  <Text variant='headingXl' as='h6' alignment='center'>
                    Premium Plan
                  </Text>
                </Box>

                <Box as='section' padding={200}>
                  <Text variant='headingMd' as='h6' alignment='center'>
                    Perfect for growing businesses
                  </Text>
                </Box>

                <Box as='section' padding={200}>
                  <Text variant='headingLg' as='h4' alignment='center'>
                    $29.99/month
                  </Text>
                </Box>

                <Box as='section' padding={200}>
                  <Text variant='headingMd' as='h4' alignment='center'>
                    Up to 2000 Product Sync Limit
                  </Text>
                </Box>
                <Box as='section' padding={200}>
                  <Text variant='headingMd' as='h4' alignment='center'>
                    Up to 4000 Image Upload Limit, 2 images per product
                  </Text>
                </Box>

                <Box as='section' padding={200}>
                  <Text variant='headingMd' as='h4' alignment='center'>
                    Chatbot image upload
                  </Text>
                </Box>

                <Box as='section' padding={200}>
                  <Text variant='headingMd' as='h4' alignment='center'>
                    Free Tier + settings and personality
                  </Text>
                </Box>
                <Box as='section' padding={100} width='80%'>
                  <Button
                    fullWidth
                    variant='primary'
                    onClick={() => {
                      subscribe('premium');
                    }}
                    disabled={fetching || shopPlan == 'premium'}
                  >
                    Subscribe
                  </Button>
                </Box>
              </div>
            </Card>
          </InlineGrid>
        </InlineGrid>

        {/* {smUp ? <Divider /> : null} */}
        {/* <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
			  <Box
				as="section"
				paddingInlineStart={{ xs: 400, sm: 0 }}
				paddingInlineEnd={{ xs: 400, sm: 0 }}
			  >
				<BlockStack gap="400">
				  <Text as="h3" variant="headingMd">
					Dimensions
				  </Text>
				  <Text as="p" variant="bodyMd">
					Interjambs are the rounded protruding bits of your puzzlie piece
				  </Text>
				</BlockStack>
			  </Box>
			  <Card roundedAbove="sm">
				<BlockStack gap="400">
				  <TextField label="Horizontal" />
				  <TextField label="Interjamb ratio" />
				</BlockStack>
			  </Card>
			</InlineGrid> */}
      </BlockStack>
    </Page>
  );
};

export default PricingPage;

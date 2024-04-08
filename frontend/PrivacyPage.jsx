// This example is for guidance purposes. Copying it will come with caveats.

import { BlockStack, Box, InlineGrid, Page, Text } from '@shopify/polaris';

const PricingPage = () => {
  return (
    <Page
      // backAction={{ url: '/' }}
      backAction={{ url: '/api/shopify/install-or-render' }}
      divider
    >
      <BlockStack gap={{ xs: '800', sm: '400' }}>
        <InlineGrid columns={1} gap='400'>
          <Text variant='headingXl' as='h4' alignment='left'>
            Privacy Policy
          </Text>
          <Text variant='headingMd' as='h4' alignment='left'>
            At AskShop.ai, we are committed to protecting the privacy and security of the personal
            information of our app users and their customers. This Privacy Policy describes how we
            collect, use, disclose and protect this information.
          </Text>
          <Box>
            <Text variant='headingLg' as='h4' alignment='left'>
              Information we collect
            </Text>
            <ul>
              <li>
                <Text variant='headingSm' as='h4' alignment='left'>
                  Personal information you provide when installing or using the app, such as your
                  name, email address, and Shopify account details.
                </Text>
              </li>
              <li>
                <Text variant='headingSm' as='h4' alignment='left'>
                  Information about your use of the app and interactions with it.
                </Text>
              </li>
              <li>
                <Text variant='headingSm' as='h4' alignment='left'>
                  Information we collect from your Shopify store via the Shopify API, such as
                  products, orders, and customers, in order to provide app functionality.
                </Text>
              </li>
              <li>
                <Text variant='headingSm' as='h4' alignment='left'>
                  Cookies and similar tracking technologies.
                </Text>
              </li>
            </ul>
          </Box>
          <Box>
            <Text variant='headingLg' as='h4' alignment='left'>
              How we use the information we collect
            </Text>
            <ul>
              <li>
                <Text variant='headingSm' as='h4' alignment='left'>
                  To provide, maintain and improve the app's features and services
                </Text>
              </li>
              <li>
                <Text variant='headingSm' as='h4' alignment='left'>
                  To personalize the app experience
                </Text>
              </li>
              <li>
                <Text variant='headingSm' as='h4' alignment='left'>
                  To communicate with you about the app, such as updates or support
                </Text>
              </li>
              <li>
                <Text variant='headingSm' as='h4' alignment='left'>
                  To better understand how the app is used and optimize its performance
                </Text>
              </li>
              <li>
                <Text variant='headingSm' as='h4' alignment='left'>
                  To protect against, investigate and deter fraudulent, unauthorized or illegal
                  activity
                </Text>
              </li>
            </ul>
          </Box>
          <Box>
            <Text variant='headingLg' as='h4' alignment='left'>
              Data Security
            </Text>
            <Text variant='headingSm' as='h4' alignment='left'>
              We use appropriate technical and organizational measures to protect your information
              from unauthorized access, alteration, disclosure or destruction. However, no method of
              transmission over the Internet or electronic storage is 100% secure.
            </Text>
          </Box>
          <Box>
            <Text variant='headingLg' as='h4' alignment='left'>
              Your Rights
            </Text>
            <Text variant='headingSm' as='h4' alignment='left'>
              You may have certain rights regarding your personal information, such as accessing it,
              updating it, restricting its use, deleting it, or lodging a complaint with a data
              protection authority. Please contact us to exercise these rights.
            </Text>
          </Box>
          <Box>
            <Text variant='headingLg' as='h4' alignment='left'>
              Changes to This Policy
            </Text>
            <Text variant='headingSm' as='h4' alignment='left'>
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new policy on this page. Please check back periodically.
            </Text>
          </Box>

          <Box>
            <Text variant='headingLg' as='h4' alignment='left'>
              Contact Us
            </Text>
            <Text variant='headingSm' as='h4' alignment='left'>
              If you have questions about this Privacy Policy, please contact us at
              support@askshop.ai.com
            </Text>
          </Box>
          <Box>
            <Text variant='headingMd' as='h4' alignment='left'>
              By using AskShop.ai and its services, you agree to the collection and use of
              information in accordance with this policy.
            </Text>
          </Box>
          <Box minHeight='100px' />
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

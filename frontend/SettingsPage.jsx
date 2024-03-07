// This example is for guidance purposes. Copying it will come with caveats.

import { BlockStack, Box, Card, InlineGrid, Page, Text, TextField, Button } from '@shopify/polaris';
import { useAction, useFindOne } from '@gadgetinc/react';
import { useState, useCallback, useEffect } from 'react';
import { api } from './api';

const SettingsPage = () => {
  const [{ data }] = useFindOne(api.ChatbotSettings, '1');

  const [name, setName] = useState('');
  const [introductionMessage, setIntroductionMessage] = useState('');

  useEffect(() => {
    if (data) {
      setIntroductionMessage(data?.introductionMessage || '');
      setName(data?.name || '');
    }
  }, [data]);

  const handleNameChange = useCallback((newValue) => setName(newValue), []);
  const handleIntroductionMessageChange = useCallback(
    (newValue) => setIntroductionMessage(newValue),
    []
  );

  const [{ loading, error }, updateChatbotSettings] = useAction(api.ChatbotSettings.update);

  const handleSave = async () => {
    try {
      console.log('hi');
      console.log(data.id);
      const newTask = await updateChatbotSettings({
        id: data.id,
        name: name,
        introductionMessage: introductionMessage,
      });
      console.log(newTask);
      // Handle success (e.g., clear form, show message, etc.)
    } catch (err) {
      // Handle error (e.g., show error message)
      console.log('error', err);
    }
  };

  return (
    <Page
      divider
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
                Chatbot
              </Text>
              <Text as='p' variant='bodyMd'>
                Customise your chatbot to match your brand
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <TextField label='Name' value={name} onChange={handleNameChange} autoComplete='off' />
              <TextField
                label='Introductory message'
                value={introductionMessage}
                onChange={handleIntroductionMessageChange}
                autoComplete='off'
              />
            </BlockStack>
          </Card>
        </InlineGrid>
        <Button onClick={handleSave} disabled={loading}>
          Update Chatbot Settings
        </Button>
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

export default SettingsPage;

// This example is for guidance purposes. Copying it will come with caveats.

import {
  BlockStack,
  Box,
  Card,
  InlineGrid,
  Page,
  Text,
  TextField,
  Button,
  Select,
  Banner,
} from '@shopify/polaris';
import { useAction, useFindFirst, useFindMany } from '@gadgetinc/react';

import { useNavigate } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';

import { api } from './api';

const SettingsPage = () => {
  const navigate = useNavigate();

  const [
    {
      data: shop,
      // fetching: _fecthing,
      // error: _error
    },
  ] = useFindFirst(api.shopifyShop);

  console.log('shop', shop?.id);
  const [{ data }] = useFindMany(api.chatbotSettings);
  console.log('data', data);

  const settings = data ? data[0] : null;
  useEffect(() => {}, [shop]);

  const [name, setName] = useState('');
  const [introductionMessage, setIntroductionMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setIntroductionMessage(settings?.introductionMessage || '');
      setName(settings?.name || '');
      setSelectedPersonality(settings?.personality || 'FRIENDLY');
      setSelectedRole(settings?.role || 'ADVISOR');
      setSelectedTalkativeness(settings?.talkativeness || '1');
    }
  }, [settings]);

  const handleNameChange = useCallback((newValue) => setName(newValue), []);
  const handleIntroductionMessageChange = useCallback(
    (newValue) => setIntroductionMessage(newValue),
    []
  );

  const [selectedPersonality, setSelectedPersonality] = useState('');

  const handleSelectChange = useCallback((value) => setSelectedPersonality(value), []);

  const personalityOptions = [
    { label: 'Friendly', value: 'FRIENDLY' },
    { label: 'Informative', value: 'INFORMATIVE' },
    { label: 'Persuasive', value: 'PERSUASIVE' },
    { label: 'Witty', value: 'WITTY' },
    {
      label: 'Empathetic',
      value: 'EMPATHETIC',
    },
    {
      label: 'Auto',
      value: 'AUTO',
    },
  ];

  const talkativenessOptions = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
  ];

  const roleOptions = [
    { label: 'Advisor', value: 'ADVISOR' },
    { label: 'Enthusiast', value: 'ENTHUSIAST' },
    { label: 'Professional', value: 'PROFESSIONAL' },
    { label: 'Storyteller', value: 'STORYTELLER' },
    { label: 'Concierge', value: 'CONCIERGE' },
    { label: 'Auto', value: 'AUTO' },
  ];

  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleChange = useCallback((value) => setSelectedRole(value), []);

  const [selectedTalkativeness, setSelectedTalkativeness] = useState('');

  const handleTalkativenessChange = useCallback((value) => setSelectedTalkativeness(value), []);

  const [{ loading }, updateChatbotSettings] = useAction(api.chatbotSettings.update);

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    try {
      const newTask = await updateChatbotSettings({
        id: settings?.id,
        name: name,
        introductionMessage: introductionMessage,
        personality: selectedPersonality,
        role: selectedRole,
        talkativeness: selectedTalkativeness,
      });
      setShowSuccess(true);
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
      backAction={{
        content: 'Home',
        onAction: () => navigate('/'),
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

              <Select
                label='Personality'
                options={personalityOptions}
                onChange={handleSelectChange}
                value={selectedPersonality}
              />
              <Select
                label='Talkativeness'
                options={talkativenessOptions}
                onChange={handleTalkativenessChange}
                value={selectedTalkativeness}
              />
              <Select
                label='Roles'
                options={roleOptions}
                onChange={handleRoleChange}
                value={selectedRole}
              />
            </BlockStack>
          </Card>
          <Box
            as='section'
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap='400' />
          </Box>
          <Button onClick={handleSave} disabled={loading}>
            Update Chatbot Settings
          </Button>
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

      {showSuccess && (
        <div className='bannerTopPadding' style={{ paddingTop: '20px' }}>
          <Banner
            title='Chatbot settings updated'
            onDismiss={() => {
              setShowSuccess(false);
            }}
            tone={'success'}
          />
        </div>
      )}
    </Page>
  );
};

export default SettingsPage;

import { Page, Text } from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Page
      title='About'
      backAction={{
        content: 'Shop Information',
        onAction: () => navigate('/'),
      }}
    >
      <Text variant='bodyMd' as='p'>
        AskShop.AI is a one-stop AI chatbot for your store to recommend its products through a chat
        interface. It performs product recommendations for your store either by using text, or image
        uploads from the chat.
      </Text>
    </Page>
  );
};

export default AboutPage;

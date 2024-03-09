# EcomRAG: Plug & Play Shopify Chatbot

## Table of Contents

- [Introduction](#introduction)
- [Example](#example)
- [Step-by-Step Setup](#step-by-step-setup)
- [Key Features](#key-features)
- [Vectorization](#vectorization)
- [Linting](#linting)

## Introduction

This app can be installed by any Shopify store.
When a user installs this app, the app gets all their Shopify product details and vectorizes them, stores them using RAG (Retrieval Augmented Generation).
Now every customer that visits the store gets greeted with a chatbot which answers their needs directly.
Their question could be as simple as:

> "I want to look like Emma Stone from La La Land"

or

> "I'm looking for an anniversary ring for my girlfriend of 5 years. She loves minimalist designs and has a keen interest in sustainability and ethical sourcing. Her favorite gemstone is a sapphire, but I want to make sure it's conflict-free. She has a slender finger, so I'm thinking a delicate band might suit her best. Given these details, can you suggest specific styles or brands that prioritize ethical sourcing and offer minimalist sapphire rings suitable for slender fingers?"

And the app answers you the recommended product link and image.

The reason why our app is better than the rest of the competition is because we use RAG to bring query and answer speed down to < 3 seconds, guarantee a high degree of accuracy by constantly fine-tuning our recommendation model with add-to-cart conversion tracking, and it can be integrated in 30 seconds into your Shopify Store.

## Example

<img width="1064" alt="Screenshot 2024-02-22 at 10 45 29 AM" src="https://github.com/JamesLiuZX/ecomrag/assets/25603844/8d2d0ccd-d953-42f8-9952-22a67bdf0f82">

<p float="left">
  <img width="327" alt="Screenshot 2024-02-22 at 10 38 54 AM" src="https://github.com/JamesLiuZX/ecomrag/assets/25603844/870f81c3-b533-421b-b56f-381af0147661">
  <img width="330" alt="Screenshot 2024-02-22 at 10 38 36 AM" src="https://github.com/JamesLiuZX/ecomrag/assets/25603844/f98cc1ca-ef4f-4cf6-9966-92f4be2aaf85">
  <img width="330" alt="Screenshot 2024-02-22 at 10 38 47 AM" src="https://github.com/JamesLiuZX/ecomrag/assets/25603844/18dafc08-990d-42af-af04-41274f987e44">
</p>

> Based on your requirements for an anniversary ring, I understand that you're looking for something with a minimalist design and a conflict-free sapphire, preferably on a delicate band suitable for slender fingers. While the rings I have to recommend today don't contain sapphires, they are sophisticated, with a minimalist aesthetic that could align with your girlfriend's preferences. Both options are silver-plated with artificial gemstones, offering an ethical alternative without compromising style. Check out the recommended products:

> Silver-Plated Artificial Gemstone Ring

> Silver-Plated Artificial Gemstone Ring

> Click on a product to learn more!

## Step-by-Step Setup

1. Clone the EcomRAG Repository and EComRag-Shopify repository [here](https://github.com/JamesLiuZX/ecomrag-shopify).

2. Configure Shopify Test Account:

- Log in to your Shopify test account.
- Navigate to the 'Apps' section and install the EcomRAG app for testing purposes.

3. Set Up Gadget.dev:

- Follow this [tutorial](https://gadget.dev/blog/build-a-product-recommendation-chatbot-for-a-shopify-store-using-openai-and-gadget)
- Sign in to Gadget.dev using your GitHub account (ensuring it uses the same password for convenience).
- Follow the on-screen instructions to initialize the EcomRAG project within Gadget.dev.

4. Deploy to Shopify Partners Account:

- After testing and finalizing your app within the test environment, proceed to deploy it through your Shopify Partners account for broader accessibility.

5. Synchronize with NPX CLI:

- Utilize the provided npx CLI commands to synchronize your development work with both Gadget.dev and Shopify in real time.

## Key Features

1. RAG LLM Chatbot: Engages customers by finding products based on specific needs and answering questions, utilizing both textual and multimodal data.
2. Image-Based Search: Allows for product discovery using keywords or images, improving upon traditional search methodologies.
3. Personalized Recommendations: Leverages behavioral data to offer tailored product suggestions and effective marketing strategies.

## Vectorization

1. Textual Data: For enhanced product descriptions and metadata.
2. Image Data: To facilitate intuitive product searches beyond title-based queries.
3. Behavioral Data: For personalized recommendations based on customer activity.
4. Multimodal Data: Combining various data types for a comprehensive understanding of customer needs.

### Linting

1. To start, install the new dev dependencies by running:

```sh
yarn install -D
```

2. When you stage changes to frontend code (`.js`, `.jsx` files), two actions will happen:

   a. Format the code according to Prettier styleguides. Read more [here](https://prettier.io/).

   ai. The configuration file can be found [here](.prettierrc)

   b. Lint the code and report any errors, using [Eslint](https://eslint.org/)

   bi. The configuration file can be found [here](.eslintrc.json)

3. Start a commit by running:

```sh
git add . && git commit -asm "<COMMIT MESSAGE>"
```

Your changes should run the above two actions.

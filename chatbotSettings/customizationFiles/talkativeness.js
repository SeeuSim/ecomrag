const TalkativenessLevels = {
  LEVEL_1: { description: 'Just show products and do not elaborate.', wordLimit: 0 },
  LEVEL_2: {
    description: 'Give a concise introduction or rationale for the product selection.',
    wordLimit: 20,
  },
  LEVEL_3: {
    description: 'Provide a balanced amount of detail on why the product is recommended.',
    wordLimit: 40,
  },
  LEVEL_4: {
    description: 'Offer more detailed explanations, including features and benefits.',
    wordLimit: 60,
  },
  LEVEL_5: {
    description: 'Be as elaborate as possible, providing comprehensive insights.',
    wordLimit: 80,
  },
};

module.exports = TalkativenessLevels;

// backend/services/comprehend.js
const { ComprehendClient, DetectSentimentCommand } = require('@aws-sdk/client-comprehend');
const { comprehend } = require('../utils/awsConfig');

async function analyzeSentiment(text) {
  try {
    const params = {
      Text: text,
      LanguageCode: 'en' // Ensure English text
    };

    const command = new DetectSentimentCommand(params);
    const response = await comprehend.send(command);

    return {
      sentiment: response.Sentiment,
      sentimentScore: response.SentimentScore
    };
  } catch (error) {
    console.error('Comprehend Error:', error);
    throw new Error('Failed to analyze sentiment');
  }
}

module.exports = { analyzeSentiment };

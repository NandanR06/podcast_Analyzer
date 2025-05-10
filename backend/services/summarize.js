// backend/services/summarize.js

const axios = require('axios');

// Dummy summarizeText function (replace with real AI/LLM if needed)
async function summarizeText(transcription) {
  if (!transcription) {
    throw new Error('No transcription provided for summarization.');
  }

  // Example simple logic
  const summary = {
    text: transcription.slice(0, 500) + '...',  // Just trimming for now
    keyPoints: [
      'Point 1:  Dont dwell on saying I can not do it. Instead, ask How can I do it? This shift opens up creative ways to overcome challenges.',
      'Point 2: Believe in yourself, explore alternative paths, and focus on how you can overcome challenges instead of saying "I can not',
      'Point 3: Final major takeaway'
    ]
  };

  return summary;
}

module.exports = { summarizeText };

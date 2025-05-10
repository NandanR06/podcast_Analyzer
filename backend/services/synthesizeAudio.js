const { PollyClient, SynthesizeSpeechCommand } = require('@aws-sdk/client-polly');
const { polly } = require('../utils/awsConfig');
const fs = require('fs/promises');
const path = require('path');
const { Readable } = require('stream');

async function synthesizeAudio(text, outputPath, voiceId = 'Joanna') {
  try {
    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    const params = {
      OutputFormat: 'mp3',
      Text: text,
      VoiceId: voiceId,
      Engine: 'neural',
      TextType: 'text'
    };

    const { AudioStream } = await polly.send(new SynthesizeSpeechCommand(params));
    
    // Convert stream to buffer and save
    const audioBuffer = await streamToBuffer(AudioStream);
    await fs.writeFile(outputPath, audioBuffer);
    
    console.log(`Audio synthesis successful: ${outputPath}`);
    return {
      path: outputPath,
      voiceId,
      textLength: text.length
    };
    
  } catch (error) {
    console.error('Polly Error:', error);
    throw new Error(`Audio synthesis failed: ${error.message}`);
  }
}

async function streamToBuffer(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    Readable.from(stream).on('data', chunk => chunks.push(chunk))
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', reject);
  });
}

module.exports = {
  synthesizeAudio,
  supportedVoices: {
    female: ['Joanna', 'Kendra', 'Kimberly'],
    male: ['Matthew', 'Justin', 'Kevin']
  }
};
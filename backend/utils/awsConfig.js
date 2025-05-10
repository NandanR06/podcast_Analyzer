// backend/utils/awsConfig.js
const { PollyClient } = require('@aws-sdk/client-polly');
const { TranscribeClient } = require('@aws-sdk/client-transcribe');
const { S3Client } = require('@aws-sdk/client-s3');
const { ComprehendClient } = require('@aws-sdk/client-comprehend');

const REGION = 'eu-central-1';

const polly = new PollyClient({ region: REGION });
const transcribe = new TranscribeClient({ region: REGION });
const s3 = new S3Client({ region: REGION });
const comprehend = new ComprehendClient({ region: REGION });

module.exports = {
  polly,
  transcribe,
  s3,
  comprehend
};

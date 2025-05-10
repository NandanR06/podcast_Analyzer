const { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } = require('@aws-sdk/client-transcribe');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const streamToString = require('../utils/streamToString'); // We'll create this utility
require('dotenv').config();

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const transcribeClient = new TranscribeClient({ region: process.env.AWS_REGION });

async function transcribeAudio(filePath) {
  const jobName = `transcription_${Date.now()}`;
  const fileUri = await uploadToS3(filePath);

  const params = {
    TranscriptionJobName: jobName,
    LanguageCode: 'en-US',
    Media: { MediaFileUri: fileUri },
    OutputBucketName: process.env.S3_BUCKET_NAME,
  };

  const startCommand = new StartTranscriptionJobCommand(params);
  await transcribeClient.send(startCommand);

  console.log('Transcription started...');

  let jobCompleted = false;
  while (!jobCompleted) {
    const getCommand = new GetTranscriptionJobCommand({ TranscriptionJobName: jobName });
    const data = await transcribeClient.send(getCommand);

    const status = data.TranscriptionJob.TranscriptionJobStatus;
    console.log(`Status: ${status}`);

    if (status === 'COMPLETED') {
      jobCompleted = true;

      const key = `${jobName}.json`;
      const getObjectCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key
      });

      const transcriptData = await s3Client.send(getObjectCommand);
      const bodyString = await streamToString(transcriptData.Body);
      const parsed = JSON.parse(bodyString);
    
      
console.log( parsed.results.transcripts[0].transcript)
      return parsed.results.transcripts[0].transcript;
    } else if (status === 'FAILED') {
      throw new Error('Transcription failed');
    }

    await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds
  }
}

async function uploadToS3(filePath) {
  const fileContent = fs.readFileSync(filePath);
  const keyName = `uploads/${path.basename(filePath)}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: keyName,
    Body: fileContent,
    ContentType: 'audio/mpeg',
  };

  await s3Client.send(new PutObjectCommand(params));

  return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${keyName}`;
}

module.exports = { transcribeAudio };

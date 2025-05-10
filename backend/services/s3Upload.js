const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../utils/awsConfig');
const fs = require('fs/promises');
const path = require('path');

/**
 * Uploads a file from the local filesystem to an S3 bucket
 * @param {string} filePath - Local path to the file
 * @param {string} folder - Folder in the S3 bucket to store the file
 * @param {object} metadata - Optional metadata (ContentType, Metadata)
 * @returns {object} - Upload result including S3 file URL, key, and bucket name
 */
async function uploadFile(filePath, folder, metadata = {}) {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const fileName = path.basename(filePath);
    const key = `${folder}/${Date.now()}_${fileName}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: metadata.ContentType || 'application/octet-stream',
      Metadata: metadata.Metadata || {},
    };

    const uploadResult = await s3.send(new PutObjectCommand(params));
    const fileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    console.log("✅ File uploaded to S3:", fileUrl);

    return {
      url: fileUrl,
      key,
      bucket: params.Bucket
    };

  } catch (error) {
    console.error('❌ S3 Upload Error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Uploads a buffer directly to S3
 * @param {Buffer} buffer - The buffer to upload
 * @param {string} contentType - MIME type of the buffer
 * @param {string} folder - Folder in the S3 bucket to store the buffer
 * @returns {string} - Public S3 URL of the uploaded buffer
 */
async function uploadBuffer(buffer, contentType, folder = 'documents') {
  try {
    const extension = contentType.split('/')[1] || 'bin';
    const key = `${folder}/${Date.now()}.${extension}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      
    };

    await s3.send(new PutObjectCommand(params));
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    console.log("✅ Buffer uploaded to S3:", fileUrl);

    return fileUrl;

  } catch (error) {
    console.error('❌ Buffer Upload Error:', error);
    throw new Error(`Failed to upload buffer: ${error.message}`);
  }
}

module.exports = {
  uploadFile,
  uploadBuffer
};

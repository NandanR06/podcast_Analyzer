// backend/services/analyzeService.js

const { transcribeAudio } = require('./transcribe');
const { summarizeText } = require('./summarize');
const {synthesizeAudio} = require('./synthesizeAudio');
const pdfGenerator= require('./pdfGenerator');
const s3Upload = require('./s3Upload');
const { downloadYouTubeAudio } = require('./youtubeDownloader');
const path = require('path');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

async function processYouTubeVideo(url) {
    try {
        if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
            throw new Error('Invalid YouTube URL');
        }

        // Step 1: Download audio from YouTube
        const audioPath = await downloadYouTubeAudio(url);
        console.log(`✅ Downloaded: ${audioPath}`);

        // Step 2: Upload original audio to S3
        const s3AudioUrl = await s3Upload.uploadFile(audioPath, 'audio', {
            ContentType: 'audio/mpeg',
            Metadata: {
                source: 'youtube',
                originalUrl: url
            }
        });
        console.log(`✅ Audio uploaded to S3: ${s3AudioUrl}`);

        // Step 3: Transcribe audio
        const transcription = await transcribeAudio(audioPath);
        console.log('✅ Transcription completed');

        // Clean up local audio file
        await fs.unlink(audioPath);

        // Step 4: Summarize text
        const summary = await summarizeText(transcription);
        console.log('✅ Summary generated');

        const jobId = uuidv4();

        // Step 5: Synthesize summary audio
        if (!summary || !summary.text) {
            throw new Error('Summary text is missing for synthesis.');
        }

        const audioSummaryPath = path.join(__dirname, '../summarized', `summary-${jobId}.mp3`);
        await synthesizeAudio(summary.text, audioSummaryPath);

        const audioSummaryUrl = await s3Upload.uploadFile(audioSummaryPath, 'summaries', {
            ContentType: 'audio/mpeg'
        });
        await fs.unlink(audioSummaryPath);
        console.log(`✅ Audio summary uploaded: ${audioSummaryUrl}`);

        // Step 6: Generate summary PDF
        const pdfBuffer = await pdfGenerator.generate({
            title: 'Podcast Summary',
            content: summary.text,
            insights: summary.keyPoints
        });
        const pdfUrl = await s3Upload.uploadBuffer(pdfBuffer, 'application/pdf', `summary-${jobId}.pdf`);
        
        console.log(`✅ PDF generated: ${pdfUrl}`);

        return {
            jobId,
            transcription,
            summary,
            audioSummaryUrl,
            pdfUrl,
            originalAudioUrl: s3AudioUrl
        };

    } catch (error) {
        console.error('❌ Error in processYouTubeVideo:', error);
        throw new Error(`Failed to process YouTube video: ${error.message}`);
    }
}

async function processUploadedFile(file) {
    try {
        if (!file || !file.path) {
            throw new Error('Invalid file upload');
        }

        const fileExtension = path.extname(file.originalname).toLowerCase();
        const contentType = fileExtension === '.mp3' ? 'audio/mpeg' : 'video/mp4';

        const s3FileUpload = await s3Upload.uploadFile(file.path, 'uploads', {
            ContentType: contentType,
            Metadata: {
                originalName: file.originalname
            }
        });

        // You can copy similar logic for transcription, summarization, etc., for uploaded files.

    } catch (error) {
        console.error('❌ Error in processUploadedFile:', error);
        throw error;
    }
}

module.exports = {
    processYouTubeVideo,
    processUploadedFile
};

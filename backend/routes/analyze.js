const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../utils/multerConfig');
const {
    processYouTubeVideo,
    processUploadedFile,
    generatePDF,
    getSummaryAudio
} = require('../services/analyzeService');

// Process YouTube URL
router.post('/youtube', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'YouTube URL is required' });
        }
        
        const result = await processYouTubeVideo(url);
        res.json(result);
    } catch (error) {
        console.error('Error processing YouTube video:', error);
        res.status(500).json({ error: 'Failed to process YouTube video' });
    }
});

// Process uploaded file
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const result = await processUploadedFile(req.file);
        res.json(result);
    } catch (error) {
        console.error('Error processing uploaded file:', error);
        res.status(500).json({ error: 'Failed to process uploaded file' });
    }
});

// Generate PDF
router.get('/pdf/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pdfBuffer = await generatePDF(id);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=summary-${id}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

// Get summary audio
router.get('/audio/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const audioStream = await getSummaryAudio(id);
        
        res.setHeader('Content-Type', 'audio/mpeg');
        audioStream.pipe(res);
    } catch (error) {
        console.error('Error fetching summary audio:', error);
        res.status(500).json({ error: 'Failed to fetch summary audio' });
    }
});

module.exports = router;
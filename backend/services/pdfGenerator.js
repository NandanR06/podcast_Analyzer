// backend/services/pdfGenerator.js

const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');

/**
 * Generate a PDF and return it as a buffer.
 * @param {Object} summaryData - Contains title,   content, and insights.
 * @returns {Promise<Buffer>}
 */
async function generate(summaryData) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });

            // Write the PDF content
            doc.fontSize(20).text(summaryData.title, { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text(summaryData.content, { align: 'justify' });
            doc.moveDown();
            doc.fontSize(16).text('Key Insights:', { underline: true });
            doc.moveDown();
            summaryData.insights.forEach((point, index) => {
                doc.fontSize(12).text(`${index + 1}. ${point}`);
            });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { generate };

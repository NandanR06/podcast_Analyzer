const youtubedl = require('youtube-dl-exec');
const path = require('path');
const fs = require('fs');

async function downloadYouTubeAudio(url) {
  const tempDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const outputFilePath = path.join(tempDir, `audio-${Date.now()}.mp3`);

  try {
    // Important: Use `stdio: 'ignore'` to wait until full download
    await youtubedl(url, {
      output: outputFilePath,
      extractAudio: true,
      audioFormat: 'mp3',
      ffmpegLocation: require('ffmpeg-static'),
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: [
        'referer:youtube.com',
        'user-agent:Mozilla/5.0'
      ]
      // 🚫 Remove stdio: 'ignore' completely!
    });
    

    // Also, double check file existence
    if (!fs.existsSync(outputFilePath)) {
      throw new Error('Audio file not created properly');
    }

    console.log(`✅ Downloaded: ${outputFilePath}`);
    return outputFilePath;
  } catch (error) {
    console.error('❌ Error downloading with youtube-dl:', error);
    throw new Error('YouTube download failed');
  }
}

module.exports = { downloadYouTubeAudio };

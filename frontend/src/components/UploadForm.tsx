import React, { useState } from 'react';
import Progress from './Progress';

interface UploadFormProps {
  onAnalyze: (input: { url?: string; file?: File }) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onAnalyze }) => {
  const [activeTab, setActiveTab] = useState<'youtube' | 'upload'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const API_BASE_URL = 'http://localhost:3000/api';
  const [transcription, setTranscription] = useState<string>();
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [audio, setAudio] = useState<string>('');
  const [keypoints, setKeyPoints] = useState<string[]>([]);
  const [analysis,setAnalysis] = useState<boolean>(false)

  const handleAnalyze = async () => {
    if (activeTab === 'youtube') {
      const url = youtubeUrl.trim();
      if (url) {
        onAnalyze({ url });

        try {
          setLoading(true);
          setAnalysis(true);

          const res = await fetch(`${API_BASE_URL}/analyze/youtube`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
          });

          if (!res.ok) {
            throw new Error('Failed to start analysis');
          }

          const data = await res.json();
          console.log('data from aws', data);
          setTranscription(data.transcription);
          setPdfUrl(data.pdfUrl);
          setAudio(data.originalAudioUrl.url);
          setKeyPoints(data.summary.keyPoints);
        } catch (err) {
          console.error('error', err);
        } finally {
          setLoading(false);
          
        }
      } else {
        alert('Please enter a valid YouTube URL');
      }
    } else if (activeTab === 'upload') {
      if (file) {
        onAnalyze({ file });
      } else {
        alert('Please upload a file');
      }
    }
  };

  const pdfDownload = () => {
    if (pdfUrl.trim() === '') {
      alert('PDF not found');
    } else {
      window.open(pdfUrl, '_blank');
    }
  };

  const playAudio = () => {
    if (audio.trim() !== '') {
      window.open(audio, '_blank');
    } else {
      alert('Audio not available');
    }
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-2xl mt-10  mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Podcast Analyzer App</h1>

      {/* Tabs */}
     

      <div className='md:flex item-center justify-center gap-10 '>

        
         {/* Input Section */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-inner md:w-[200rem] mt-10">

      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 rounded-full text-lg font-medium transition-all ${
            activeTab === 'youtube' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('youtube')}
        >
          YouTube URL
        </button>
        
      </div>


        {activeTab === 'youtube' ? (
          <div>
            <label className="block mb-2 font-semibold text-gray-700">YouTube URL:</label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="border w-full p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        ) : (
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Upload Audio/Video File:</label>
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border w-full p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        <button
          onClick={handleAnalyze}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition-all"
        >
          Analyze
        </button>
      </div>

      {/* Summary Section */}
      {analysis ? <div className="mt-10 bg-gray-100 p-2 rounded-2xl shadow-inner">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Podcast Summary</h2>

        {loading ? (
          <Progress />
        ) : (
          transcription && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Transcription</h3>
                <p className="bg-white p-4 rounded-lg shadow-sm text-gray-800">{transcription}</p>
              </div>

              {/* Key Points */}
              {keypoints.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Key Points</h3>
                  <ul className="list-disc list-inside bg-white p-4 rounded-lg shadow-sm">
                    {keypoints.map((point, index) => (
                      <li key={index} className="text-gray-800">{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
                <button
                  onClick={pdfDownload}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md transition-all"
                >
                  Download PDF
                </button>
                <button
                  onClick={playAudio}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded-md transition-all"
                >
                  Play Audio
                </button>
              </div>
            </div>
          )
        )}
      </div> :""}
      </div>

     
    </div>
  );
};

export default UploadForm;

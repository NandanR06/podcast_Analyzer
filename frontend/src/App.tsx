import React, { useState } from 'react';
import Header from './components/Header';
import UploadForm from './components/UploadForm';
import Progress from './components/Progress';
import Footer from './components/Footer';
import { SummaryData } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const handleAnalyze = async (input: { url?: string; file?: File }) => {
    setLoading(true);
    setSummary(null);

    try {
      // Dummy delay to simulate backend call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulated response (replace with your backend API call)
      // const dummySummary: SummaryData = {
      //   text: 'This is a short summary of the podcast. Key points are discussed below.',
      //   keyPoints: [
      //     { title: 'Introduction', content: 'Podcast begins with an introduction to the topic.' },
      //     { title: 'Main Discussion', content: 'Important points discussed about the topic.' },
      //     { title: 'Conclusion', content: 'Podcast concludes with key takeaways.' },
      //   ],
      //   audioSummaryUrl: '', // Can be empty if no audio generated
      // };

      // setSummary(dummySummary);
      setJobId('123456');
    } catch (error) {
      console.error('Error during analysis:', error);
      alert('Something went wrong while analyzing the podcast.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-1 container mx-auto px-4">
        <UploadForm onAnalyze={handleAnalyze} />

        {/* {loading && <Progress />} */}

        {/* {!loading && summary && <Results summary={summary} jobId={jobId} />} */}
      </main>

      <Footer />
    </div>
  );
};

export default App;

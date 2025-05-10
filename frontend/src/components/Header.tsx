// src/components/Header.tsx

import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8 bg-blue-600 text-white">
      <h1 className="text-4xl font-bold mb-2">Podcast Analyzer & Summarizer By Team GCG</h1>
      <p className="text-lg">Upload Youtube link get instant summaries!</p>
    </header>
  );
};

export default Header;

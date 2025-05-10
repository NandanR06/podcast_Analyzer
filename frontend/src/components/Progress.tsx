// src/components/Progress.tsx

import React from 'react';

const Progress: React.FC = () => {
  return (
    <div className="flex justify-center items-center mt-12">
      <div className="text-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mx-auto mb-4"></div>
        <p className="text-lg font-semibold">Analyzing, please wait...</p>
      </div>
    </div>
  );
};

export default Progress;

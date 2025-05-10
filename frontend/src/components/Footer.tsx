// src/components/Footer.tsx

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-4 text-gray-500 mt-12">
      &copy; {new Date().getFullYear()} Podcast Analyzer. All rights reserved by GCG.
    </footer>
  );
};

export default Footer;

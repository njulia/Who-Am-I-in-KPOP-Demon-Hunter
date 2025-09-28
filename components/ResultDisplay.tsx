import React from 'react';
import type { GenerationResult } from '../types';

interface ResultDisplayProps {
  result: GenerationResult;
  originalImage: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, originalImage }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 md:p-8">
      <div className="text-center mb-6">
        <p className="text-gray-300 text-lg">You are a match for...</p>
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400">
          {result.characterName}!
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-white mb-3">Your Photo</h3>
          <img src={originalImage} alt="Original user" className="w-full h-auto object-contain rounded-lg shadow-lg" />
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-white mb-3">Your Demon Hunter Look</h3>
          <img src={result.imageUrl} alt="Generated character" className="w-full h-auto object-contain rounded-lg shadow-lg border-2 border-pink-500" />
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;

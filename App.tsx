import React, { useState, useEffect, useCallback } from 'react';
import { CHARACTERS } from './constants';
import CharacterCard from './components/CharacterCard';
import ImageUploader from './components/ImageUploader';
import Loader from './components/Loader';
import ResultDisplay from './components/ResultDisplay';
import { generateCharacterOutfit } from './services/geminiService';
import type { GenerationResult } from './types';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setSelectedImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setSelectedImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleImageSelect = (file: File | null) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const generationResult = await generateCharacterOutfit(selectedFile);
      setResult(generationResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);
  
  const handleReset = () => {
    setSelectedFile(null);
    setSelectedImagePreview(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center my-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">K-Pop Demon Hunter</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Which hero are you? Upload your photo and let AI transform you into your demon-slaying alter ego.
          </p>
        </header>

        <main>
          {!result && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {CHARACTERS.map((char) => (
                <CharacterCard key={char.name} character={char} />
              ))}
            </div>
          )}

          <div className="flex flex-col items-center space-y-6">
            {!isLoading && !result && (
              <>
                <ImageUploader 
                  onImageSelect={handleImageSelect} 
                  selectedImagePreview={selectedImagePreview} 
                />
                {selectedFile && (
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="px-8 py-3 bg-pink-600 text-white font-bold rounded-full text-lg shadow-lg hover:bg-pink-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-500/50 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    Find My Match
                  </button>
                )}
              </>
            )}

            {isLoading && <Loader />}
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            
            {result && selectedImagePreview && (
              <div className="w-full flex flex-col items-center space-y-6">
                <ResultDisplay result={result} originalImage={selectedImagePreview} />
                 <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-gray-600 text-white font-bold rounded-full text-lg shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
                  >
                    Try Another Photo
                  </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

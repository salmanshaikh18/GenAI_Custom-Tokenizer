import React, { useState, useCallback } from 'react';
import { createTokenizer } from './utils/tokenizer';
import TrainingSection from './components/TrainingSection';
import TestingSection from './components/TestingSection';
import VocabSection from './components/VocabSection';
import type { Tokenizer, ResultStatus } from './types';

const App: React.FC = () => {
  const [tokenizer, setTokenizer] = useState<Tokenizer | null>(null);
  const [trainingStatus, setTrainingStatus] = useState<ResultStatus | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  const handleTrain = useCallback((texts: string[]): void => {
    try {
      const newTokenizer = createTokenizer({ maxVocab: 100 });
      newTokenizer.learnVocab(texts);
      const stats = newTokenizer.getStats();

      setTokenizer(newTokenizer);
      setIsReady(true);
      
      setTrainingStatus({
        type: 'success',
        message: `✅ Training completed!

📊 Statistics:
• Vocabulary size: ${stats.vocabSize}
• Special tokens: ${stats.specialTokensCount}
• Regular words: ${stats.regularWords}
• Training sentences: ${texts.length}

🎯 Ready for encoding and decoding!`
      });
    } catch (error) {
      setTrainingStatus({
        type: 'error',
        message: `❌ Training failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      setIsReady(false);
    }
  }, []);

  const runDemo = (): void => {
    const demoTexts = [
      "Hello world this is a demo",
      "JavaScript TypeScript React tokenizer application", 
      "Natural language processing with modern web technology",
      "Machine learning and artificial intelligence applications"
    ];
    handleTrain(demoTexts);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <header className="bg-white bg-opacity-95 backdrop-blur-lg p-8 text-center shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🔤 TypeScript Tokenizer
        </h1>
        <p className="text-gray-600 text-lg mb-4">
          Custom tokenizer with vocabulary learning, encoding & decoding
        </p>
        <button 
          onClick={runDemo}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 
                     rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200
                     transform hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 mx-auto"
        >
          🚀 Quick Demo
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-8 space-y-8">
        <TrainingSection 
          onTrain={handleTrain}
          trainingStatus={trainingStatus}
        />
        
        <TestingSection 
          tokenizer={tokenizer}
          isReady={isReady}
        />
        
        <VocabSection 
          tokenizer={tokenizer}
          isReady={isReady}
        />
      </main>

      <footer className="text-center p-8 text-white opacity-80">
        <p>Built with React, TypeScript & Tailwind CSS - Assignment Project</p>
      </footer>
    </div>
  );
};

export default App;

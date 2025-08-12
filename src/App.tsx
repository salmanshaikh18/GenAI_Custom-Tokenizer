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
  const [isTraining, setIsTraining] = useState<boolean>(false);

  const handleTrain = useCallback(async (texts: string[]): Promise<void> => {
    setIsTraining(true);
    setTrainingStatus({ type: 'info', message: '🔄 Training in progress...' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newTokenizer = createTokenizer({ maxVocab: 1000 });
      newTokenizer.learnVocab(texts);
      const stats = newTokenizer.getStats();

      setTokenizer(newTokenizer);
      setIsReady(true);
      
      setTrainingStatus({
        type: 'success',
        message: `✅ Training completed successfully!

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
      setTokenizer(null);
    } finally {
      setIsTraining(false);
    }
  }, []);

  const runDemo = (): void => {
    const demoTexts = [
      "Hello world this is a comprehensive demo",
      "JavaScript TypeScript React tokenizer application with advanced features", 
      "Natural language processing with modern web technology stack",
      "Machine learning and artificial intelligence applications in production",
      "Building scalable tokenizers for real-world text processing tasks",
      "Professional software development requires attention to code quality and testing"
    ];
    handleTrain(demoTexts);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile-Optimized Header */}
      <header className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-xl border-b border-slate-700/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm sm:text-lg font-bold">T</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Tokenizer Studio</h1>
                <p className="text-xs text-slate-400 hidden sm:block">Professional NLP Tokenization</p>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  isTraining ? 'bg-yellow-400 animate-pulse' : 
                  isReady ? 'bg-green-400' : 'bg-slate-500'
                }`}></div>
                <span className="text-slate-300">
                  {isTraining ? 'Training...' : isReady ? 'Ready' : 'Not Trained'}
                </span>
              </div>
              
              <button 
                onClick={runDemo}
                disabled={isTraining}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                          disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 rounded-lg 
                          text-xs sm:text-sm font-medium transition-all duration-200 flex items-center space-x-2
                          shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none cursor-pointer"
              >
                {isTraining ? (
                  <>
                    <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
                    <span className="hidden sm:inline">Training...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span className="hidden sm:inline">Quick Demo</span>
                    <span className="sm:hidden">Demo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Mobile-Optimized Stats Bar */}
        {tokenizer && (
          <div className="mb-4 sm:mb-6 bg-slate-800/50 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-slate-700/50 shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
              <div className="group">
                <div className="text-lg sm:text-2xl font-bold text-blue-400 group-hover:scale-105 transition-transform">
                  {tokenizer.getStats().vocabSize}
                </div>
                <div className="text-xs text-slate-400">Total Vocab</div>
              </div>
              <div className="group">
                <div className="text-lg sm:text-2xl font-bold text-green-400 group-hover:scale-105 transition-transform">
                  {tokenizer.getStats().specialTokensCount}
                </div>
                <div className="text-xs text-slate-400">Special Tokens</div>
              </div>
              <div className="group">
                <div className="text-lg sm:text-2xl font-bold text-purple-400 group-hover:scale-105 transition-transform">
                  {tokenizer.getStats().regularWords}
                </div>
                <div className="text-xs text-slate-400">Regular Words</div>
              </div>
              <div className="group">
                <div className="text-lg sm:text-2xl font-bold text-orange-400 group-hover:scale-105 transition-transform">
                  {tokenizer.getStats().totalTrainingWords}
                </div>
                <div className="text-xs text-slate-400">Training Words</div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile-First Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Training & Testing - Full width on mobile */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <TrainingSection 
              onTrain={handleTrain}
              trainingStatus={trainingStatus}
              isTraining={isTraining}
            />
            <TestingSection 
              tokenizer={tokenizer}
              isReady={isReady}
            />
          </div>
          
          {/* Vocabulary - Full width on mobile */}
          <div className="xl:col-span-1">
            <VocabSection 
              tokenizer={tokenizer}
              isReady={isReady}
            />
          </div>
        </div>
      </main>

      {/* Mobile-Optimized Footer */}
      <footer className="mt-8 sm:mt-12 border-t border-slate-800 bg-slate-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-slate-400 space-y-2 sm:space-y-0">
            <p>Built with React, TypeScript & Tailwind CSS</p>
            <p>Advanced NLP Tokenizer • Production Ready</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

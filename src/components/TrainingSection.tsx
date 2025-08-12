import React, { useState } from 'react';
import type { ResultStatus } from '../types';

interface TrainingSectionProps {
  onTrain: (texts: string[]) => void;
  trainingStatus: ResultStatus | null;
  isTraining: boolean;
}

const TrainingSection: React.FC<TrainingSectionProps> = ({ onTrain, trainingStatus, isTraining }) => {
  const defaultTrainingData = `Hello world this is a comprehensive demo
JavaScript TypeScript React tokenizer application with advanced features
Natural language processing with modern web technology stack
Machine learning and artificial intelligence applications in production
Building scalable tokenizers for real-world text processing tasks
Professional software development requires attention to code quality and testing`;

  const [trainingText, setTrainingText] = useState<string>(defaultTrainingData);

  const handleTrain = (): void => {
    const texts = trainingText
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    if (texts.length === 0) return;
    onTrain(texts);
  };

  const loadTestData = (): void => {
    setTrainingText(defaultTrainingData);
  };

  const clearText = (): void => {
    setTrainingText('');
  };

  const lineCount = trainingText.split('\n').filter(t => t.trim().length > 0).length;
  const wordCount = trainingText.split(/\s+/).filter(w => w.trim().length > 0).length;

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Mobile-Optimized Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-700/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-md flex items-center justify-center shadow-lg">
              <span className="text-xs">📚</span>
            </div>
            <h2 className="text-lg font-semibold text-white">Training Data</h2>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-slate-400">
            <span className="bg-slate-700/50 px-2 py-1 rounded flex items-center space-x-1">
              <span>📄</span>
              <span>{lineCount}</span>
            </span>
            <span className="bg-slate-700/50 px-2 py-1 rounded flex items-center space-x-1">
              <span>📝</span>
              <span>{wordCount}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <div className="relative">
          <textarea
            value={trainingText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTrainingText(e.target.value)}
            placeholder="Enter training text (one sentence per line)..."
            rows={6}
            className="w-full p-3 sm:p-4 bg-slate-900/50 border border-slate-600/50 rounded-lg font-mono text-xs sm:text-sm text-slate-100 
                       placeholder-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                       transition-all duration-200 resize-y hover:border-slate-500/50"
          />
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs text-slate-500 bg-slate-800/80 px-2 py-1 rounded">
            Lines: {lineCount} | Words: {wordCount}
          </div>
        </div>
        
        {/* Mobile-Optimized Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
          <button 
            onClick={handleTrain}
            disabled={isTraining || !trainingText.trim()}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 sm:px-6 py-3 
                       rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700
                       flex items-center justify-center space-x-2 font-semibold text-sm shadow-lg hover:shadow-xl
                       transform hover:-translate-y-0.5 disabled:transform-none cursor-pointer"
          >
            {isTraining ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Training...</span>
              </>
            ) : (
              <>
                <span>🎯</span>
                <span>Train Tokenizer</span>
              </>
            )}
          </button>
          
          {/* Single Button - Renamed */}
          <button 
            onClick={loadTestData}
            disabled={isTraining}
            className="sm:flex-none w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg 
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:bg-slate-700 flex items-center justify-center space-x-2 font-semibold text-sm shadow-lg
                       hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none cursor-pointer"
          >
            <span>📝</span>
            <span>Test with Dummy Data</span>
          </button>
          
          <button 
            onClick={clearText}
            disabled={isTraining}
            className="sm:flex-none w-full sm:w-auto border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 
                       px-4 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:border-slate-600 disabled:text-slate-600 flex items-center justify-center space-x-2 font-semibold text-sm cursor-pointer"
          >
            <span>🗑️</span>
            <span>Clear</span>
          </button>
        </div>

        {/* Training Status */}
        {trainingStatus && (
          <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg border-l-4 shadow-inner ${
            trainingStatus.type === 'success' 
              ? 'bg-green-500/10 border-green-500 text-green-300' 
              : trainingStatus.type === 'error'
              ? 'bg-red-500/10 border-red-500 text-red-300'
              : 'bg-blue-500/10 border-blue-500 text-blue-300'
          }`}>
            <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm leading-relaxed">
              {trainingStatus.message}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingSection;

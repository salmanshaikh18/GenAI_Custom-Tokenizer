import React, { useState } from 'react';
import type { ResultStatus } from '../types';

interface TrainingSectionProps {
  onTrain: (texts: string[]) => void;
  trainingStatus: ResultStatus | null;
}

const TrainingSection: React.FC<TrainingSectionProps> = ({ onTrain, trainingStatus }) => {
  const [trainingText, setTrainingText] = useState<string>(`Hello world this is a test
JavaScript is a programming language
Tokenizers convert text to numbers
Machine learning needs text preprocessing
Natural language processing is fascinating`);

  const handleTrain = (): void => {
    const texts = trainingText.split('\n').filter((t: string) => t.trim());
    onTrain(texts);
  };

  const loadSampleData = (): void => {
    const samples = [
      "The quick brown fox jumps over the lazy dog",
      "JavaScript is a versatile programming language", 
      "Natural language processing enables text analysis",
      "Machine learning models need proper tokenization",
      "Web development with React and TypeScript is powerful"
    ];
    setTrainingText(samples.join('\n'));
  };

  const clearText = (): void => {
    setTrainingText('');
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        📚 Training Data
      </h2>
      
      <textarea
        value={trainingText}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTrainingText(e.target.value)}
        placeholder="Enter training text (one sentence per line)..."
        rows={6}
        className="w-full p-4 border-2 border-gray-200 rounded-lg font-mono text-sm mb-4 
                   focus:border-blue-500 focus:outline-none transition-colors duration-200
                   resize-y"
      />
      
      <div className="flex flex-wrap gap-3 mb-4">
        <button 
          onClick={handleTrain}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 
                     rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200
                     transform hover:-translate-y-1 hover:shadow-lg flex items-center gap-2"
        >
          🎯 Train Tokenizer
        </button>
        
        <button 
          onClick={loadSampleData}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 
                     transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg
                     flex items-center gap-2"
        >
          📝 Load Sample Data
        </button>
        
        <button 
          onClick={clearText}
          className="border-2 border-blue-500 text-blue-500 px-6 py-2 rounded-lg 
                     hover:bg-blue-500 hover:text-white transition-all duration-200
                     flex items-center gap-2"
        >
          🗑️ Clear
        </button>
      </div>

      {trainingStatus && (
        <div className={`p-4 rounded-lg mt-4 ${
          trainingStatus.type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-800' :
          trainingStatus.type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-800' :
          'bg-blue-50 border-l-4 border-blue-500 text-blue-800'
        }`}>
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {trainingStatus.message}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TrainingSection;

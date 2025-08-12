import React, { useState } from 'react';
import type { Tokenizer, ResultStatus } from '../types';

interface VocabSectionProps {
  tokenizer: Tokenizer | null;
  isReady: boolean;
}

const VocabSection: React.FC<VocabSectionProps> = ({ tokenizer, isReady }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'vocab'>('stats');
  const [result, setResult] = useState<ResultStatus | null>(null);

  const showStats = (): void => {
    if (!isReady || !tokenizer) {
      setResult({ type: 'error', message: 'Please train the tokenizer first!' });
      return;
    }

    const stats = tokenizer.getStats();
    setResult({
      type: 'stats',
      message: `📊 Tokenizer Statistics:

Total Vocabulary: ${stats.vocabSize}
Special Tokens: ${stats.specialTokensCount}
Regular Words: ${stats.regularWords}
Training Words: ${stats.totalTrainingWords}

Special Tokens: ${Object.keys(tokenizer.specialTokens).join(', ')}`
    });
  };

  const showVocab = (): void => {
    if (!isReady || !tokenizer) {
      setResult({ type: 'error', message: 'Please train the tokenizer first!' });
      return;
    }

    const vocab = tokenizer.getVocab();
    const specialTokens = tokenizer.specialTokens;
    
    let message = '📖 Complete Vocabulary:\n\n🔴 Special Tokens:\n';
    
    Object.values(specialTokens).forEach((token: string) => {
      const id = vocab.get(token);
      message += `${id}: "${token}"\n`;
    });
    
    message += '\n🔵 Regular Words:\n';
    
    Array.from(vocab.entries())
      .filter(([token]: [string, number]) => !Object.values(specialTokens).includes(token))
      .sort((a, b) => a[1] - b[1])
      .slice(0, 20)
      .forEach(([token, id]: [string, number]) => {
        message += `${id}: "${token}"\n`;
      });

    if (vocab.size > 24) {
      message += `\n... and ${vocab.size - 24} more tokens`;
    }

    setResult({ type: 'vocab', message });
  };

  const handleTabClick = (tab: 'stats' | 'vocab'): void => {
    setActiveTab(tab);
    if (tab === 'stats') {
      showStats();
    } else {
      showVocab();
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        📖 Vocabulary
      </h2>
      
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => handleTabClick('stats')}
          className={`px-6 py-2 rounded-lg transition-all duration-200 ${
            activeTab === 'stats'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📊 Statistics
        </button>
        <button 
          onClick={() => handleTabClick('vocab')}
          className={`px-6 py-2 rounded-lg transition-all duration-200 ${
            activeTab === 'vocab'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📋 Vocabulary
        </button>
      </div>

      {result && (
        <div className={`p-4 rounded-lg ${
          result.type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-800' :
          result.type === 'stats' ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-800' :
          'bg-gray-50 border-l-4 border-gray-500 text-gray-800'
        }`}>
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {result.message}
          </pre>
        </div>
      )}
    </div>
  );
};

export default VocabSection;

import React, { useState, useEffect } from 'react';
import type { Tokenizer, ResultStatus, TabType } from '../types';

interface VocabSectionProps {
  tokenizer: Tokenizer | null;
  isReady: boolean;
}

const VocabSection: React.FC<VocabSectionProps> = ({ tokenizer, isReady }) => {
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [result, setResult] = useState<ResultStatus | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (isReady && tokenizer) {
      handleTabClick(activeTab);
    }
  }, [tokenizer, isReady, activeTab]);

  const showStats = (): void => {
    if (!isReady || !tokenizer) {
      setResult({ type: 'error', message: 'Please train the tokenizer first!' });
      return;
    }

    const stats = tokenizer.getStats();
    const vocab = tokenizer.getVocab();
    
    const avgTokenLength = Array.from(vocab.keys())
      .reduce((acc, token) => acc + token.length, 0) / vocab.size;
    
    const tokenLengthDistribution = Array.from(vocab.keys()).reduce((acc, token) => {
      const len = token.length;
      acc[len] = (acc[len] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const mostCommonLength = Object.entries(tokenLengthDistribution)
      .sort((a, b) => b[1] - a[1])[0];

    setResult({
      type: 'stats',
      message: `📊 Comprehensive Statistics:

🎯 Core Metrics:
• Total Vocabulary: ${stats.vocabSize}
• Special Tokens: ${stats.specialTokensCount}
• Regular Words: ${stats.regularWords}
• Training Words: ${stats.totalTrainingWords}

📈 Analysis:
• Avg Token Length: ${avgTokenLength.toFixed(1)} chars
• Most Common Length: ${mostCommonLength[0]} chars (${mostCommonLength[1]} tokens)
• Vocabulary Efficiency: ${((stats.regularWords / stats.totalTrainingWords) * 100).toFixed(1)}%
• Memory Usage: ~${(vocab.size * 16)} bytes

🔧 Configuration:
• Max Vocabulary: 1000 tokens
• Special Tokens: ${Object.keys(tokenizer.specialTokens).join(', ')}

📋 Token Length Distribution:
${Object.entries(tokenLengthDistribution)
  .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
  .slice(0, 8)
  .map(([len, count]) => `• ${len} chars: ${count} tokens`)
  .join('\n')}`
    });
  };

  const showVocab = (): void => {
    if (!isReady || !tokenizer) {
      setResult({ type: 'error', message: 'Please train the tokenizer first!' });
      return;
    }

    const vocab = tokenizer.getVocab();
    const specialTokens = tokenizer.specialTokens;
    
    let regularTokens = Array.from(vocab.entries())
      .filter(([token]: [string, number]) => !Object.values(specialTokens).includes(token))
      .sort((a, b) => a[1] - b[1]);

    if (searchTerm.trim()) {
      regularTokens = regularTokens.filter(([token]) => 
        token.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    let message = '📖 Vocabulary Explorer:\n\n';
    
    if (searchTerm.trim()) {
      message += `🔍 Search Results for "${searchTerm}" (${regularTokens.length} matches):\n\n`;
    } else {
      message += `📋 Complete Token List (${regularTokens.length} regular tokens):\n\n`;
    }
    
    regularTokens.slice(0, 20).forEach(([token, id]: [string, number], index: number) => {
      message += `${(index + 1).toString().padStart(2)}. ${id.toString().padStart(3)}: "${token}"\n`;
    });

    if (regularTokens.length > 20) {
      message += `\n... and ${regularTokens.length - 20} more tokens\n`;
      message += `\n💡 Use search to find specific tokens`;
    }

    if (regularTokens.length === 0 && searchTerm.trim()) {
      message += '❌ No tokens found matching your search.\n';
      message += '💡 Try a different search term or clear the search.';
    }

    setResult({ type: 'vocab', message });
  };

  const showSpecialTokens = (): void => {
    if (!isReady || !tokenizer) {
      setResult({ type: 'error', message: 'Please train the tokenizer first!' });
      return;
    }

    const vocab = tokenizer.getVocab();
    const specialTokens = tokenizer.specialTokens;
    
    let message = '🔴 Special Tokens Configuration:\n\n';
    
    message += '📋 Special Token Registry:\n';
    Object.entries(specialTokens).forEach(([name, token]: [string, string], index: number) => {
      const id = vocab.get(token);
      message += `${(index + 1).toString().padStart(1)}. ${name.toUpperCase().padEnd(8)}: ${id?.toString().padStart(3)} → "${token}"\n`;
    });
    
    message += '\n💡 Special Token Usage:\n';
    message += '• UNK (<UNK>): Replaces unknown/out-of-vocabulary words\n';
    message += '• PAD (<PAD>): Used for padding sequences to equal length\n';
    message += '• BOS (<BOS>): Marks the beginning of a sequence\n';
    message += '• EOS (<EOS>): Marks the end of a sequence\n';
    
    message += '\n🎯 Implementation Details:\n';
    message += '• Special tokens are assigned IDs 0-3\n';
    message += '• They are reserved and cannot be overwritten\n';
    message += '• Always processed before regular vocabulary\n';
    message += '• Essential for advanced NLP tasks';

    setResult({ type: 'special', message });
  };

  const handleTabClick = (tab: TabType): void => {
    setActiveTab(tab);
    if (tab !== 'vocab') {
      setSearchTerm('');
    }
    
    switch (tab) {
      case 'stats': showStats(); break;
      case 'vocab': showVocab(); break;
      case 'special': showSpecialTokens(); break;
    }
  };

  const handleSearch = (): void => {
    if (activeTab === 'vocab') {
      showVocab();
    }
  };

  const clearSearch = (): void => {
    setSearchTerm('');
    if (activeTab === 'vocab') {
      showVocab();
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 xl:sticky xl:top-24">
      {/* Mobile-Optimized Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-700/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-md flex items-center justify-center shadow-lg">
              <span className="text-xs">📖</span>
            </div>
            <h2 className="text-lg font-semibold text-white">Vocabulary</h2>
          </div>
          {tokenizer && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                {tokenizer.getStats().vocabSize} tokens
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-Optimized Tabs */}
      <div className="px-4 sm:px-6 py-3 border-b border-slate-700/50 bg-slate-800/20">
        <div className="grid grid-cols-3 gap-1">
          {[
            { key: 'stats' as TabType, label: 'Statistics', icon: '📊' },
            { key: 'vocab' as TabType, label: 'Vocabulary', icon: '📋' },
            { key: 'special' as TabType, label: 'Special', icon: '🔴' }
          ].map(({ key, label, icon }) => (
            <button 
              key={key}
              onClick={() => handleTabClick(key)}
              disabled={!isReady}
              className={`px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                activeTab === key
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <span className="block sm:hidden">{icon}</span>
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      {activeTab === 'vocab' && isReady && (
        <div className="px-4 sm:px-6 py-3 border-b border-slate-700/50 bg-slate-800/10">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search vocabulary..."
              className="w-full p-2 sm:p-3 bg-slate-900/50 border border-slate-600/50 rounded text-slate-100 
                         placeholder-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-sm pr-12 sm:pr-16
                         transition-all duration-200"
            />
            <div className="absolute right-1 top-1 sm:right-1 sm:top-1 flex items-center space-x-1">
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
              <button
                onClick={handleSearch}
                className="text-slate-400 hover:text-blue-400 p-1 rounded transition-colors cursor-pointer"
                title="Search"
              >
                🔍
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 sm:p-6">
        {result ? (
          <div className={`p-3 sm:p-4 rounded-lg max-h-64 sm:max-h-80 overflow-y-auto shadow-inner ${
            result.type === 'error' 
              ? 'bg-red-500/10 border border-red-500/30 text-red-300' 
              : result.type === 'stats' 
              ? 'bg-blue-500/10 border border-blue-500/30 text-blue-300' 
              : result.type === 'special'
              ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300'
              : 'bg-slate-500/10 border border-slate-500/30 text-slate-300'
          } scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 hover:scrollbar-thumb-slate-500`}>
            <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm leading-relaxed">
              {result.message}
            </pre>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="text-3xl sm:text-4xl mb-4 opacity-50">📊</div>
            <p className="text-slate-400 text-sm px-4">
              {!isReady 
                ? 'Train the tokenizer to explore vocabulary' 
                : 'Select a tab above to view tokenizer information'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabSection;

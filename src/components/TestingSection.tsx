import React, { useState } from 'react';
import type { Tokenizer, ResultStatus, TokenInfo } from '../types';

interface TestingSectionProps {
  tokenizer: Tokenizer | null;
  isReady: boolean;
}

const TestingSection: React.FC<TestingSectionProps> = ({ tokenizer, isReady }) => {
  const [testText, setTestText] = useState<string>('Hello world this is a comprehensive demo');
  const [encoded, setEncoded] = useState<number[]>([]);
  const [result, setResult] = useState<ResultStatus | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const calculateSimilarity = (str1: string, str2: string): number => {
    if (str1 === str2) return 100;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 100;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return ((longer.length - editDistance) / longer.length) * 100;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const handleEncode = async (): Promise<void> => {
    if (!isReady || !tokenizer) {
      setResult({ type: 'error', message: 'Please train the tokenizer first!' });
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const encodedResult = tokenizer.encode(testText);
      setEncoded(encodedResult);
      
      const tokens: TokenInfo[] = encodedResult.map((id: number) => {
        const token = tokenizer.getReverseVocab().get(id) || '';
        const isSpecial = Object.values(tokenizer.specialTokens).includes(token);
        return { id, token, isSpecial };
      });

      const compressionRatio = ((testText.length - encodedResult.length) / testText.length * 100).toFixed(1);
      
      setResult({
        type: 'success',
        message: `✅ Encoded successfully!

📝 Original: "${testText}"
📏 Length: ${testText.length} characters
🔢 Encoded: [${encodedResult.join(', ')}]
📊 Tokens: ${encodedResult.length}
📈 Compression: ${compressionRatio}%`,
        tokens
      });
    } catch (error) {
      setResult({ 
        type: 'error', 
        message: `❌ Encoding failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecode = async (): Promise<void> => {
    if (!encoded.length || !tokenizer) {
      setResult({ type: 'error', message: 'Please encode some text first!' });
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const decoded = tokenizer.decode(encoded);
      
      const normalizedOriginal = testText.toLowerCase().trim();
      const normalizedDecoded = decoded.toLowerCase().trim();
      const isExactMatch = normalizedOriginal === normalizedDecoded;
      
      const similarity = calculateSimilarity(normalizedOriginal, normalizedDecoded);
      
      let statusIcon = '✅';
      let statusMessage = 'Perfect round-trip match!';
      
      if (!isExactMatch) {
        if (similarity >= 90) {
          statusIcon = '✅';
          statusMessage = `Excellent match (${similarity.toFixed(1)}% similarity)`;
        } else if (similarity >= 70) {
          statusIcon = '⚠️';
          statusMessage = `Good match (${similarity.toFixed(1)}% similarity) - Some OOV words replaced`;
        } else {
          statusIcon = '❌';
          statusMessage = `Poor match (${similarity.toFixed(1)}% similarity) - Many OOV words`;
        }
      }
      
      setResult({
        type: 'success',
        message: `📝 Decoded successfully!

🔢 Token IDs: [${encoded.join(', ')}]
📝 Decoded: "${decoded}"
📏 Length: ${decoded.length} characters

${statusIcon} ${statusMessage}

🔄 Round-trip Analysis:
• Original: "${testText}"
• Decoded:  "${decoded}"`
      });
    } catch (error) {
      setResult({ 
        type: 'error', 
        message: `❌ Decoding failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearTest = (): void => {
    setTestText('');
    setResult(null);
    setEncoded([]);
  };

  const testSamples = [
    'Hello world this is a comprehensive demo',
    'JavaScript TypeScript React tokenizer application',
    'Natural language processing with modern technology',
    'Machine learning and artificial intelligence applications',
    'Professional software development requires attention to quality'
  ];

  const loadRandomSample = (): void => {
    const randomSample = testSamples[Math.floor(Math.random() * testSamples.length)];
    setTestText(randomSample);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Mobile-Optimized Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-700/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-md flex items-center justify-center shadow-lg">
              <span className="text-xs">🧪</span>
            </div>
            <h2 className="text-lg font-semibold text-white">Testing Lab</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              isReady ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            <span className="text-xs text-slate-400">{isReady ? 'Ready' : 'Not Ready'}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={testText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestText(e.target.value)}
              placeholder="Enter text to encode..."
              className="w-full p-3 sm:p-4 bg-slate-900/50 border border-slate-600/50 rounded-lg font-mono text-xs sm:text-sm text-slate-100
                         placeholder-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20
                         transition-all duration-200 pr-16 sm:pr-20 hover:border-slate-500/50"
            />
            <div className="absolute right-2 top-2 flex items-center space-x-1">
              <button
                onClick={loadRandomSample}
                disabled={isProcessing}
                className="text-slate-400 hover:text-purple-400 p-1 sm:p-2 rounded transition-colors disabled:opacity-50 cursor-pointer"
                title="Load random sample"
              >
                🎲
              </button>
              <select 
                onChange={(e) => e.target.value && setTestText(e.target.value)}
                value=""
                disabled={isProcessing}
                className="bg-slate-700 text-slate-300 text-xs rounded px-1 sm:px-2 py-1 border-none focus:outline-none disabled:opacity-50 cursor-pointer"
              >
                <option value="">Select</option>
                {testSamples.map((sample, idx) => (
                  <option key={idx} value={sample}>{sample.substring(0, 20)}...</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Mobile-Optimized Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button 
              onClick={handleEncode}
              disabled={!isReady || isProcessing || !testText.trim()}
              className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-semibold text-sm shadow-lg cursor-pointer ${
                isReady && testText.trim() && !isProcessing
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Processing</span>
                </>
              ) : (
                <>
                  <span>🔢</span>
                  <span>Encode</span>
                </>
              )}
            </button>
            
            <button 
              onClick={handleDecode}
              disabled={!encoded.length || isProcessing}
              className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-semibold text-sm shadow-lg cursor-pointer ${
                encoded.length && !isProcessing
                  ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>📝</span>
              <span>Decode</span>
            </button>
            
            <button 
              onClick={clearTest}
              disabled={isProcessing}
              className="border-2 border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 
                         px-4 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:border-slate-600 disabled:text-slate-600 flex items-center justify-center space-x-2 font-semibold text-sm cursor-pointer"
            >
              <span>🗑️</span>
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg border-l-4 shadow-inner ${
            result.type === 'success' 
              ? 'bg-green-500/10 border-green-500 text-green-300' 
              : 'bg-red-500/10 border-red-500 text-red-300'
          }`}>
            <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              {result.message}
            </pre>
            {result.tokens && (
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-semibold text-slate-300">Token Breakdown:</h4>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {result.tokens.map(({ id, token, isSpecial }: TokenInfo, index: number) => (
                    <span 
                      key={index} 
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-mono border transition-all duration-200 hover:scale-105 ${
                        isSpecial 
                          ? 'bg-red-500/20 text-red-300 border-red-500/40' 
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}
                      title={isSpecial ? 'Special Token' : 'Regular Token'}
                    >
                      {id}:"{token}"
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestingSection;

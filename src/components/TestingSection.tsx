import React, { useState } from 'react';
import type { Tokenizer, ResultStatus, TokenInfo } from '../types';

interface TestingSectionProps {
  tokenizer: Tokenizer | null;
  isReady: boolean;
}

const TestingSection: React.FC<TestingSectionProps> = ({ tokenizer, isReady }) => {
  const [testText, setTestText] = useState<string>('Hello JavaScript world');
  const [encoded, setEncoded] = useState<number[]>([]);
  const [result, setResult] = useState<ResultStatus | null>(null);

  const handleEncode = (): void => {
    if (!isReady || !tokenizer) {
      setResult({ type: 'error', message: 'Please train the tokenizer first!' });
      return;
    }

    try {
      const encodedResult = tokenizer.encode(testText);
      setEncoded(encodedResult);
      
      const tokens: TokenInfo[] = encodedResult.map((id: number) => {
        const token = tokenizer.getReverseVocab().get(id) || '';
        const isSpecial = Object.values(tokenizer.specialTokens).includes(token);
        return { id, token, isSpecial };
      });

      setResult({
        type: 'success',
        message: `✅ Encoded successfully!

Original: "${testText}"
Encoded: [${encodedResult.join(', ')}]`,
        tokens
      });
    } catch (error) {
      setResult({ 
        type: 'error', 
        message: `❌ Encoding failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  };

  const handleDecode = (): void => {
    if (!encoded.length || !tokenizer) {
      setResult({ type: 'error', message: 'Please encode some text first!' });
      return;
    }

    try {
      const decoded = tokenizer.decode(encoded);
      setResult({
        type: 'success',
        message: `📝 Decoded successfully!

Token IDs: [${encoded.join(', ')}]
Decoded: "${decoded}"

🔄 Round-trip completed!`
      });
    } catch (error) {
      setResult({ 
        type: 'error', 
        message: `❌ Decoding failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  };

  const clearTest = (): void => {
    setTestText('');
    setResult(null);
    setEncoded([]);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        🧪 Testing
      </h2>
      
      <input
        type="text"
        value={testText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestText(e.target.value)}
        placeholder="Enter text to encode..."
        className="w-full p-4 border-2 border-gray-200 rounded-lg font-mono text-sm mb-4
                   focus:border-blue-500 focus:outline-none transition-colors duration-200"
      />
      
      <div className="flex flex-wrap gap-3 mb-4">
        <button 
          onClick={handleEncode}
          disabled={!isReady}
          className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
            isReady 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          🔢 Encode
        </button>
        
        <button 
          onClick={handleDecode}
          disabled={!encoded.length}
          className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
            encoded.length 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          📝 Decode
        </button>
        
        <button 
          onClick={clearTest}
          className="border-2 border-blue-500 text-blue-500 px-6 py-2 rounded-lg 
                     hover:bg-blue-500 hover:text-white transition-all duration-200
                     flex items-center gap-2"
        >
          🗑️ Clear
        </button>
      </div>

      {result && (
        <div className={`p-4 rounded-lg mt-4 ${
          result.type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-800' :
          result.type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-800' :
          'bg-blue-50 border-l-4 border-blue-500 text-blue-800'
        }`}>
          <pre className="whitespace-pre-wrap font-mono text-sm mb-2">
            {result.message}
          </pre>
          {result.tokens && (
            <div className="flex flex-wrap gap-2 mt-3">
              {result.tokens.map(({ id, token, isSpecial }: TokenInfo, index: number) => (
                <span 
                  key={index} 
                  className={`px-3 py-1 rounded-full text-xs font-mono ${
                    isSpecial 
                      ? 'bg-red-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {id}:"{token}"
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestingSection;

import type { Tokenizer, TokenizerConfig, TokenizerStats } from '../types';

export const createTokenizer = (config: TokenizerConfig): Tokenizer => {
  const vocab = new Map<string, number>();
  const reverseVocab = new Map<number, string>();
  const specialTokens = {
    unk: '<UNK>',
    pad: '<PAD>',
    bos: '<BOS>',
    eos: '<EOS>'
  };

  let nextId = 0;
  let totalTrainingWords = 0;

  // Initialize special tokens first
  Object.values(specialTokens).forEach(token => {
    vocab.set(token, nextId);
    reverseVocab.set(nextId, token);
    nextId++;
  });

  const tokenizeText = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/([.!?,:;()])/g, ' $1 ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(token => token.length > 0);
  };

  const learnVocab = (texts: string[]): void => {
    vocab.clear();
    reverseVocab.clear();
    nextId = 0;
    totalTrainingWords = 0;

    // Re-initialize special tokens
    Object.values(specialTokens).forEach(token => {
      vocab.set(token, nextId);
      reverseVocab.set(nextId, token);
      nextId++;
    });

    const wordFreq = new Map<string, number>();
    
    texts.forEach(text => {
      const tokens = tokenizeText(text);
      totalTrainingWords += tokens.length;
      
      tokens.forEach(token => {
        wordFreq.set(token, (wordFreq.get(token) || 0) + 1);
      });
    });

    const sortedWords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, config.maxVocab - Object.keys(specialTokens).length);

    sortedWords.forEach(([word]) => {
      if (!vocab.has(word)) {
        vocab.set(word, nextId);
        reverseVocab.set(nextId, word);
        nextId++;
      }
    });
  };

  const encode = (text: string): number[] => {
    const tokens = tokenizeText(text);
    return tokens.map(token => {
      return vocab.get(token) ?? vocab.get(specialTokens.unk)!;
    });
  };

  const decode = (tokenIds: number[]): string => {
    const tokens = tokenIds.map(id => {
      const token = reverseVocab.get(id);
      return token || specialTokens.unk;
    });

    const validTokens = tokens.filter(token => 
      !Object.values(specialTokens).includes(token)
    );

    let result = '';
    for (let i = 0; i < validTokens.length; i++) {
      const token = validTokens[i];
      
      if (i > 0 && !/^[.!?,:;()]$/.test(token)) {
        result += ' ';
      }
      
      result += token;
    }
    
    return result.trim();
  };

  const getVocab = (): Map<string, number> => new Map(vocab);
  const getReverseVocab = (): Map<number, string> => new Map(reverseVocab);

  const getStats = (): TokenizerStats => ({
    vocabSize: vocab.size,
    specialTokensCount: Object.keys(specialTokens).length,
    regularWords: vocab.size - Object.keys(specialTokens).length,
    totalTrainingWords
  });

  return {
    specialTokens,
    learnVocab,
    encode,
    decode,
    getVocab,
    getReverseVocab,
    getStats
  };
};

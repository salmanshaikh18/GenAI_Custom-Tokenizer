import type { SpecialTokens, Tokenizer, TokenizerOptions, TokenizerStats } from "../types";

export const createTokenizer = (options: TokenizerOptions = {}): Tokenizer => {
  const vocab = new Map<string, number>();
  const reverseVocab = new Map<number, string>();
  const tokenCount = new Map<string, number>();
  let nextId = 0;

  const specialTokens: SpecialTokens = {
    UNK: '<unk>',
    PAD: '<pad>',
    START: '<start>',
    END: '<end>',
    ...options.specialTokens
  };

  // Initialize special tokens
  Object.values(specialTokens).forEach((token: string) => {
    vocab.set(token, nextId);
    reverseVocab.set(nextId, token);
    nextId++;
  });

  const tokenize = (text: string): string[] => {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word: string) => word.length > 0);
  };

  const learnVocab = (texts: string[]): Map<string, number> => {
    tokenCount.clear();
    
    // Count frequencies
    texts.forEach((text: string) => {
      const words = tokenize(text);
      words.forEach((word: string) => {
        tokenCount.set(word, (tokenCount.get(word) || 0) + 1);
      });
    });

    // Add to vocabulary
    const sortedWords = Array.from(tokenCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, (options.maxVocab || 1000) - nextId);

    sortedWords.forEach(([word]: [string, number]) => {
      if (!vocab.has(word)) {
        vocab.set(word, nextId);
        reverseVocab.set(nextId, word);
        nextId++;
      }
    });

    return tokenCount;
  };

  const encode = (text: string): number[] => {
    const words = tokenize(text);
    const encoded = words.map((word: string) => 
      vocab.get(word) || vocab.get(specialTokens.UNK) || 0
    );
    
    return [
      vocab.get(specialTokens.START) || 0,
      ...encoded,
      vocab.get(specialTokens.END) || 0
    ];
  };

  const decode = (numbers: number[]): string => {
    return numbers
      .map((num: number) => reverseVocab.get(num))
      .filter((word: string | undefined) => word && !Object.values(specialTokens).includes(word))
      .join(' ');
  };

  const getStats = (): TokenizerStats => ({
    vocabSize: vocab.size,
    specialTokensCount: Object.keys(specialTokens).length,
    regularWords: vocab.size - Object.keys(specialTokens).length,
    totalTrainingWords: Array.from(tokenCount.values()).reduce((a, b) => a + b, 0)
  });

  return {
    learnVocab,
    encode,
    decode,
    getStats,
    getVocab: () => vocab,
    getReverseVocab: () => reverseVocab,
    getTokenCount: () => tokenCount,
    specialTokens
  };
};

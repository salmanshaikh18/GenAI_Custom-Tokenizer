export interface TokenizerOptions {
    maxVocab?: number;
    specialTokens?: Record<string, string>;
  }
  
  export interface SpecialTokens {
    UNK: string;
    PAD: string;
    START: string;
    END: string;
    [key: string]: string;
  }
  
  export interface TokenizerStats {
    vocabSize: number;
    specialTokensCount: number;
    regularWords: number;
    totalTrainingWords: number;
  }
  
  export interface TokenInfo {
    id: number;
    token: string;
    isSpecial: boolean;
  }
  
  export interface ResultStatus {
    type: 'success' | 'error' | 'stats' | 'vocab';
    message: string;
    tokens?: TokenInfo[];
  }
  
  export interface Tokenizer {
    learnVocab: (texts: string[]) => Map<string, number>;
    encode: (text: string) => number[];
    decode: (numbers: number[]) => string;
    getStats: () => TokenizerStats;
    getVocab: () => Map<string, number>;
    getReverseVocab: () => Map<number, string>;
    getTokenCount: () => Map<string, number>;
    specialTokens: SpecialTokens;
  }
  
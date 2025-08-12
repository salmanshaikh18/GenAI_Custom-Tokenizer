export interface TokenizerConfig {
  maxVocab: number;
}

export interface TokenizerStats {
  vocabSize: number;
  specialTokensCount: number;
  regularWords: number;
  totalTrainingWords: number;
}

export interface Tokenizer {
  specialTokens: Record<string, string>;
  learnVocab(texts: string[]): void;
  encode(text: string): number[];
  decode(tokenIds: number[]): string;
  getVocab(): Map<string, number>;
  getReverseVocab(): Map<number, string>;
  getStats(): TokenizerStats;
}

export interface TokenInfo {
  id: number;
  token: string;
  isSpecial: boolean;
}

export interface ResultStatus {
  type: 'success' | 'error' | 'info' | 'stats' | 'vocab' | 'special';
  message: string;
  tokens?: TokenInfo[];
}

export type TabType = 'stats' | 'vocab' | 'special';

export const MAX_BATCH_SIZE = 50;
export const MAX_FILE_SIZE_MB = 1;
export const MAX_TEXT_INPUT_LENGTH = 15000;

export enum Sentiment {
  Positive = 'positive',
  Negative = 'negative',
  Neutral = 'neutral',
  Error = 'error',
}

export type ModelName = 'gemini-2.5-flash';

export interface AnalysisResult {
  text: string;
  sentiment: Sentiment;
  confidence: number;
  keywords: string[];
  explanation: string;
  source?: 'A' | 'B';
}

export interface AnalysisResultSet {
    sourceA: AnalysisResult[];
    sourceB?: AnalysisResult[];
}


export enum InputMethod {
  Single = 'Single Text',
  Batch = 'Batch Text (paste)',
  TXT = 'Upload TXT',
  CSV = 'Upload CSV',
}
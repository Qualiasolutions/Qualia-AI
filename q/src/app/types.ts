export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface ThinkingStep {
  id: string;
  content: string;
  type: 'thinking' | 'search' | 'result';
  timestamp: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
} 
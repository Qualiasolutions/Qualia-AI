export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
};

export type ThinkingStep = {
  id: string;
  content: string;
  type: 'thinking' | 'search' | 'result';
  timestamp: Date;
};

export type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

export type ApiResponse = {
  answer: string;
  thinking: ThinkingStep[];
  searchResults: SearchResult[];
}; 
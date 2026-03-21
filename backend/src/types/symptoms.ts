export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SymptomMessageRequest {
  message: string;
  history?: ChatMessage[];
}

export type ActionLevel =
  | 'monitor'
  | 'urgent_care'
  | 'er'
  | 'call_911';

export interface SymptomMessageResponse {
  session_id: string;
  response: string;
  action_level?: ActionLevel;
  likely_cause?: string;
}

import { ChatMessage } from '../types';

// Temporary mock implementation until API key is provided
export class AIService {
  async getResponse(): Promise<ChatMessage> {
    return {
      id: crypto.randomUUID(),
      content: "I'm a mock AI response. Please configure the actual AI service with your API key.",
      sender: 'ai',
      timestamp: Date.now(),
    };
  }
}

export const aiService = new AIService();
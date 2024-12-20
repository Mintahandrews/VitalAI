declare module "@google/generative-ai" {
  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(config: { model: string }): GenerativeModel;
  }

  interface GenerativeModel {
    generateContent(prompt: string): Promise<GenerateContentResult>;
  }

  interface GenerateContentResult {
    response: {
      text(): string;
    };
  }
}

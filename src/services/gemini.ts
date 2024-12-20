import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export { genAI };

export const generateAIResponse = async (
  prompt: string,
  context: Record<string, any>
) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const sanitizedContext = Object.entries(context)
      .filter(([_, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => {
        try {
          acc[key] = JSON.stringify(value);
        } catch (e) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>);

    const contextString = Object.entries(sanitizedContext)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    const fullPrompt = `
      Context:
      ${contextString}

      User Query:
      ${prompt}

      Instructions:
      You are a helpful AI health assistant. Analyze the context and user query to provide a detailed response.
      If analyzing health metrics, format your response as JSON with insights array. Otherwise, provide a natural conversational response.
      
      For health analysis, use this format:
      {
        "insights": [
          {
            "type": "success" | "warning" | "info",
            "title": "Brief insight title",
            "description": "Detailed explanation",
            "recommendation": "actionable suggestion"
          }
        ]
      }

      For general responses, provide clear explanations and specific recommendations when appropriate.
    `;

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // If empty response, throw error
        if (!text.trim()) {
          throw new Error("Empty response from AI");
        }

        return text;
      } catch (error) {
        attempts++;
        if (attempts === maxAttempts) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
      }
    }

    throw new Error("Failed to generate response after multiple attempts");
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response. Please try again later.");
  }
};

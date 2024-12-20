import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { notify } from "../utils/notifications";
import { ChatMessage } from "../types";
import { generateAIResponse } from "../services/gemini";

const QUICK_REPLIES = [
  "How am I doing with my health goals?",
  "I need workout motivation",
  "Suggest a quick workout",
  "How can I improve my sleep?",
  "Give me healthy meal ideas",
  "Help me reduce stress",
];

// Add interface for AI response types
interface AIInsight {
  title: string;
  description: string;
  recommendation?: string;
  type?: string;
  priority?: number;
}

const formatAIResponse = (text: string): string => {
  try {
    // First try to parse as JSON
    const jsonResponse = JSON.parse(text);

    // Format insights into a readable message
    if (Array.isArray(jsonResponse)) {
      return jsonResponse
        .map((insight: AIInsight) => {
          let message = `✨ ${insight.title}\n\n${insight.description}`;
          if (insight.recommendation) {
            message += `\n\n💡 Recommendation:\n${insight.recommendation}`;
          }
          return message;
        })
        .join("\n\n───────────────\n\n");
    }

    // Handle structured response with insights array
    if (jsonResponse.insights) {
      return jsonResponse.insights
        .map((insight: AIInsight) => {
          const prefix =
            insight.type === "warning"
              ? "⚠️ "
              : insight.type === "success"
              ? "✅ "
              : insight.type === "info"
              ? "ℹ️ "
              : "💫 ";

          let message = `${prefix} ${insight.title}\n\n${insight.description}`;
          if (insight.recommendation) {
            message += `\n\n💡 Recommendation:\n${insight.recommendation}`;
          }
          return message;
        })
        .join("\n\n───────────────\n\n");
    }

    // If JSON but not in expected format, format it nicely
    return Object.entries(jsonResponse)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
  } catch {
    // If not JSON, format the text for better readability
    let formattedText = text
      // Clean up any markdown or unwanted syntax
      .replace(/[*_~`#]/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")

      // Fix spacing and line breaks
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .replace(/\s+/g, " ")
      .replace(/\n +/g, "\n")

      // Format lists
      .replace(/^[-•*+]\s*/gm, "• ")
      .replace(/^\d+\.\s+/gm, "• ")

      // Add emoji to lists if none present
      .replace(/^• ([^💡✨⚠️✅ℹ️💫🎯🎉💪])/gm, "• 💫 $1")

      // Format sections
      .replace(/^(Tips|Steps|Benefits|Note|Remember):/gm, "\n💡 $1:\n")

      // Add spacing around sections
      .replace(/\n(💡 .*:)\n/g, "\n\n$1\n\n")

      // Clean up final spacing
      .trim()
      .replace(/\n{3,}/g, "\n\n");

    // Add greeting emoji if it's a greeting
    if (
      formattedText.toLowerCase().includes("hello") ||
      formattedText.toLowerCase().includes("hi")
    ) {
      formattedText = `👋 ${formattedText}`;
    }

    return formattedText;
  }
};

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem("chatMessages");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        const welcomeMessage: ChatMessage = {
          id: uuidv4(),
          content:
            "Hello! 👋 I'm your personal health and fitness assistant. I can help you with workout suggestions, health tips, and motivation. How can I assist you today?",
          sender: "ai",
          timestamp: Date.now(),
        };
        setMessages([welcomeMessage]);
        localStorage.setItem("chatMessages", JSON.stringify([welcomeMessage]));
      }
    } catch (error) {
      console.error("Error loading chat messages:", error);
      notify.error("Error loading chat history");

      // Set default welcome message if loading fails
      const welcomeMessage: ChatMessage = {
        id: uuidv4(),
        content: "Hello! How can I help you today?",
        sender: "ai",
        timestamp: Date.now(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: input,
      sender: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => {
      const newMessages = [...prev, userMessage];
      try {
        localStorage.setItem("chatMessages", JSON.stringify(newMessages));
      } catch (error) {
        console.error("Error saving messages:", error);
      }
      return newMessages;
    });
    setInput("");
    setLoading(true);

    try {
      let context = {
        metrics: [],
        profile: null,
        goals: [],
      };

      try {
        context = {
          metrics: JSON.parse(localStorage.getItem("healthMetrics") || "[]"),
          profile: JSON.parse(localStorage.getItem("userProfile") || "null"),
          goals: JSON.parse(localStorage.getItem("healthGoals") || "[]"),
        };
      } catch (error) {
        console.error("Error loading context:", error);
        notify.error("Error loading user data");
      }

      const aiResponse = await generateAIResponse(input, context);

      if (!aiResponse?.trim()) {
        throw new Error("Empty response from AI");
      }

      const formattedResponse = formatAIResponse(aiResponse);
      const finalResponse =
        formattedResponse?.trim() ||
        "I apologize, but I couldn't generate a proper response. Please try asking your question differently.";

      const aiMessage: ChatMessage = {
        id: uuidv4(),
        content: finalResponse,
        sender: "ai",
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const newMessages = [...prev, aiMessage];
        try {
          localStorage.setItem("chatMessages", JSON.stringify(newMessages));
        } catch (error) {
          console.error("Error saving messages:", error);
        }
        return newMessages;
      });
    } catch (error) {
      console.error("Failed to get AI response:", error);
      notify.error("Failed to get AI response. Please try again.");

      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: "I apologize, but I encountered an error. Please try again.",
        sender: "ai",
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const newMessages = [...prev, errorMessage];
        try {
          localStorage.setItem("chatMessages", JSON.stringify(newMessages));
        } catch (error) {
          console.error("Error saving messages:", error);
        }
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
  };

  const clearChat = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear the chat history?"
    );
    if (confirmClear) {
      const welcomeMessage: ChatMessage = {
        id: uuidv4(),
        content: "Chat history cleared. How can I help you today?",
        sender: "ai",
        timestamp: Date.now(),
      };
      setMessages([welcomeMessage]);
      localStorage.setItem("chatMessages", JSON.stringify([welcomeMessage]));
      notify.success("Chat history cleared");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg min-h-[600px] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">AI Health Assistant</h2>
            <p className="text-sm text-gray-500">Powered by Gemini</p>
          </div>
          <button
            onClick={clearChat}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Clear Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-50 border border-gray-100"
                }`}
              >
                {message.sender === "ai" ? (
                  <div className="space-y-4">
                    {message.content.split("\n\n").map((block, idx) => (
                      <div key={idx} className="leading-relaxed">
                        {block.startsWith("• ") ? (
                          <div className="flex items-start gap-2 pl-2">
                            <span className="text-indigo-600 mt-1">•</span>
                            <span className="text-gray-700">
                              {block.substring(2)}
                            </span>
                          </div>
                        ) : block.includes("💡") ? (
                          <div className="bg-indigo-50 p-3 rounded-md text-gray-700">
                            {block}
                          </div>
                        ) : block.includes("───────────────") ? (
                          <div className="my-4 border-t border-gray-200" />
                        ) : (
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {block}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}
                <div
                  className={`text-xs mt-2 text-right ${
                    message.sender === "user"
                      ? "text-white/70"
                      : "text-gray-500"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => handleQuickReply(reply)}
                className="flex-shrink-0 px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              disabled={!input.trim() || loading}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;

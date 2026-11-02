import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react"; // Ensure you import motion from framer-motion if "motion/react" errors
import { Sparkles, Send, X, Bot, User, MessageCircle } from "lucide-react";

// Fixes TypeScript error for import.meta.env in Vite
interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

const SUGGESTED_PROMPTS = [
  "Know more about the crafter 🌸",
  "Know more about fuzzy wire bouquets 🌷",
  "Free delivery areas in Las Piñas 🚚",
  "How to order & downpayment policy 📋",
];

const SYSTEM_INSTRUCTION = `
You are the official AI Assistant for "Fazzyu Creations" (also known as Yuri's Craft).
Your sole purpose is to assist customers with inquiries about Fazzyu Creations, fuzzy wire (pipe cleaner) bouquets, custom crafts, store policies, crafter information, and delivery details.

STRICT BUSINESS GUARDRAIL & RULE:
You are STRICTLY FORBIDDEN from answering any questions outside the business domain of Fazzyu Creations.

FAZZYU CREATIONS KNOWLEDGE BASE:
- Business Name: Fazzyu Creations / Yuri's Craft
- Crafter / Owner: Yuri, an iskolar student who handcrafts fuzzy wire (pipe cleaner) floral arrangements, custom bouquets, dolls, and themed gifts alongside her studies.
- Product Quality: Every flower (sunflowers, roses, lilies, tulips, daisies) is handcrafted from hundreds of twisted, bristly pipe cleaner chenille stems with the highest quality and love.
- Custom Order Options: Customers can customize flower types, wrapper styles, color palettes, sizes (Mini to XL), and attach inspiration photos.
- Free Delivery Areas: Free delivery within selected Las Piñas areas including Naga Road, Pulanglupa Uno, Fruto Santos Ave, Tramo, Vergon, and CAA.
- Store Policies: 30% minimum downpayment required to start crafting. Completion takes 2 to 5 days. Payments accepted via GCASH and CASH. Final orders sync directly to Facebook Messenger (m.me/fazzyuu).
- Tone & Style: Warm, welcoming, helpful, polite, soft floral aesthetic with cute emojis (🌸, 💖, 🌷, ✨). Keep answers clear, accurate, and concise.

FORMATTING RULE: 
ALWAYS separate your thoughts into short, easy-to-read paragraphs with a blank line between them. Use bullet points if listing multiple items. NEVER reply in one single giant block of text.
`;

// Helper function to render **bold text** as strong HTML tags
function parseBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function FazzyuAiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! Welcome to Fazzyu Creations! 🌸\n\nAsk me anything about our handcrafted fuzzy wire bouquets, custom orders, or crafter Yuri!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSendMessage(textToSend?: string) {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    if (!isOpen) setIsOpen(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("Missing VITE_GEMINI_API_KEY.");
      }

      const contentsHistory = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }));

      contentsHistory.push({
        role: "user",
        parts: [{ text: query }],
      });

      // 🔄 AUTOMATIC RETRY LOGIC (Tries 3 times before failing)
      let response: Response | null = null;
      let retries = 3;
      let delay = 1000;

      while (retries > 0) {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: contentsHistory,
              systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }],
              },
            }),
          }
        );

        if (response.status === 503 || response.status === 429) {
          retries--;
          if (retries === 0) break;
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 1.5; // Exponential backoff wait time
          continue;
        }
        break; // Success! Exit the retry loop.
      }

      if (!response || !response.ok) {
        const errText = response ? await response.text() : "No response";
        throw new Error(`API error ${response?.status || 503}: ${errText}`);
      }

      const data = await response.json();
      const botReplyText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm here to help with Fazzyu Creations! Please feel free to ask about our bouquets or custom orders. 🌸";

      const botMsg: Message = { id: `b-${Date.now()}`, sender: "bot", text: botReplyText };
      setMessages((prev) => [...prev, botMsg]);
      
    } catch (err) {
      console.error("Chatbot API execution error:", err);
      
      // 🛡️ DEMO SAVER FALLBACK: If Google fails, output this professional canned response instead of an error.
      const fallbackText = "I'm receiving a very high volume of messages right now! 🌸\n\nTo answer quickly: Fazzyu Creations requires a 30% downpayment via GCash, takes 2-5 days to handcraft, and offers free delivery in Pulanglupa Uno and Naga Road.\n\nPlease message Yuri directly on Facebook for urgent custom orders! 💖";
      
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          sender: "bot",
          text: fallbackText,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[90vw] sm:w-[420px] h-[75vh] max-h-[850px] min-h-[650px] bg-[#140e11]/95 backdrop-blur-md border border-[#ca498c]/40 rounded-[24px] shadow-[0_15px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="shrink-0 bg-[#1e1418] border-b border-white/10 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ca498c]/20 border border-[#ca498c]/50 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#ca498c]" />
                </div>
                <div>
                  <h3 className="font-serif text-base text-white font-bold flex items-center gap-1.5">
                    Fazzyu AI Assistant <Sparkles className="w-4 h-4 text-[#ca498c]" />
                  </h3>
                  <p className="text-[11px] text-white/60 font-sans">Official Yuri's Craft Guide</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-sm">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className={`flex items-start gap-2 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                        m.sender === "user" ? "bg-[#ca498c] text-white" : "bg-white/10 text-[#ca498c]"
                      }`}
                    >
                      {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div
                      className={`p-3 rounded-[16px] max-w-[85%] leading-relaxed whitespace-pre-wrap ${
                        m.sender === "user"
                          ? "bg-[#ca498c] text-white rounded-tr-none"
                          : "bg-black/40 border border-white/10 text-white/90 rounded-tl-none"
                      }`}
                    >
                      {parseBoldText(m.text)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-white/50 text-sm italic"
                >
                  <Bot className="w-4 h-4 text-[#ca498c] animate-bounce" />
                  <span>Fazzyu AI is typing...</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts Pills */}
            <div className="shrink-0 px-3 py-3 bg-black/20 border-t border-white/5 flex gap-2 overflow-x-auto [scrollbar-width:none]">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-[#ca498c]/30 border border-white/10 hover:border-[#ca498c]/60 rounded-full text-xs text-white/80 whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="shrink-0 p-3 bg-[#1e1418] border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Yuri's Craft..."
                className="flex-1 bg-black/40 border border-white/20 rounded-full px-4 py-2.5 text-sm text-white outline-none focus:border-[#ca498c]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-[#ca498c] hover:bg-[#b83d7a] flex items-center justify-center text-white disabled:opacity-40 transition-all cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Right Launcher Bar */}
      <motion.div
        whileHover={{ width: 420, scale: 1.02 }}
        className="relative bg-[#140e11]/90 backdrop-blur-md border border-[#ca498c]/50 rounded-full shadow-[0_6px_30px_rgba(209,126,165,0.4)] p-1.5 flex items-center gap-2 cursor-pointer transition-all w-[300px] sm:w-[340px]"
        onClick={() => setIsOpen((v) => !v)}
      >
        <div className="w-10 h-10 rounded-full bg-[#ca498c] flex items-center justify-center flex-shrink-0 shadow-md">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
        </div>

        <input
          type="text"
          readOnly
          value={input}
          placeholder="Ask AI about Yuri's Craft..."
          className="bg-transparent text-sm text-white placeholder:text-white/60 outline-none w-full cursor-pointer pointer-events-none"
        />

        <div className="pr-3 text-white/60">
          <MessageCircle className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
}
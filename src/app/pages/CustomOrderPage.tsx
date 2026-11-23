import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Upload, X, Sparkles, Send, AlertCircle,
  Plus, Minus, Loader2, Bot, User, ImageIcon, RefreshCw, Check,
  Camera, QrCode, Download, Copy
} from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { useAppData, supabase } from "@/app/context/AppDataContext";
import {
  PHOTOBOOTH_PRESETS,
  getPresetById,
  encodePhotoboothQR,
  encodePhotoboothCode,
} from "@/app/utils/photoboothThemes";

const CATEGORIES = ["Bouquets", "Themed", "Dolls", "Crafts"];
const SIZE_OPTIONS = ["Mini", "Small", "Medium", "Large", "Extra Large / Custom"];

const CHATBOT_PROMPT_ENGINEER_SYSTEM = `
You are the AI Co-Designer for "Fazzyu" (Yuri's Craft). Your job is to chat with customers and help them design custom fuzzy wire (pipe cleaner) bouquets.

IMPORTANT CONDITIONAL RULE:
1. If the user just says "Hi", "Hello", or asks a general question, ONLY reply with a friendly chat message. DO NOT generate an image prompt.
2. If the user explicitly describes a bouquet design, lists flowers, or asks to "generate an image/concept", you MUST write a highly detailed "cloudflare_prompt" for image generation.

CRITICAL RULE FOR THE CLOUDFLARE PROMPT (WHEN GENERATING):
To ensure the image generator produces a 100% handmade fuzzy wire craft, use these exact rules:
- Describe the material: "A densely constructed DIY craft bouquet built entirely from hundreds of twisted, coiled, and folded fluffy pipe cleaner chenille stems. The surface is visibly bristly, hairy, and deeply fuzzy."
- Form: "Created by bundling, twisting, and weaving numerous bristly fuzzy wires. Visible complex wire structure, coiled stems, zero smooth surfaces, zero real flowers, zero silk."
- Specify exactly what they asked for (e.g., lilies, tulips, daisies).
- Lighting: "Cozy indoor studio lighting, macro product photograph highlighting the dense tangle of bristly pipe cleaner pile."
- Make sure every flower and leaf is clearly distinguishable as fuzzy wire strands.

Output your response STRICTLY in this JSON format. If no image generation is needed, set "cloudflare_prompt" to null or an empty string.
{
  "chat_response": "Your friendly message here...",
  "cloudflare_prompt": "YOUR HYPER-DETAILED CRAFT PROMPT HERE (OR null IF NOT NEEDED)"
}
`;

type ChatMessage = {
  id: string;
  sender: "bot" | "user";
  text: string;
  imageUrl?: string;
};

type AiConceptModalState = {
  isOpen: boolean;
  imageUrl: string | null;
  prompt: string;
  isAdded: boolean;
};

export default function CustomOrderPage() {
  const {
    customizedMaterials,
    submitNormalizedCustomOrder,
    savePhotoboothQrCode,
    createChatSession,
    logChatMessage,
  } = useAppData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const photoboothSectionRef = useRef<HTMLDivElement>(null);

  // Form State
  const [category, setCategory] = useState("Bouquets");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [themeInput, setThemeInput] = useState("");
  const [size, setSize] = useState("Medium");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [aiConceptsLog, setAiConceptsLog] = useState<{ prompt: string; imageUrl: string }[]>([]);
  const [usedAiChat, setUsedAiChat] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");

  // AI Chat & Modal State
  const [chatSessionId, setChatSessionId] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "w-1", sender: "bot", text: "Hi there! I'm your AI Co-Designer. Describe your dream bouquet, and I'll generate a concept image for you!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);

  // Generated Concept Pop-up Modal
  const [aiModal, setAiModal] = useState<AiConceptModalState>({
    isOpen: false,
    imageUrl: null,
    prompt: "",
    isAdded: false,
  });

  // Standalone Customized Photobooth State
  const [pbPresetId, setPbPresetId] = useState<string>(PHOTOBOOTH_PRESETS[0].id);
  const [pbBannerTitle, setPbBannerTitle] = useState("Happy Special Day! 🌸");
  const [pbBannerSubtitle, setPbBannerSubtitle] = useState("Handcrafted with love by Yuri's Craft");
  const [pbAutoStickers, setPbAutoStickers] = useState(true);
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState<string | null>(null);
  const [generatedShareCode, setGeneratedShareCode] = useState<string | null>(null);
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  const flowers = customizedMaterials.filter((m) => m.category === "flower");
  const wrappers = customizedMaterials.filter((m) => m.category === "wrapper");
  const selectedPbPreset = getPresetById(pbPresetId);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiThinking, isImageGenerating]);

  useEffect(() => {
    if (searchParams.get("section") === "photobooth") {
      setTimeout(() => {
        photoboothSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [searchParams]);

  function scrollToCustomizedPhotobooth() {
    photoboothSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleQuantityChange(id: string, delta: number) {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: Math.max(0, current + delta) };
    });
  }

  const materialsPrice = customizedMaterials.reduce((sum, mat) => sum + (mat.price * (quantities[mat.id] || 0)), 0);
  const totalPrice = materialsPrice;

  function resetGeneratedOutputs() {
    setGeneratedQrDataUrl(null);
    setGeneratedShareCode(null);
    setIsCodeCopied(false);
  }

  // --- CUSTOMIZED PHOTOBOOTH QR & ALTERNATIVE CODE GENERATOR --- //
  async function handleGeneratePhotoboothQR() {
    setIsGeneratingQr(true);
    try {
      const payloadObj = {
        v: 1 as const,
        app: "fazzyu-pb" as const,
        presetId: pbPresetId,
        title: pbBannerTitle.trim() || selectedPbPreset.name,
        subtitle: pbBannerSubtitle.trim(),
        autoStickers: pbAutoStickers,
      };

      const qrPayload = encodePhotoboothQR(payloadObj);
      const shareCode = encodePhotoboothCode(payloadObj);

      const qrDataUrl = await QRCode.toDataURL(qrPayload, {
        width: 512,
        margin: 4,
        errorCorrectionLevel: "M",
        color: {
          dark: "#140e11",
          light: "#ffffff",
        },
      });

      // Persist generated QR & share code to Supabase `photobooth_qr_code`
      await savePhotoboothQrCode({
        shareCode,
        presetId: pbPresetId,
        bannerTitle: payloadObj.title,
        bannerSubtitle: payloadObj.subtitle,
        autoStickers: pbAutoStickers,
      });

      setGeneratedQrDataUrl(qrDataUrl);
      setGeneratedShareCode(shareCode);
      setIsCodeCopied(false);
      toast.success("Photobooth QR & pasteable code saved and ready!");
    } catch (err) {
      console.error("QR generation failed:", err);
      toast.error("Could not generate QR/code. Try shortening your banner text.");
    } finally {
      setIsGeneratingQr(false);
    }
  }

  async function handleCopyShareCode() {
    if (!generatedShareCode) return;
    try {
      await navigator.clipboard.writeText(generatedShareCode);
      setIsCodeCopied(true);
      toast.success("Photobooth code copied to clipboard!");
      setTimeout(() => setIsCodeCopied(false), 2500);
    } catch {
      toast.error("Could not copy automatically. Please select and copy the code manually.");
    }
  }

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // --- AI INTEGRATION LOGIC --- //
  async function triggerAiGeneration(userPrompt: string) {
    if (!userPrompt.trim()) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast.error("AI API Key missing in environment variables.");
      return;
    }

    setAiModal((prev) => ({ ...prev, isOpen: false }));
    setUsedAiChat(true);

    // Ensure a `chat_session` row exists in Supabase and log customer message
    let activeSessionId = chatSessionId;
    if (!activeSessionId) {
      activeSessionId = await createChatSession();
      setChatSessionId(activeSessionId);
    }
    logChatMessage(activeSessionId, "Customer", userPrompt);

    const newMsgId = `u-${Date.now()}`;
    setChatMessages((prev) => [...prev, { id: newMsgId, sender: "user", text: userPrompt }]);
    setChatInput("");
    setIsAiThinking(true);

    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: CHATBOT_PROMPT_ENGINEER_SYSTEM }] },
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        throw new Error(`Gemini API Error (${geminiRes.status}): ${errText}`);
      }

      const geminiData = await geminiRes.json();
      let rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) throw new Error("Empty response from Gemini AI.");

      rawText = rawText.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
      const parsedAi = JSON.parse(rawText);

      const botMsgId = `b-${Date.now()}`;
      setChatMessages((prev) => [...prev, { id: botMsgId, sender: "bot", text: parsedAi.chat_response }]);
      logChatMessage(activeSessionId, "AI", parsedAi.chat_response);
      setIsAiThinking(false);

      if (parsedAi.cloudflare_prompt && parsedAi.cloudflare_prompt.trim() !== "" && parsedAi.cloudflare_prompt !== "null") {
        setIsImageGenerating(true);
        const cfRes = await fetch("https://withered-boat-9829.gata-andrie.workers.dev", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: parsedAi.cloudflare_prompt })
        });

        if (!cfRes.ok) {
          const cfErr = await cfRes.text();
          throw new Error(`Cloudflare Generation Failed: ${cfErr}`);
        }

        const contentType = cfRes.headers.get("content-type") || "";
        let finalImageUrl = "";

        if (contentType.includes("application/json")) {
          const json = await cfRes.json();
          const b64 = json.image || json.result || json.response;
          finalImageUrl = b64.startsWith("data:") ? b64 : `data:image/jpeg;base64,${b64}`;
        } else {
          const blob = await cfRes.blob();
          finalImageUrl = await blobToBase64(blob);
        }

        setChatMessages((prev) => [
          ...prev,
          { id: `img-${Date.now()}`, sender: "bot", text: "Here is your generated concept! ✨", imageUrl: finalImageUrl }
        ]);
        logChatMessage(activeSessionId, "AI", "Generated AI bouquet concept image.");

        setAiModal({
          isOpen: true,
          imageUrl: finalImageUrl,
          prompt: parsedAi.cloudflare_prompt,
          isAdded: false,
        });

        toast.success("AI Concept generated!");
      }
    } catch (error) {
      console.error("AI Pipeline Error:", error);
      toast.error("AI Generation encountered an error.");
      setChatMessages((prev) => [...prev, { id: `err-${Date.now()}`, sender: "bot", text: "I'm sorry, my design engine encountered an error. Please try again." }]);
    } finally {
      setIsAiThinking(false);
      setIsImageGenerating(false);
    }
  }

  function handleFormToAi() {
    const selectedMaterialsSummary = customizedMaterials
      .filter((m) => (quantities[m.id] || 0) > 0)
      .map((m) => `${quantities[m.id]}x ${m.name}`)
      .join(", ");

    let prompt = `I am designing a custom ${size} ${category}. `;
    if (selectedMaterialsSummary) prompt += `I want it to include these materials: ${selectedMaterialsSummary}. `;
    if (themeInput) prompt += `The theme should be: ${themeInput}. `;
    if (description) prompt += `Additional details: ${description}. `;

    prompt += `Please generate an image concept for this exact design.`;

    if (prompt.includes("Please generate an image concept") && !selectedMaterialsSummary && !description) {
      toast.info("Please select some flowers or add a description first!");
      return;
    }

    triggerAiGeneration(prompt);
  }

  function handleAddConceptToInspo() {
    if (!aiModal.imageUrl) return;
    if (!images.includes(aiModal.imageUrl)) {
      setImages((prev) => [...prev, aiModal.imageUrl!]);
      setAiConceptsLog((prev) => [...prev, { prompt: aiModal.prompt, imageUrl: aiModal.imageUrl! }]);
      setAiModal((prev) => ({ ...prev, isAdded: true }));
      toast.success("Added concept to your Inspiration Board!");
    } else {
      toast.info("This concept is already in your inspiration board.");
    }
  }

  // --- UPLOADER HELPERS --- //
  async function uploadLocalImageToSupabase(url: string): Promise<string> {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const fileExt = blob.type.split("/")[1] || "jpeg";
      const fileName = `inspo-ai-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `inspo/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("images").upload(filePath, blob, {
        contentType: blob.type || "image/jpeg",
      });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("images").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      console.error("Error uploading image to Supabase:", err);
      return url;
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `inspo-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `inspo/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        newUrls.push(data.publicUrl);
      }
      setImages((prev) => [...prev, ...newUrls]);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload inspiration pictures.");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName.trim() || !customerContact.trim()) {
      toast.error("Please fill in your name and contact information.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading inspiration pictures & preparing order...");

    try {
      const publicImageUrls = await Promise.all(
        images.map((img) => uploadLocalImageToSupabase(img))
      );

      const uploadedAiConcepts = await Promise.all(
        aiConceptsLog.map(async (c) => ({
          prompt: c.prompt,
          imageUrl: await uploadLocalImageToSupabase(c.imageUrl),
        }))
      );

      const orderId = `#YC-CUST-${Math.floor(1000 + Math.random() * 9000)}`;
      const selectedMaterialsList = customizedMaterials
        .filter((m) => (quantities[m.id] || 0) > 0)
        .map((m) => ({
          materialId: m.id,
          name: m.name,
          quantity: quantities[m.id],
        }));

      const selectedMaterialsSummary = selectedMaterialsList
        .map((m) => `${m.quantity}x ${m.name}`)
        .join(", ");

      let compiledTitle = `Custom ${category}`;
      let compiledDefinition = `Size: ${size}`;
      if (category === "Bouquets") {
        compiledDefinition += ` | Materials: ${selectedMaterialsSummary || "None selected"}`;
      } else if (category === "Themed") {
        compiledDefinition += ` | Theme: ${themeInput}`;
      }

      // Save across normalized 3NF tables: `customer`, `customization_inquiry`, `inquiry_material`, `reference_image`, `ai_design`, `orders`
      await submitNormalizedCustomOrder({
        orderId,
        title: compiledTitle,
        price: totalPrice,
        category,
        size,
        themeInput,
        description: description || "Custom client request.",
        definition: compiledDefinition,
        customerName,
        customerContact,
        customerAddress,
        notes,
        selectedMaterials: selectedMaterialsList.map((m) => ({
          materialId: m.materialId,
          quantity: m.quantity,
        })),
        images: publicImageUrls,
        aiConcepts: uploadedAiConcepts,
        submissionMethod: usedAiChat ? "AI Chat" : "Form",
      });

      let inspoText = "";
      if (publicImageUrls.length > 0) {
        inspoText = `\n\nInspiration / Concept Images:\n` + publicImageUrls.map((url, i) => `${i + 1}. ${url}`).join("\n");
      }

      const summaryText = encodeURIComponent(
        `Hello! I just submitted a Custom Order on your website!\n\nOrder ID: ${orderId}\nCategory: ${category}\nDetails: ${compiledDefinition}\nTotal Price: ₱${totalPrice}\nName: ${customerName}\nContact: ${customerContact}${inspoText}`
      );

      toast.dismiss(toastId);
      toast.success("Custom order submitted successfully!");
      window.open(`https://m.me/fazzyuu?text=${summaryText}`, "_blank");
      navigate("/shop");
    } catch (err) {
      console.error("Order submit error:", err);
      toast.dismiss(toastId);
      toast.error("Failed to submit custom order. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="bg-[#1E1518] min-h-screen text-white font-sans selection:bg-[#ca498c] selection:text-white pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 lg:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </button>

          <button
            type="button"
            onClick={scrollToCustomizedPhotobooth}
            className="px-4 py-2 rounded-full bg-[#ca498c]/20 hover:bg-[#ca498c] border border-[#ca498c] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-[0_4px_20px_rgba(202,73,140,0.3)] transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" /> Customized Photobooth
          </button>
        </div>

        <div className="mb-8">
          <h1 className="font-serif text-2xl sm:text-4xl text-white flex items-center gap-2.5 sm:gap-3">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-[#ca498c] flex-shrink-0" /> Customize Your Creation
          </h1>
          <p className="text-white/70 text-xs sm:text-sm mt-2">Design your personalized masterpiece manually, or let our AI generate a concept for you!</p>
        </div>

        {/* ── CUSTOMIZED ORDER FORM ── */}
        <form onSubmit={handleSubmitOrder} className="space-y-6 sm:space-y-8">
          {/* ── AI Co-Designer Studio ── */}
          <div className="bg-[#1a1316] border border-[#ca498c]/40 rounded-[20px] overflow-hidden shadow-[0_10px_40px_rgba(209,126,165,0.15)] flex flex-col">
            <div className="bg-[#ca498c]/10 border-b border-[#ca498c]/30 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
              <h2 className="font-serif text-base sm:text-lg text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#ca498c]" /> AI Co-Designer Studio
              </h2>
              <span className="text-[10px] bg-[#ca498c] px-2 py-1 rounded-full uppercase tracking-widest font-bold">Beta</span>
            </div>

            <div className="p-3.5 sm:p-4 h-[260px] sm:h-[280px] overflow-y-auto space-y-4 font-sans text-sm bg-black/20">
              <AnimatePresence initial={false}>
                {chatMessages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2.5 sm:gap-3 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${m.sender === "user" ? "bg-[#ca498c] text-white" : "bg-white/10 text-[#ca498c]"}`}>
                      {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col gap-2 max-w-[82%] sm:max-w-[80%]">
                      {m.text && (
                        <div className={`p-3 rounded-[16px] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${m.sender === "user" ? "bg-[#ca498c] text-white rounded-tr-none" : "bg-[#140e11] border border-white/10 text-white/90 rounded-tl-none"}`}>
                          {m.text}
                        </div>
                      )}
                      {m.imageUrl && (
                        <div className="rounded-[16px] overflow-hidden border border-white/20 shadow-lg cursor-pointer hover:border-[#ca498c] transition-colors" onClick={() => setAiModal({ isOpen: true, imageUrl: m.imageUrl!, prompt: chatInput, isAdded: images.includes(m.imageUrl!) })}>
                          <img src={m.imageUrl} alt="AI Generated Concept" className="w-full h-auto object-cover max-h-[250px]" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {(isAiThinking || isImageGenerating) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-white/50 text-xs sm:text-sm italic">
                  <Loader2 className="w-4 h-4 text-[#ca498c] animate-spin" />
                  <span>{isImageGenerating ? "Crafting your fuzzy wire image..." : "AI is thinking..."}</span>
                </motion.div>
              )}
              <div ref={chatScrollRef} />
            </div>

            <div className="p-3 bg-[#140e11] border-t border-white/10 flex items-center gap-2 min-w-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), triggerAiGeneration(chatInput))}
                placeholder="Ask AI to design a bouquet..."
                className="flex-1 min-w-0 bg-black/40 border border-white/20 rounded-full px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-[#ca498c]"
              />
              <button
                type="button"
                onClick={() => triggerAiGeneration(chatInput)}
                disabled={!chatInput.trim() || isAiThinking || isImageGenerating}
                className="w-10 h-10 rounded-full bg-[#ca498c] hover:bg-[#b83d7a] flex items-center justify-center text-white disabled:opacity-40 transition-all cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-4 sm:p-6 space-y-4 shadow-xl">
            <h2 className="font-serif text-lg sm:text-xl text-white/90">1. Choose Creation Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-[12px] font-medium text-xs sm:text-sm transition-all cursor-pointer border ${category === cat ? "bg-[#ca498c] border-[#ca498c] text-white shadow-[0_4px_20px_rgba(209,126,165,0.4)]" : "bg-black/30 border-white/10 text-white/70 hover:border-white/30 hover:text-white"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {category === "Bouquets" && (
            <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-4 sm:p-6 space-y-5 sm:space-y-6 shadow-xl">
              <h2 className="font-serif text-lg sm:text-xl text-white/90">2. Select Flowers & Quantities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 max-h-[420px] overflow-y-auto pr-1">
                {flowers.map((flower) => {
                  const qty = quantities[flower.id] || 0;
                  const isSelected = qty > 0;
                  return (
                    <div key={flower.id} className={`flex flex-col items-center p-2.5 sm:p-3 rounded-[14px] transition-all border text-center ${isSelected ? "bg-[#ca498c]/20 border-[#ca498c] shadow-[0_0_15px_rgba(209,126,165,0.2)]" : "bg-black/30 border-white/10"}`}>
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[10px] overflow-hidden mb-2 border border-white/20 bg-black/40">
                        {flower.image ? <img src={flower.image} alt={flower.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No Img</div>}
                      </div>
                      <span className="text-xs font-medium text-white leading-tight mb-2.5 sm:mb-3">{flower.name}</span>
                      <div className="flex items-center gap-2 bg-black/50 px-2.5 py-1 rounded-full border border-white/10">
                        <button type="button" onClick={() => handleQuantityChange(flower.id, -1)} className="text-white/70 hover:text-white p-0.5"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-medium text-white w-4">{qty}</span>
                        <button type="button" onClick={() => handleQuantityChange(flower.id, 1)} className="text-white/70 hover:text-white p-0.5"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {category === "Themed" && (
            <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-4 sm:p-6 space-y-4 shadow-xl">
              <h2 className="font-serif text-lg sm:text-xl text-white/90">2. Theme Specification</h2>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-white/80 mb-2">What theme do you want?</label>
                <input type="text" value={themeInput} onChange={(e) => setThemeInput(e.target.value)} placeholder="e.g. Graduation, Valentine's..." className="w-full h-11 sm:h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]" />
              </div>
            </div>
          )}

          {(category === "Dolls" || category === "Crafts") && (
            <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-4 sm:p-6 space-y-4 shadow-xl">
              <h2 className="font-serif text-lg sm:text-xl text-white/90">2. {category} Details</h2>
              <p className="text-xs text-white/60">Describe your custom concept thoroughly in the description box below!</p>
            </div>
          )}

          <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-4 sm:p-6 space-y-5 sm:space-y-6 shadow-xl">
            <h2 className="font-serif text-lg sm:text-xl text-white/90">3. Select Wrapping Style & Size</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-white/80 mb-2">Bouquet / Item Size</label>
                <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full h-11 sm:h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]">
                  {SIZE_OPTIONS.map((s) => <option key={s} value={s} className="bg-[#140e11] text-white">{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/80 mb-3">Wrappers (Select quantities)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {wrappers.map((wrap) => {
                  const qty = quantities[wrap.id] || 0;
                  const isSelected = qty > 0;
                  return (
                    <div key={wrap.id} className={`flex flex-col items-center p-2.5 sm:p-3 rounded-[14px] transition-all border text-center ${isSelected ? "bg-[#ca498c]/20 border-[#ca498c] shadow-[0_0_15px_rgba(209,126,165,0.2)]" : "bg-black/30 border-white/10"}`}>
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[10px] overflow-hidden mb-2 border border-white/20 bg-black/40">
                        {wrap.image ? <img src={wrap.image} alt={wrap.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No Img</div>}
                      </div>
                      <span className="text-xs font-medium text-white leading-tight mb-2.5 sm:mb-3">{wrap.name}</span>
                      <div className="flex items-center gap-2 bg-black/50 px-2.5 py-1 rounded-full border border-white/10">
                        <button type="button" onClick={() => handleQuantityChange(wrap.id, -1)} className="text-white/70 hover:text-white p-0.5"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-medium text-white w-4">{qty}</span>
                        <button type="button" onClick={() => handleQuantityChange(wrap.id, 1)} className="text-white/70 hover:text-white p-0.5"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/80 mb-2">Order Description & Instructions</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe specific requests..." className="w-full bg-black/40 border border-white/20 rounded-[10px] p-3.5 sm:p-4 text-sm text-white outline-none focus:border-[#ca498c] resize-none" />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1">Inspiration Pictures (AI Concepts Auto-Added)</label>
              <p className="text-xs text-white/50 mb-3">Attach reference photos so we can match your vision!</p>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                <button type="button" onClick={() => fileRef.current?.click()} disabled={isUploading} className="w-24 h-24 sm:w-28 sm:h-28 border border-dashed border-white/30 rounded-[12px] flex flex-col items-center justify-center gap-2 hover:border-[#ca498c] transition-colors cursor-pointer bg-black/20 disabled:opacity-50">
                  {isUploading ? <Loader2 className="w-5 h-5 text-white/60 animate-spin" /> : <Upload className="w-5 h-5 text-white/60" />}
                  <span className="text-[11px] text-white/70">{isUploading ? "Uploading..." : "Upload"}</span>
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                {images.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[12px] overflow-hidden border border-white/20 bg-black/40">
                    <img src={src} alt="Inspo" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-red-600"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-4 sm:p-6 space-y-4 shadow-xl">
            <h2 className="font-serif text-lg sm:text-xl text-white/90">4. Your Information & Delivery Card</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs sm:text-sm font-medium text-white/80 mb-1">Full Name *</label><input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full h-11 sm:h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]" /></div>
              <div><label className="block text-xs sm:text-sm font-medium text-white/80 mb-1">Contact Number / FB Link *</label><input type="text" required value={customerContact} onChange={(e) => setCustomerContact(e.target.value)} className="w-full h-11 sm:h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]" /></div>
            </div>
            <div><label className="block text-xs sm:text-sm font-medium text-white/80 mb-1">Delivery Address / Meetup Location</label><input type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full h-11 sm:h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]" /></div>
            <div><label className="block text-xs sm:text-sm font-medium text-white/80 mb-1">Additional Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full bg-black/40 border border-white/20 rounded-[10px] p-3.5 sm:p-4 text-sm text-white outline-none focus:border-[#ca498c] resize-none" /></div>
          </div>

          <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-4 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-white/80 font-medium text-sm sm:text-base">Estimated Total Price:</span>
              <span className="font-serif text-2xl sm:text-3xl text-[#ca498c]">₱{totalPrice}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleFormToAi}
                disabled={isAiThinking || isImageGenerating || isUploading}
                className="flex-1 h-12 sm:h-14 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm px-4"
              >
                {isAiThinking || isImageGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                Generate Concept from Form
              </button>

              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 h-12 sm:h-14 bg-[#ca498c] hover:bg-[#b83d7a] text-white font-semibold rounded-full shadow-[0_4px_25px_rgba(209,126,165,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm px-4 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Submit & Send to Messenger
              </button>
            </div>

            <div className="bg-black/30 border border-white/10 rounded-[14px] p-3.5 sm:p-4 flex items-start gap-3 text-xs text-white/70">
              <AlertCircle className="w-4 h-4 text-[#ca498c] flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed"><strong className="text-white">Important Note:</strong> We require at least a <strong className="text-white">30% downpayment</strong> to process your custom bouquet. Please allow <strong className="text-white">2 to 5 days</strong> for crafting and completion.</p>
            </div>
          </div>
        </form>

        {/* ── STANDALONE CUSTOMIZED PHOTOBOOTH SECTION ── */}
        <div
          ref={photoboothSectionRef}
          id="customized-photobooth"
          className="mt-12 sm:mt-14 pt-8 sm:pt-10 border-t border-white/15 scroll-mt-8"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-white flex items-center gap-2.5 sm:gap-3">
                <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-[#ca498c] flex-shrink-0" /> Customized Photobooth
              </h2>
              <p className="text-white/70 text-xs sm:text-sm mt-1">
                Pick a premade theme, customize your banner message, and generate a QR code or pasteable code to unlock it in the Magic Photobooth!
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/photobooth")}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-[#ca498c]" /> Go to Photobooth
            </button>
          </div>

          <div className="bg-[#140e11] border border-[#ca498c]/45 rounded-[20px] p-4 sm:p-6 space-y-6 shadow-[0_10px_40px_rgba(202,73,140,0.18)]">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/85 mb-3">
                1. Choose a Premade Photobooth Design
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PHOTOBOOTH_PRESETS.map((preset) => {
                  const active = pbPresetId === preset.id;
                  return (
                    <button
                      type="button"
                      key={preset.id}
                      onClick={() => {
                        setPbPresetId(preset.id);
                        resetGeneratedOutputs();
                      }}
                      className={`p-3.5 rounded-[14px] border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                        active
                          ? "bg-[#ca498c]/15 border-[#ca498c] shadow-[0_0_20px_rgba(202,73,140,0.28)]"
                          : "bg-black/35 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div
                        className="h-14 w-full rounded-[10px] border border-white/15 flex items-center justify-between px-3"
                        style={{ background: preset.previewGradient }}
                      >
                        <span className="text-base tracking-widest">
                          {preset.stickers.join(" ")}
                        </span>
                        {active && (
                          <span className="w-5 h-5 rounded-full bg-white text-[#140e11] flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{preset.name}</p>
                        <p className="text-[11px] text-white/60 leading-snug mt-0.5">
                          {preset.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1.5">
                    2. Custom Screen Banner Headline
                  </label>
                  <input
                    type="text"
                    maxLength={48}
                    value={pbBannerTitle}
                    onChange={(e) => {
                      setPbBannerTitle(e.target.value);
                      resetGeneratedOutputs();
                    }}
                    placeholder="e.g. Happy Birthday, Mae! 🎂"
                    className="w-full h-11 bg-black/40 border border-white/20 rounded-[10px] px-3.5 text-sm text-white outline-none focus:border-[#ca498c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1.5">
                    Subtitle / Dedication Note
                  </label>
                  <input
                    type="text"
                    maxLength={60}
                    value={pbBannerSubtitle}
                    onChange={(e) => {
                      setPbBannerSubtitle(e.target.value);
                      resetGeneratedOutputs();
                    }}
                    placeholder="e.g. From Andrie • Yuri's Craft"
                    className="w-full h-11 bg-black/40 border border-white/20 rounded-[10px] px-3.5 text-sm text-white outline-none focus:border-[#ca498c]"
                  />
                </div>

                <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={pbAutoStickers}
                    onChange={(e) => {
                      setPbAutoStickers(e.target.checked);
                      resetGeneratedOutputs();
                    }}
                    className="accent-[#ca498c] w-4 h-4 rounded cursor-pointer flex-shrink-0"
                  />
                  <span>Auto-decorate screen with matching theme stickers</span>
                </label>
              </div>

              <div
                className="rounded-[16px] p-4 border flex flex-col justify-between min-h-[175px]"
                style={{
                  background: selectedPbPreset.previewGradient,
                  borderColor: selectedPbPreset.accentHex,
                }}
              >
                <div className="flex items-center justify-between text-[11px] text-white/80">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/45 backdrop-blur-sm border border-white/15">
                    Live Theme Preview
                  </span>
                  <span>{selectedPbPreset.stickers.slice(0, 3).join(" ")}</span>
                </div>

                <div
                  className="my-2 rounded-[12px] p-3 border text-center shadow-lg"
                  style={{
                    backgroundColor: selectedPbPreset.windowBgHex,
                    borderColor: selectedPbPreset.accentHex,
                  }}
                >
                  <p
                    className="font-serif text-sm sm:text-base font-bold break-words"
                    style={{ color: selectedPbPreset.accentLightHex }}
                  >
                    {pbBannerTitle || selectedPbPreset.name}
                  </p>
                  {pbBannerSubtitle && (
                    <p className="text-[11px] text-white/75 mt-0.5 break-words">{pbBannerSubtitle}</p>
                  )}
                </div>

                <div className="text-[10px] text-white/70 text-center">
                  Works via QR scan or by pasting the generated code
                </div>
              </div>
            </div>

            <div className="pt-3 space-y-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleGeneratePhotoboothQR}
                disabled={isGeneratingQr}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#ca498c] hover:bg-[#b83d7a] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(202,73,140,0.45)] transition-all cursor-pointer"
              >
                {isGeneratingQr ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <QrCode className="w-4 h-4" />
                )}
                <span>
                  {generatedQrDataUrl
                    ? "Regenerate Photobooth QR & Code"
                    : "Generate Photobooth QR & Code"}
                </span>
              </button>

              {generatedQrDataUrl && generatedShareCode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/40 border border-white/15 rounded-[16px] p-3.5 sm:p-4">
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5 sm:gap-4">
                    <img
                      src={generatedQrDataUrl}
                      alt="Customized Photobooth QR Code"
                      className="w-24 h-24 rounded-[10px] bg-white p-1 border border-white/20 flex-shrink-0"
                    />
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white">
                        Option 1: Scan or Upload QR
                      </p>
                      <p className="text-[11px] text-white/65 leading-snug">
                        Scan with a camera or upload this QR image in the Photobooth.
                      </p>
                      <a
                        href={generatedQrDataUrl}
                        download={`fazzyu-photobooth-${pbPresetId}.png`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#140e11] hover:bg-white/90 text-xs font-semibold cursor-pointer mt-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download QR
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between bg-[#140e11] border border-[#ca498c]/35 rounded-[12px] p-3.5 space-y-2.5 min-w-0">
                    <div>
                      <p className="text-xs font-semibold text-[#E8A0BE]">
                        Option 2: Copy & Paste Code (No 2nd Device Needed)
                      </p>
                      <p className="text-[11px] text-white/60 leading-snug mt-0.5">
                        Copy this code and paste it inside the Photobooth to load your theme immediately:
                      </p>
                    </div>

                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="text"
                        readOnly
                        value={generatedShareCode}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                        className="flex-1 min-w-0 h-9 bg-black/60 border border-white/20 rounded-[8px] px-2.5 text-xs font-mono text-white/90 outline-none select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyShareCode}
                        className={`px-3.5 h-9 rounded-[8px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0 ${
                          isCodeCopied
                            ? "bg-green-600 text-white"
                            : "bg-[#ca498c] hover:bg-[#b83d7a] text-white"
                        }`}
                      >
                        {isCodeCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/photobooth")}
                      className="w-full py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#ca498c]" /> Open Photobooth Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Pop-Up Modal for Generated AI Concept ── */}
        <AnimatePresence>
          {aiModal.isOpen && aiModal.imageUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setAiModal((prev) => ({ ...prev, isOpen: false }))}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#140e11] border border-[#ca498c]/50 rounded-[24px] p-4 sm:p-6 max-w-lg w-full max-h-[90dvh] overflow-y-auto shadow-[0_20px_60px_rgba(209,126,165,0.3)] flex flex-col gap-4 relative"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-serif text-base sm:text-lg text-white font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#ca498c]" /> AI Generated Concept
                  </h3>
                  <button
                    onClick={() => setAiModal((prev) => ({ ...prev, isOpen: false }))}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="rounded-[16px] overflow-hidden border border-white/15 bg-black flex items-center justify-center min-h-[220px] sm:min-h-[260px] max-h-[360px]">
                  <img
                    src={aiModal.imageUrl}
                    alt="AI Concept"
                    className="w-full h-full object-contain max-h-[340px]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => triggerAiGeneration(aiModal.prompt)}
                    disabled={isAiThinking || isImageGenerating}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs text-white font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isImageGenerating ? "animate-spin" : ""}`} /> Regenerate
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setAiModal((prev) => ({ ...prev, isOpen: false }))}
                      className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-full text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
                    >
                      Exit
                    </button>

                    <button
                      type="button"
                      onClick={handleAddConceptToInspo}
                      disabled={aiModal.isAdded}
                      className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                        aiModal.isAdded
                          ? "bg-green-600 text-white cursor-default"
                          : "bg-[#ca498c] hover:bg-[#b83d7a] text-white"
                      }`}
                    >
                      {aiModal.isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {aiModal.isAdded ? "Added to Inspo" : "Add to Inspiration"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
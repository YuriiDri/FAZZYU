import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Upload, X, Sparkles, Send, AlertCircle, 
  Plus, Minus, Loader2, Bot, User, ImageIcon, RefreshCw, Check 
} from "lucide-react";
import { toast } from "sonner";
import { useAppData, supabase } from "@/app/context/AppDataContext";

const CATEGORIES = ["Bouquets", "Themed", "Dolls", "Crafts"];
const SIZE_OPTIONS = ["Mini", "Small", "Medium", "Large", "Extra Large / Custom"];

// SMARTER AI PROMPT: Only generates images if requested or describing a design
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
  const { customizedMaterials, addOrder } = useAppData();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Form State
  const [category, setCategory] = useState("Bouquets");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [themeInput, setThemeInput] = useState("");
  const [size, setSize] = useState("Medium");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");

  // AI Chat & Modal State
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

  const flowers = customizedMaterials.filter((m) => m.category === "flower");
  const wrappers = customizedMaterials.filter((m) => m.category === "wrapper");

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiThinking, isImageGenerating]);

  function handleQuantityChange(id: string, delta: number) {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: Math.max(0, current + delta) };
    });
  }

  const materialsPrice = customizedMaterials.reduce((sum, mat) => sum + (mat.price * (quantities[mat.id] || 0)), 0);
  const basePrice = 150;
  const totalPrice = basePrice + materialsPrice;

  // Helper: Convert Blob to Base64 to avoid broken image URLs
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

    const newMsgId = `u-${Date.now()}`;
    setChatMessages((prev) => [...prev, { id: newMsgId, sender: "user", text: userPrompt }]);
    setChatInput("");
    setIsAiThinking(true);

    try {
      // 1. Call Gemini 3.1 Flash Lite
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
      setIsAiThinking(false);

      // 2. Call Cloudflare Worker Image Generator ONLY IF A PROMPT WAS GENERATED
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
          finalImageUrl = await blobToBase64(blob); // Ensures cross-browser rendering safety
        }

        // Add image to chat stream
        setChatMessages((prev) => [
          ...prev, 
          { id: `img-${Date.now()}`, sender: "bot", text: "Here is your generated concept! ✨", imageUrl: finalImageUrl }
        ]);

        // Trigger Pop-up Preview Modal
        setAiModal({
          isOpen: true,
          imageUrl: finalImageUrl,
          prompt: userPrompt,
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
    
    // Explicit trigger for the AI
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
      // 1. Upload any local base64/blob AI images to Supabase Storage first
      const publicImageUrls = await Promise.all(
        images.map((img) => uploadLocalImageToSupabase(img))
      );

      const orderId = `#YC-CUST-${Math.floor(1000 + Math.random() * 9000)}`;
      const selectedMaterialsSummary = customizedMaterials
        .filter((m) => (quantities[m.id] || 0) > 0)
        .map((m) => `${quantities[m.id]}x ${m.name}`)
        .join(", ");

      let compiledTitle = `Custom ${category}`;
      let compiledDefinition = `Size: ${size}`;
      if (category === "Bouquets") {
        compiledDefinition += ` | Materials: ${selectedMaterialsSummary || "None selected"}`;
      } else if (category === "Themed") {
        compiledDefinition += ` | Theme: ${themeInput}`;
      }

      const fullNotes = `Contact: ${customerContact}\nAddress: ${customerAddress}\nAdditional Notes: ${notes}`;

      // 2. Save order to Supabase/State
      await addOrder({
        id: orderId,
        title: compiledTitle,
        price: totalPrice,
        category,
        status: "Pending",
        description: description || "Custom client request.",
        definition: compiledDefinition,
        customer: customerName,
        payment: "GCASH",
        paymentDate: new Date().toLocaleDateString(),
        notes: fullNotes,
        images: publicImageUrls,
      });

      // 3. Format public picture URLs directly into the Messenger summary text
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
      <div className="max-w-4xl mx-auto px-4 py-10 lg:py-14">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </button>

        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#ca498c]" /> Customize Your Creation
          </h1>
          <p className="text-white/70 text-sm mt-2">Design your personalized masterpiece manually, or let our AI generate a concept for you!</p>
        </div>

        <form onSubmit={handleSubmitOrder} className="space-y-8">
          
          {/* ── AI Co-Designer Studio ── */}
          <div className="bg-[#1a1316] border border-[#ca498c]/40 rounded-[20px] overflow-hidden shadow-[0_10px_40px_rgba(209,126,165,0.15)] flex flex-col">
            <div className="bg-[#ca498c]/10 border-b border-[#ca498c]/30 px-6 py-4 flex items-center justify-between">
              <h2 className="font-serif text-lg text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#ca498c]" /> AI Co-Designer Studio
              </h2>
              <span className="text-[10px] bg-[#ca498c] px-2 py-1 rounded-full uppercase tracking-widest font-bold">Beta</span>
            </div>
            
            <div className="p-4 h-[280px] overflow-y-auto space-y-4 font-sans text-sm bg-black/20">
              <AnimatePresence initial={false}>
                {chatMessages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${m.sender === "user" ? "bg-[#ca498c] text-white" : "bg-white/10 text-[#ca498c]"}`}>
                      {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col gap-2 max-w-[80%]">
                      {m.text && (
                        <div className={`p-3 rounded-[16px] leading-relaxed whitespace-pre-wrap ${m.sender === "user" ? "bg-[#ca498c] text-white rounded-tr-none" : "bg-[#140e11] border border-white/10 text-white/90 rounded-tl-none"}`}>
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-white/50 text-sm italic">
                  <Loader2 className="w-4 h-4 text-[#ca498c] animate-spin" />
                  <span>{isImageGenerating ? "Crafting your fuzzy wire image..." : "AI is thinking..."}</span>
                </motion.div>
              )}
              <div ref={chatScrollRef} />
            </div>

            <div className="p-3 bg-[#140e11] border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), triggerAiGeneration(chatInput))}
                placeholder="Ask AI to design a bouquet (e.g. A blue and gold lily bouquet...)"
                className="flex-1 bg-black/40 border border-white/20 rounded-full px-4 py-2.5 text-sm text-white outline-none focus:border-[#ca498c]"
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

          <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-6 space-y-4 shadow-xl">
            <h2 className="font-serif text-xl text-white/90">1. Choose Creation Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-3 px-4 rounded-[12px] font-medium text-sm transition-all cursor-pointer border ${category === cat ? "bg-[#ca498c] border-[#ca498c] text-white shadow-[0_4px_20px_rgba(209,126,165,0.4)]" : "bg-black/30 border-white/10 text-white/70 hover:border-white/30 hover:text-white"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {category === "Bouquets" && (
            <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-6 space-y-6 shadow-xl">
              <h2 className="font-serif text-xl text-white/90">2. Select Flowers & Quantities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {flowers.map((flower) => {
                  const qty = quantities[flower.id] || 0;
                  const isSelected = qty > 0;
                  return (
                    <div key={flower.id} className={`flex flex-col items-center p-3 rounded-[14px] transition-all border text-center ${isSelected ? "bg-[#ca498c]/20 border-[#ca498c] shadow-[0_0_15px_rgba(209,126,165,0.2)]" : "bg-black/30 border-white/10"}`}>
                      <div className="w-16 h-16 rounded-[10px] overflow-hidden mb-2 border border-white/20 bg-black/40">
                        {flower.image ? <img src={flower.image} alt={flower.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No Img</div>}
                      </div>
                      <span className="text-xs font-medium text-white leading-tight mb-3">{flower.name}</span>
                      <div className="flex items-center gap-2 bg-black/50 px-2 py-1 rounded-full border border-white/10">
                        <button type="button" onClick={() => handleQuantityChange(flower.id, -1)} className="text-white/70 hover:text-white"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-medium text-white w-4">{qty}</span>
                        <button type="button" onClick={() => handleQuantityChange(flower.id, 1)} className="text-white/70 hover:text-white"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {category === "Themed" && (
            <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-6 space-y-4 shadow-xl">
              <h2 className="font-serif text-xl text-white/90">2. Theme Specification</h2>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">What theme do you want?</label>
                <input type="text" value={themeInput} onChange={(e) => setThemeInput(e.target.value)} placeholder="e.g. Graduation, Valentine's..." className="w-full h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]" />
              </div>
            </div>
          )}

          {(category === "Dolls" || category === "Crafts") && (
            <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-6 space-y-4 shadow-xl">
              <h2 className="font-serif text-xl text-white/90">2. {category} Details</h2>
              <p className="text-xs text-white/60">Describe your custom concept thoroughly in the description box below!</p>
            </div>
          )}

          <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-6 space-y-6 shadow-xl">
            <h2 className="font-serif text-xl text-white/90">3. Select Wrapping Style & Size</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Bouquet / Item Size</label>
                <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]">
                  {SIZE_OPTIONS.map((s) => <option key={s} value={s} className="bg-[#140e11] text-white">{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">Wrappers (Select quantities)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {wrappers.map((wrap) => {
                  const qty = quantities[wrap.id] || 0;
                  const isSelected = qty > 0;
                  return (
                    <div key={wrap.id} className={`flex flex-col items-center p-3 rounded-[14px] transition-all border text-center ${isSelected ? "bg-[#ca498c]/20 border-[#ca498c] shadow-[0_0_15px_rgba(209,126,165,0.2)]" : "bg-black/30 border-white/10"}`}>
                      <div className="w-16 h-16 rounded-[10px] overflow-hidden mb-2 border border-white/20 bg-black/40">
                        {wrap.image ? <img src={wrap.image} alt={wrap.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No Img</div>}
                      </div>
                      <span className="text-xs font-medium text-white leading-tight mb-3">{wrap.name}</span>
                      <div className="flex items-center gap-2 bg-black/50 px-2 py-1 rounded-full border border-white/10">
                        <button type="button" onClick={() => handleQuantityChange(wrap.id, -1)} className="text-white/70 hover:text-white"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-medium text-white w-4">{qty}</span>
                        <button type="button" onClick={() => handleQuantityChange(wrap.id, 1)} className="text-white/70 hover:text-white"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Order Description & Instructions</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe specific requests..." className="w-full bg-black/40 border border-white/20 rounded-[10px] p-4 text-sm text-white outline-none focus:border-[#ca498c] resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Inspiration Pictures (AI Concepts Auto-Added)</label>
              <p className="text-xs text-white/50 mb-3">Attach reference photos so we can match your vision!</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => fileRef.current?.click()} disabled={isUploading} className="w-28 h-28 border border-dashed border-white/30 rounded-[12px] flex flex-col items-center justify-center gap-2 hover:border-[#ca498c] transition-colors cursor-pointer bg-black/20 disabled:opacity-50">
                  {isUploading ? <Loader2 className="w-5 h-5 text-white/60 animate-spin" /> : <Upload className="w-5 h-5 text-white/60" />}
                  <span className="text-[11px] text-white/70">{isUploading ? "Uploading..." : "Upload"}</span>
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                {images.map((src, i) => (
                  <div key={i} className="relative w-28 h-28 rounded-[12px] overflow-hidden border border-white/20 bg-black/40">
                    <img src={src} alt="Inspo" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-red-600"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-6 space-y-4 shadow-xl">
            <h2 className="font-serif text-xl text-white/90">4. Your Information & Delivery Card</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-white/80 mb-1">Full Name *</label><input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]" /></div>
              <div><label className="block text-sm font-medium text-white/80 mb-1">Contact Number / FB Link *</label><input type="text" required value={customerContact} onChange={(e) => setCustomerContact(e.target.value)} className="w-full h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]" /></div>
            </div>
            <div><label className="block text-sm font-medium text-white/80 mb-1">Delivery Address / Meetup Location</label><input type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]" /></div>
            <div><label className="block text-sm font-medium text-white/80 mb-1">Additional Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full bg-black/40 border border-white/20 rounded-[10px] p-4 text-sm text-white outline-none focus:border-[#ca498c] resize-none" /></div>
          </div>

          <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-white/80 font-medium">Estimated Total Price:</span>
              <span className="font-serif text-3xl text-[#ca498c]">₱{totalPrice}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                type="button" 
                onClick={handleFormToAi}
                disabled={isAiThinking || isImageGenerating || isUploading}
                className="flex-1 h-14 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {isAiThinking || isImageGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />} 
                Generate Concept from Form
              </button>
              
              <button 
                type="submit" 
                disabled={isUploading}
                className="flex-1 h-14 bg-[#ca498c] hover:bg-[#b83d7a] text-white font-semibold rounded-full shadow-[0_4px_25px_rgba(209,126,165,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} 
                Submit & Send to Messenger
              </button>
            </div>

            <div className="bg-black/30 border border-white/10 rounded-[14px] p-4 flex items-start gap-3 text-xs text-white/70">
              <AlertCircle className="w-4 h-4 text-[#ca498c] flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed"><strong className="text-white">Important Note:</strong> We require at least a <strong className="text-white">30% downpayment</strong> to process your custom bouquet. Please allow <strong className="text-white">2 to 5 days</strong> for crafting and completion.</p>
            </div>
          </div>
        </form>

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
                className="bg-[#140e11] border border-[#ca498c]/50 rounded-[24px] p-6 max-w-lg w-full shadow-[0_20px_60px_rgba(209,126,165,0.3)] flex flex-col gap-4 relative"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-serif text-lg text-white font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#ca498c]" /> AI Generated Concept
                  </h3>
                  <button
                    onClick={() => setAiModal((prev) => ({ ...prev, isOpen: false }))}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="rounded-[16px] overflow-hidden border border-white/15 bg-black flex items-center justify-center min-h-[260px] max-h-[380px]">
                  <img
                    src={aiModal.imageUrl}
                    alt="AI Concept"
                    className="w-full h-full object-contain max-h-[360px]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
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
                      className={`px-5 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
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
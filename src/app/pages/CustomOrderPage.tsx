import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Upload, X, Sparkles, Send, AlertCircle, Plus, Minus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppData, supabase } from "@/app/context/AppDataContext";

const CATEGORIES = ["Bouquets", "Themed", "Dolls", "Crafts"];
const SIZE_OPTIONS = ["Mini", "Small", "Medium", "Large", "Extra Large / Custom"];

export default function CustomOrderPage() {
  const { customizedMaterials, addOrder } = useAppData();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState("Bouquets");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [themeInput, setThemeInput] = useState("");
  const [size, setSize] = useState("Medium");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");

  const flowers = customizedMaterials.filter((m) => m.category === "flower");
  const wrappers = customizedMaterials.filter((m) => m.category === "wrapper");

  function handleQuantityChange(id: string, delta: number) {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [id]: updated };
    });
  }

  const materialsPrice = customizedMaterials.reduce((sum, mat) => sum + (mat.price * (quantities[mat.id] || 0)), 0);
  const basePrice = 150;
  const totalPrice = basePrice + materialsPrice;

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
      images,
    });

    toast.success("Custom order submitted successfully!");
    const summaryText = encodeURIComponent(
      `Hello! I just submitted a Custom Order on your website!\n\nOrder ID: ${orderId}\nCategory: ${category}\nDetails: ${compiledDefinition}\nTotal Price: ₱${totalPrice}\nName: ${customerName}\nContact: ${customerContact}`
    );
    window.open(`https://m.me/fazzyuu?text=${summaryText}`, "_blank");
    navigate("/shop");
  }

  return (
    <div className="bg-[#1E1518] min-h-screen text-white font-sans selection:bg-[#ca498c] selection:text-white pb-20">
      <div className="max-w-3xl mx-auto px-4 py-10 lg:py-14">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </button>

        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#ca498c]" /> Customize Your Creation
          </h1>
          <p className="text-white/70 text-sm mt-2">Design your personalized masterpiece by selecting flowers and wrappers!</p>
        </div>

        <form onSubmit={handleSubmitOrder} className="space-y-8">
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
              <label className="block text-sm font-medium text-white/80 mb-1">Upload Inspiration Pictures</label>
              <p className="text-xs text-white/50 mb-3">Attach reference photos so we can match your vision!</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => fileRef.current?.click()} disabled={isUploading} className="w-28 h-28 border border-dashed border-white/30 rounded-[12px] flex flex-col items-center justify-center gap-2 hover:border-[#ca498c] transition-colors cursor-pointer bg-black/20 disabled:opacity-50">
                  {isUploading ? <Loader2 className="w-5 h-5 text-white/60 animate-spin" /> : <Upload className="w-5 h-5 text-white/60" />}
                  <span className="text-[11px] text-white/70">{isUploading ? "Uploading..." : "Upload"}</span>
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                {images.map((src, i) => (
                  <div key={i} className="relative w-28 h-28 rounded-[12px] overflow-hidden border border-white/20">
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
            <button type="submit" className="w-full h-14 bg-[#ca498c] hover:bg-[#b83d7a] text-white font-semibold rounded-full shadow-[0_4px_25px_rgba(209,126,165,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer text-base">
              <Send className="w-5 h-5" /> Submit Custom Order & Send to Messenger
            </button>
            <div className="bg-black/30 border border-white/10 rounded-[14px] p-4 flex items-start gap-3 text-xs text-white/70">
              <AlertCircle className="w-4 h-4 text-[#ca498c] flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed"><strong className="text-white">Important Note:</strong> We require at least a <strong className="text-white">30% downpayment</strong> to process your custom bouquet. Please allow <strong className="text-white">2 to 5 days</strong> for crafting and completion.</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
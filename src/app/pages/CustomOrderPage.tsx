import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Upload, X, Sparkles, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAppData } from "@/app/context/AppDataContext";

// Temporary fallback mappings using existing verified assets in your project
import imgPlaceholder from "@/imports/ItemPage/8bbe4ef13bf84089b951b93a9d69a2de0996fbf9.png";

const CATEGORIES = ["Bouquet", "Themed", "Dolls", "Craft"];

const FLOWER_OPTIONS = [
  { name: "Rosy", image: imgPlaceholder },
  { name: "Rose", image: imgPlaceholder },
  { name: "Spider Lily", image: imgPlaceholder },
  { name: "Tulip V1", image: imgPlaceholder },
  { name: "Tulip V2", image: imgPlaceholder },
  { name: "Carnation", image: imgPlaceholder },
  { name: "Hibiscus", image: imgPlaceholder },
  { name: "Lily of Valley", image: imgPlaceholder },
  { name: "Bunny", image: imgPlaceholder },
  { name: "Baby's Breath", image: imgPlaceholder },
  { name: "Heart", image: imgPlaceholder },
  { name: "Hydrangea", image: imgPlaceholder },
  { name: "Mini Peony", image: imgPlaceholder },
  { name: "Mini Sunflower", image: imgPlaceholder },
  { name: "Puff Flower", image: imgPlaceholder },
  { name: "Mini Rosy", image: imgPlaceholder },
  { name: "Mini Tulip", image: imgPlaceholder },
  { name: "Forget Me Not", image: imgPlaceholder },
  { name: "Lavender", image: imgPlaceholder },
  { name: "Mini Daisy", image: imgPlaceholder },
  { name: "Stargazer", image: imgPlaceholder },
  { name: "Mini Lotus", image: imgPlaceholder },
  { name: "Sundrop", image: imgPlaceholder },
  { name: "Lily V2", image: imgPlaceholder },
  { name: "Anthurium", image: imgPlaceholder },
  { name: "Daisy V1", image: imgPlaceholder },
  { name: "Cherry Blossom", image: imgPlaceholder },
  { name: "Butterfly", image: imgPlaceholder },
  { name: "Daffodils", image: imgPlaceholder },
  { name: "Spiral", image: imgPlaceholder },
  { name: "Leaf 1", image: imgPlaceholder },
  { name: "Leaf 2", image: imgPlaceholder },
  { name: "Leaf 3", image: imgPlaceholder },
];

const COLOR_OPTIONS = [
  { name: "Pink", hex: "#ff9cca" },
  { name: "Red", hex: "#e92c2c" },
  { name: "Yellow", hex: "#ffd166" },
  { name: "Purple", hex: "#b873ef" },
  { name: "White", hex: "#ffffff" },
  { name: "Blue", hex: "#5bc0eb" },
  { name: "Sunset (Orange/Coral)", hex: "#ff7043" },
  { name: "Pastel Mix", hex: "#df9ebf" },
];

const WRAPPING_OPTIONS = ["Kraft Paper", "Lavender Crinkle Paper", "Pastel Pink Tissue", "White Satin Border", "Black Velvet Wrap", "Classic Transparent"];
const SIZE_OPTIONS = ["Mini", "Small", "Medium", "Large", "Extra Large / Custom"];

export default function CustomOrderPage() {
  const { addOrder } = useAppData();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState("Bouquet");
  const [selectedFlowers, setSelectedFlowers] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [themeInput, setThemeInput] = useState("");
  const [wrapping, setWrapping] = useState("Kraft Paper");
  const [size, setSize] = useState("Medium");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");

  function toggleSelection(item: string, list: string[], setList: (val: string[]) => void) {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setImages((prev) => [...prev, e.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();

    if (!customerName.trim() || !customerContact.trim()) {
      toast.error("Please fill in your name and contact information.");
      return;
    }

    const orderId = `#YC-CUST-${Math.floor(1000 + Math.random() * 9000)}`;
    
    let compiledTitle = `Custom ${category}`;
    let compiledDefinition = `Size: ${size} | Wrapping: ${wrapping}`;
    if (category === "Bouquet") {
      compiledDefinition += ` | Flowers: ${selectedFlowers.join(", ")} | Colors: ${selectedColors.join(", ")}`;
    } else if (category === "Themed") {
      compiledDefinition += ` | Theme: ${themeInput}`;
    }

    const fullNotes = `Contact: ${customerContact}\nAddress: ${customerAddress}\nAdditional Notes: ${notes}`;

    await addOrder({
      id: orderId,
      title: compiledTitle,
      price: 500,
      category: category === "Bouquet" ? "Bouquets" : category,
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
      `Hello! I just submitted a Custom Order on your website!\n\n• Order ID: ${orderId}\n• Category: ${category}\n• Details: ${compiledDefinition}\n• Name: ${customerName}\n• Contact: ${customerContact}`
    );
    
    window.open(`https://m.me/fazzyuu?text=${summaryText}`, "_blank");
    navigate("/shop");
  }

  return (
    <div className="bg-[#1E1518] min-h-screen text-white font-sans selection:bg-[#ca498c] selection:text-white">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 py-10 lg:py-14">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </button>

        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#ca498c]" /> Customize Your Creation
          </h1>
          <p className="text-white/70 text-sm mt-2">
            Design your personalized fuzzy wire masterpiece with our visual flower and color guides!
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="space-y-8">
          {/* 1. Category Selection */}
          <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-6 space-y-4 shadow-xl">
            <h2 className="font-serif text-xl text-white/90">1. Choose Creation Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-3 px-4 rounded-[12px] font-medium text-sm transition-all cursor-pointer border ${
                    category === cat
                      ? "bg-[#ca498c] border-[#ca498c] text-white shadow-[0_4px_20px_rgba(209,126,165,0.4)]"
                      : "bg-black/30 border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Bouquet Visual Flower & Color Selection */}
          {category === "Bouquet" && (
            <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-6 space-y-6 shadow-xl">
              <h2 className="font-serif text-xl text-white/90">2. Bouquet Flower & Color Preferences</h2>
              
              {/* Flowers with Sample Preview Cards */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">Select Flower Types (Click to select multiple)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
                  {FLOWER_OPTIONS.map((flower) => {
                    const isSelected = selectedFlowers.includes(flower.name);
                    return (
                      <button
                        type="button"
                        key={flower.name}
                        onClick={() => toggleSelection(flower.name, selectedFlowers, setSelectedFlowers)}
                        className={`flex flex-col items-center p-3 rounded-[14px] transition-all cursor-pointer border text-center ${
                          isSelected 
                            ? "bg-[#ca498c]/30 border-[#ca498c] shadow-[0_0_15px_rgba(209,126,165,0.3)]" 
                            : "bg-black/30 border-white/10 hover:border-white/30"
                        }`}
                      >
                        <div className="w-16 h-16 rounded-[10px] overflow-hidden mb-2 border border-white/20">
                          <img src={flower.image} alt={flower.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-medium text-white leading-tight">{flower.name}</span>
                        <span className="text-[10px] text-[#ca498c] mt-0.5">{isSelected ? "Selected ✓" : "Tap to add"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors with Circle Palette Swatches */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">Select Color Palette (Click to select multiple)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {COLOR_OPTIONS.map((color) => {
                    const isSelected = selectedColors.includes(color.name);
                    return (
                      <button
                        type="button"
                        key={color.name}
                        onClick={() => toggleSelection(color.name, selectedColors, setSelectedColors)}
                        className={`flex items-center gap-3 p-3 rounded-[12px] transition-all cursor-pointer border text-left ${
                          isSelected 
                            ? "bg-[#ca498c]/30 border-[#ca498c]" 
                            : "bg-black/30 border-white/10 hover:border-white/30"
                        }`}
                      >
                        {/* Circle Color Swatch */}
                        <div 
                          className="w-6 h-6 rounded-full border border-white/40 flex-shrink-0 shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-white truncate">{color.name}</p>
                          <p className="text-[10px] text-white/50">{isSelected ? "Selected ✓" : ""}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {category === "Themed" && (
            <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-6 space-y-4 shadow-xl">
              <h2 className="font-serif text-xl text-white/90">2. Theme Specification</h2>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">What theme do you want?</label>
                <input
                  type="text"
                  value={themeInput}
                  onChange={(e) => setThemeInput(e.target.value)}
                  placeholder="e.g. Graduation, Valentine's, Anime Character, Birthday"
                  className="w-full h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]"
                />
              </div>
            </div>
          )}

          {(category === "Dolls" || category === "Craft") && (
            <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-6 space-y-4 shadow-xl">
              <h2 className="font-serif text-xl text-white/90">2. {category} Details</h2>
              <p className="text-xs text-white/60">Describe your custom {category.toLowerCase()} concept thoroughly in the description box below!</p>
            </div>
          )}

          {/* 3. Common Options: Size & Wrapping */}
          <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-6 space-y-6 shadow-xl">
            <h2 className="font-serif text-xl text-white/90">3. Size & Wrapping Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Bouquet / Item Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]"
                >
                  {SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-[#140e11] text-white">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Wrapping Style</label>
                <select
                  value={wrapping}
                  onChange={(e) => setWrapping(e.target.value)}
                  className="w-full h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]"
                >
                  {WRAPPING_OPTIONS.map((w) => (
                    <option key={w} value={w} className="bg-[#140e11] text-white">{w}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Order Description & Instructions</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe arrangement layout, ribbon preference, specific requests..."
                className="w-full bg-black/40 border border-white/20 rounded-[10px] p-4 text-sm text-white outline-none focus:border-[#ca498c] resize-none"
              />
            </div>

            {/* Inspo Image Upload */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Upload Inspiration Pictures</label>
              <p className="text-xs text-white/50 mb-3">Attach reference photos so we can match your vision!</p>
              
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-28 h-28 border border-dashed border-white/30 rounded-[12px] flex flex-col items-center justify-center gap-2 hover:border-[#ca498c] transition-colors cursor-pointer bg-black/20"
                >
                  <Upload className="w-5 h-5 text-white/60" />
                  <span className="text-[11px] text-white/70">Upload</span>
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />

                {images.map((src, i) => (
                  <div key={i} className="relative w-28 h-28 rounded-[12px] overflow-hidden border border-white/20">
                    <img src={src} alt="Inspo" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Personal Info Card */}
          <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-6 space-y-4 shadow-xl">
            <h2 className="font-serif text-xl text-white/90">4. Your Information & Delivery Card</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Maria Santos"
                  className="w-full h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Contact Number / FB Link *</label>
                <input
                  type="text"
                  required
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  placeholder="Mobile number or FB profile link"
                  className="w-full h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Delivery Address / Meetup Location</label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="e.g. Brgy. Pulanglupa Uno, Las Piñas City"
                className="w-full h-12 bg-black/40 border border-white/20 rounded-[10px] px-4 text-sm text-white outline-none focus:border-[#ca498c]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Preferred delivery date or special instructions..."
                className="w-full bg-black/40 border border-white/20 rounded-[10px] p-4 text-sm text-white outline-none focus:border-[#ca498c] resize-none"
              />
            </div>
          </div>

          {/* Submit Button & Important Note Wrapper */}
          <div className="space-y-3">
            <button
              type="submit"
              className="w-full h-14 bg-[#ca498c] hover:bg-[#b83d7a] text-white font-semibold rounded-full shadow-[0_4px_25px_rgba(209,126,165,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
            >
              <Send className="w-5 h-5" /> Submit Custom Order & Send to Messenger
            </button>

            {/* Important Note Box */}
            <div className="bg-[#140e11] border border-white/20 rounded-[14px] p-4 flex items-start gap-3 text-xs text-white/70">
              <AlertCircle className="w-4 h-4 text-[#ca498c] flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-white">Important Note:</strong> We require at least a <strong className="text-white">30% downpayment</strong> to process your custom bouquet. Please allow <strong className="text-white">2 to 5 days</strong> for crafting and completion.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
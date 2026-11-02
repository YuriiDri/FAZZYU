import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppData, supabase, type Order } from "@/app/context/AppDataContext";
import { AdminDropdown } from "@/app/components/admin/AdminDropdown";

const STATUS_OPTIONS = ["Available", "Out of Stock", "Paid", "Pending"];
const CATEGORY_OPTIONS = ["Bouquets", "Themed", "Dolls", "Crafts"];

export default function AdminAddOrderPage() {
  const { addOrder } = useAppData();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");
  const [category, setCategory] = useState("Bouquets");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        newUrls.push(data.publicUrl);
      }
      setImages((prev) => [...prev, ...newUrls]);
      toast.success("Images uploaded to cloud.");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images.");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSave() {
    if (!title.trim() || !price) {
      toast.error("Please fill in Order Title and Price.");
      return;
    }
    await addOrder({
      id: `#YC-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      price: Number(price),
      category,
      status: status as Order["status"],
      description,
      definition: "",
      customer: "General Customer", 
      payment: "GCASH",
      paymentDate: new Date().toLocaleDateString(),
      notes: "",
      images,
    });
    toast.success("Product created successfully.");
    navigate("/admin/orders");
  }

  return (
    <div className="text-white">
      <h1 className="font-serif text-[56px] text-white leading-tight mb-1">
        Add New Product
      </h1>
      <p className="font-sans text-[18px] text-white/70 mb-6">
        Create a new product for your catalog.
      </p>

      <div className="flex gap-3 justify-end mb-6">
        <button
          onClick={() => navigate(-1)}
          className="h-[56px] px-8 bg-[#141414] border border-white/25 rounded-[15px] font-sans font-medium text-[16px] text-white/75 hover:border-white/40 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="h-[56px] px-8 bg-[#ca498c] border border-white/25 rounded-[15px] font-sans font-semibold text-[16px] text-white/90 hover:bg-[#b83d7a] transition-colors cursor-pointer"
        >
          + Add New Product
        </button>
      </div>

      <div className="bg-[#141414] border border-white/25 rounded-[15px] p-6 mb-6">
        <h2 className="font-sans font-bold text-[18px] text-white/75 mb-6">Product Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-sans font-medium text-[16px] text-white/75 mb-2">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunflower Bouquet"
              className="w-full h-[48px] px-4 bg-[#141414] border border-white/25 rounded-[10px] text-white outline-none focus:border-[#ca498c]/60"
            />
          </div>
          <div>
            <label className="block font-sans font-medium text-[16px] text-white/75 mb-2">Price (₱)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="w-full h-[48px] px-4 bg-[#141414] border border-white/25 rounded-[10px] text-white outline-none focus:border-[#ca498c]/60"
            />
          </div>
          <div>
            <label className="block font-sans font-medium text-[16px] text-white/75 mb-2">Status</label>
            <AdminDropdown options={STATUS_OPTIONS} value={status} onChange={setStatus} />
          </div>
          <div>
            <label className="block font-sans font-medium text-[16px] text-white/75 mb-2">Category</label>
            <AdminDropdown options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
          </div>
          <div className="md:col-span-2">
            <label className="block font-sans font-medium text-[16px] text-white/75 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Product description..."
              className="w-full px-4 py-3 bg-[#141414] border border-white/25 rounded-[10px] text-white outline-none focus:border-[#ca498c]/60 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#141414] border border-white/25 rounded-[15px] p-6">
        <h2 className="font-sans font-bold text-[18px] text-white/75 mb-1">Attach Product Image</h2>
        <p className="font-sans text-[14px] text-white/75 mb-4">Upload images to your cloud storage bucket.</p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            className="w-[166px] h-[177px] bg-[#141414] border border-dashed border-white/25 rounded-[12px] flex flex-col items-center justify-center gap-3 hover:border-[#ca498c]/60 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-8 h-8 text-white/60 animate-spin" /> : <Upload className="w-10 h-10 text-white/60" />}
            <span className="font-sans text-[12px] text-white/75">{isUploading ? "Uploading..." : "Click to upload"}</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />

          {images.map((src, i) => (
            <div key={i} className="relative w-[166px] h-[177px] rounded-[12px] overflow-hidden border border-white/25">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:bg-[#ca498c]/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
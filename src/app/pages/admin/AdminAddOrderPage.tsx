import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useAppData, type Order } from "@/app/context/AppDataContext";
import { AdminDropdown } from "@/app/components/admin/AdminDropdown";

const STATUS_OPTIONS = ["Available", "Out of Stock", "Paid", "Pending"];
const CATEGORY_OPTIONS = ["Bouquet", "Themed", "Dolls", "Craft"];

function generateId() {
  return `#YC-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function AdminAddOrderPage() {
  const { addOrder } = useAppData();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");
  const [category, setCategory] = useState("Bouquet");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

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

  function handleSave() {
    if (!title.trim() || !price) {
      toast.error("Please fill in Order Title and Price.");
      return;
    }
    addOrder({
      id: `prod-${Date.now()}`, // Internal product ID only
      title,
      price: Number(price),
      category,
      status: status as Order["status"],
      description,
      definition: "",
      customer: "", // Blank customer initially
      payment: "GCASH",
      paymentDate: "",
      notes: "",
      images,
    });
    toast.success("Product created successfully.");
    navigate("/admin/orders");
  }

  return (
    <div className="text-white">
      <h1 className="font-['Crimson_Text',serif] text-[56px] text-white leading-tight mb-1">
        Add New Order
      </h1>
      <p className="font-['Roboto',sans-serif] text-[18px] text-white/70 mb-6">
        Create a new order for your customer.
      </p>

      {/* Action buttons */}
      <div className="flex gap-3 justify-end mb-6">
        <button
          onClick={() => navigate(-1)}
          className="h-[56px] px-8 bg-[#141414] border border-[rgba(255,255,255,0.25)] rounded-[15px] font-['Roboto',sans-serif] font-medium text-[16px] text-white/74 hover:border-white/40 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="h-[56px] px-8 bg-[#ca498c] border border-[rgba(255,255,255,0.25)] rounded-[15px] font-['Roboto',sans-serif] font-semibold text-[16px] text-white/90 hover:bg-[#b83d7a] transition-colors"
        >
          + Add New Order
        </button>
      </div>

      {/* Order Information Panel */}
      <div className="bg-[#141414] border border-[rgba(255,255,255,0.25)] rounded-[15px] p-6 mb-6">
        <h2 className="font-['Roboto',sans-serif] font-bold text-[18px] text-white/75 mb-6">
          Order Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-['Roboto',sans-serif] font-medium text-[16px] text-white/75 mb-2">
              Order Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunflower Bouquet"
              className="w-full h-[48px] px-4 bg-[#141414] border border-[rgba(255,255,255,0.25)] rounded-[10px] font-['Roboto',sans-serif] text-[15px] text-white outline-none focus:border-[#ca498c]/60 placeholder:text-white/30"
            />
          </div>
          <div>
            <label className="block font-['Roboto',sans-serif] font-medium text-[16px] text-white/75 mb-2">
              Price (₱)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="w-full h-[48px] px-4 bg-[#141414] border border-[rgba(255,255,255,0.25)] rounded-[10px] font-['Roboto',sans-serif] text-[15px] text-white outline-none focus:border-[#ca498c]/60 placeholder:text-white/30"
            />
          </div>
          <div>
            <label className="block font-['Roboto',sans-serif] font-medium text-[16px] text-white/75 mb-2">
              Status
            </label>
            <AdminDropdown options={STATUS_OPTIONS} value={status} onChange={setStatus} />
          </div>
          <div>
            <label className="block font-['Roboto',sans-serif] font-medium text-[16px] text-white/75 mb-2">
              Category
            </label>
            <AdminDropdown options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
          </div>
          <div className="md:col-span-2">
            <label className="block font-['Roboto',sans-serif] font-medium text-[16px] text-white/75 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Order description..."
              className="w-full px-4 py-3 bg-[#141414] border border-[rgba(255,255,255,0.25)] rounded-[10px] font-['Roboto',sans-serif] text-[15px] text-white outline-none focus:border-[#ca498c]/60 placeholder:text-white/30 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Attach Product Image Panel */}
      <div className="bg-[#141414] border border-[rgba(255,255,255,0.25)] rounded-[15px] p-6">
        <h2 className="font-['Roboto',sans-serif] font-bold text-[18px] text-white/75 mb-1">
          Attach Product Image
        </h2>
        <p className="font-['Roboto',sans-serif] text-[14px] text-white/75 mb-4">
          This image will be visible to the customer in their order details.
        </p>
        <div className="flex flex-wrap gap-4">
          {/* Upload button */}
          <button
            onClick={() => fileRef.current?.click()}
            className="w-[166px] h-[177px] bg-[#141414] border border-dashed border-[rgba(255,255,255,0.25)] rounded-[12px] flex flex-col items-center justify-center gap-3 hover:border-[#ca498c]/60 transition-colors"
          >
            <Upload className="w-10 h-10 text-white/60" />
            <span className="font-['Roboto',sans-serif] text-[12px] text-white/75">Click to upload image</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />

          {/* Previews */}
          {images.map((src, i) => (
            <div key={i} className="relative w-[166px] h-[177px] rounded-[12px] overflow-hidden border border-[rgba(255,255,255,0.25)]">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:bg-[#ca498c]/80 transition-colors"
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


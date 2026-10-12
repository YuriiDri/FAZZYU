import { useState, useRef } from "react";
import { Plus, Trash2, Pencil, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useAppData, supabase, type CustomizedMaterial } from "@/app/context/AppDataContext";
import { AdminDropdown } from "@/app/components/admin/AdminDropdown";

export default function AdminCustomMaterialsPage() {
  const { customizedMaterials, addCustomizedMaterial, updateCustomizedMaterial, deleteCustomizedMaterial } = useAppData();
  
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"flower" | "wrapper">("flower");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `material-${Date.now()}.${fileExt}`;
      const filePath = `materials/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setImage(data.publicUrl);
      toast.success("Image uploaded successfully.");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSave() {
    if (!name.trim() || !price) {
      toast.error("Please fill in item name and price.");
      return;
    }

    if (editingId) {
      await updateCustomizedMaterial(editingId, { name, category, price: Number(price), image });
      toast.success("Material updated successfully.");
      setEditingId(null);
    } else {
      await addCustomizedMaterial({
        id: `mat-${Date.now()}`,
        name,
        category,
        price: Number(price),
        image,
      });
      toast.success("New material added to shop customizer.");
    }

    // Reset form
    setName("");
    setPrice("");
    setImage("");
  }

  function handleEdit(item: CustomizedMaterial) {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setPrice(String(item.price));
    setImage(item.image || "");
  }

  return (
    <div className="text-white">
      <h1 className="font-serif text-[56px] text-white leading-tight mb-1">
        Customized Materials
      </h1>
      <p className="font-sans text-[18px] text-white/70 mb-8">
        Add, edit prices, or delete flowers and wrappers available in the shop customizer.
      </p>

      {/* Add / Edit Form Panel */}
      <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-6 mb-10 max-w-3xl">
        <h2 className="font-serif text-xl mb-4">{editingId ? "Edit Material" : "Add New Material"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunflower"
              className="w-full h-12 px-4 bg-black/40 border border-white/20 rounded-[10px] text-white outline-none focus:border-[#ca498c]"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Type</label>
            <AdminDropdown
              options={["flower", "wrapper"]}
              value={category}
              onChange={(v) => setCategory(v as "flower" | "wrapper")}
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Price (₱)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="w-full h-12 px-4 bg-black/40 border border-white/20 rounded-[10px] text-white outline-none focus:border-[#ca498c]"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-sm text-white/70 mb-2">Material Image</label>
          <div className="flex items-center gap-4">
            {image ? (
              <div className="relative w-20 h-20 rounded-[10px] overflow-hidden border border-white/20">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImage("")}
                  className="absolute top-1 right-1 bg-black/70 rounded-full p-1 hover:bg-red-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-[10px] border border-dashed border-white/30 flex items-center justify-center bg-black/20 text-white/40">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
            
            <button
              onClick={() => fileRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 h-10 bg-white/10 hover:bg-white/20 rounded-[8px] text-sm text-white transition-colors disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isUploading ? "Uploading..." : "Upload Image"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="px-6 h-12 bg-[#ca498c] hover:bg-[#b83d7a] rounded-[10px] font-medium text-white transition-colors cursor-pointer"
          >
            {editingId ? "Update Material" : "+ Add Material"}
          </button>
          {editingId && (
            <button
              onClick={() => { setEditingId(null); setName(""); setPrice(""); setImage(""); }}
              className="px-6 h-12 bg-white/10 hover:bg-white/20 rounded-[10px] text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customizedMaterials.map((mat) => (
          <div key={mat.id} className="bg-[#140e11] border border-white/10 rounded-[16px] p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-[10px] overflow-hidden bg-black/40 border border-white/10 flex-shrink-0">
              {mat.image ? (
                <img src={mat.image} alt={mat.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/30"><ImageIcon className="w-6 h-6" /></div>
              )}
            </div>
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-wider text-[#ca498c] font-bold">{mat.category}</span>
              <h3 className="font-serif text-base text-white leading-tight mt-0.5">{mat.name}</h3>
              <p className="text-sm text-white/70 font-serif">₱{mat.price}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => handleEdit(mat)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white cursor-pointer transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => deleteCustomizedMaterial(mat.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-300 cursor-pointer transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
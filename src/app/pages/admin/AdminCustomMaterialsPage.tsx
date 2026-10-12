import { useState, useRef } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAppData, type CustomizedMaterial } from "@/app/context/AppDataContext";
import { AdminDropdown } from "@/app/components/admin/AdminDropdown";

export default function AdminCustomMaterialsPage() {
  const { customizedMaterials, addCustomizedMaterial, updateCustomizedMaterial, deleteCustomizedMaterial } = useAppData();
  
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"flower" | "wrapper">("flower");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleSave() {
    if (!name.trim() || !price) {
      toast.error("Please fill in item name and price.");
      return;
    }

    if (editingId) {
      await updateCustomizedMaterial(editingId, { name, category, price: Number(price) });
      toast.success("Material updated successfully.");
      setEditingId(null);
    } else {
      await addCustomizedMaterial({
        id: `mat-${Date.now()}`,
        name,
        category,
        price: Number(price),
      });
      toast.success("New material added to shop customizer.");
    }

    setName("");
    setPrice("");
  }

  function handleEdit(item: CustomizedMaterial) {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setPrice(String(item.price));
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
      <div className="bg-[#140e11] border border-white/20 rounded-[20px] p-6 mb-10 max-w-2xl">
        <h2 className="font-serif text-xl mb-4">{editingId ? "Edit Material" : "Add New Material"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunflower / Silk Ribbon"
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
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="px-6 h-12 bg-[#ca498c] hover:bg-[#b83d7a] rounded-[10px] font-medium text-white transition-colors cursor-pointer"
          >
            {editingId ? "Update Material" : "+ Add Material"}
          </button>
          {editingId && (
            <button
              onClick={() => { setEditingId(null); setName(""); setPrice(""); }}
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
          <div key={mat.id} className="bg-[#140e11] border border-white/10 rounded-[16px] p-5 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#ca498c] font-bold">{mat.category}</span>
              <h3 className="font-serif text-lg text-white mt-0.5">{mat.name}</h3>
              <p className="text-sm text-white/70 font-serif">₱{mat.price}</p>
            </div>
            <div className="flex gap-2">
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
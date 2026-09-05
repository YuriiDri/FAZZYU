import { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAppData } from "@/app/context/AppDataContext";

function generateId() {
  return `inv-${Date.now()}`;
}

export default function AdminAddNewItemPage() {
  const { addInventoryItem } = useAppData();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [lastRestock, setLastRestock] = useState("");
  const [category, setCategory] = useState("Fuzzy Wire");
  const [unit, setUnit] = useState("pcs");
  const [supplier, setSupplier] = useState("");
  const [supplierLink, setSupplierLink] = useState("");

  const totalValue = stock && unitPrice ? Number(stock) * Number(unitPrice) : 0;

  function handleSave() {
    if (!name.trim() || !stock || !unitPrice) {
      toast.error("Please fill in Item Name, Stock, and Unit Price.");
      return;
    }
    addInventoryItem({
      id: generateId(),
      name,
      category,
      stock: Number(stock),
      unit,
      lastRestock,
      unitPrice: Number(unitPrice),
      totalValue,
      supplier,
      supplierLink,
    });
    toast.success("Item added to inventory.");
    navigate("/admin/inventory");
  }

  const inputCls = "w-full h-[48px] px-4 bg-[#141414] border border-[rgba(255,255,255,0.25)] rounded-[10px] font-['Roboto',sans-serif] text-[15px] text-white outline-none focus:border-[#ca498c]/60 placeholder:text-white/30";
  const labelCls = "block font-['Roboto',sans-serif] font-medium text-[16px] text-white/75 mb-2";

  return (
    <div className="text-white">
      <h1 className="font-['Crimson_Text',serif] text-[56px] text-white leading-tight mb-1">
        Add New Item
      </h1>
      <p className="font-['Roboto',sans-serif] text-[18px] text-white/70 mb-6">
        Add new materials or supply to your inventory.
      </p>

      {/* Actions */}
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
          Save Item
        </button>
      </div>

      {/* Item Information */}
      <div className="bg-[#141414] border border-[rgba(255,255,255,0.25)] rounded-[15px] p-6 mb-6">
        <h2 className="font-['Roboto',sans-serif] font-bold text-[18px] text-white/75 mb-6">
          Item Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Item Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fuzzy Wire (Pink)" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Current Stock</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Purchase Price (Unit Price)</label>
            <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="0" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Total Value</label>
            <div className="w-full h-[48px] px-4 bg-[#141414] border border-[rgba(255,255,255,0.25)] rounded-[10px] font-['Roboto',sans-serif] text-[15px] text-white/60 flex items-center">
              ₱{totalValue.toLocaleString()}
            </div>
          </div>
          <div>
            <label className={labelCls}>Last Restock Date</label>
            <div className="relative">
              <input
                value={lastRestock}
                onChange={(e) => setLastRestock(e.target.value)}
                placeholder="e.g. 20 May 2024"
                className={`${inputCls} pr-10`}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Unit</label>
            <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="pcs" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Supplier */}
      <div className="bg-[#141414] border border-[rgba(255,255,255,0.25)] rounded-[15px] p-6">
        <h2 className="font-['Roboto',sans-serif] font-bold text-[18px] text-white/75 mb-6">
          Supplier
        </h2>
        <div className="flex flex-col gap-5">
          <div>
            <label className={labelCls}>Supplier</label>
            <input value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="Supplier name" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Link (Optional)</label>
            <input value={supplierLink} onChange={(e) => setSupplierLink(e.target.value)} placeholder="https://..." className={inputCls} />
          </div>
        </div>
      </div>
    </div>
  );
}

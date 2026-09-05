import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Plus } from "lucide-react";
import { useAppData } from "@/app/context/AppDataContext";
import { DataTable, type ColumnDef } from "@/app/components/admin/DataTable";
import type { InventoryItem } from "@/app/context/AppDataContext";

const ROWS_PER_PAGE = 7;

export default function AdminInventoryPage() {
  const { inventory } = useAppData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "out">("all");
  const [page, setPage] = useState(1);

  const filtered = inventory.filter((item) => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" || item.stock === 0;
    return matchSearch && matchTab;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageRows = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const columns: ColumnDef<InventoryItem>[] = [
    { key: "name", label: "Item Name", width: "2fr" },
    { key: "category", label: "Category", width: "1.5fr" },
    { key: "stock", label: "Stock", width: "1fr" },
    { key: "unit", label: "Unit", width: "1fr" },
    { key: "lastRestock", label: "Last Restock", width: "1.5fr" },
    { key: "unitPrice", label: "Unit Price", width: "1fr", render: (r) => `₱${r.unitPrice}` },
    { key: "totalValue", label: "Total Value", width: "1.2fr", render: (r) => `₱${r.totalValue.toLocaleString()}` },
  ];

  return (
    <div className="text-white">
      <h1 className="font-['Crimson_Text',serif] text-[56px] text-white leading-tight mb-1">
        Inventory
      </h1>
      <p className="font-['Roboto',sans-serif] text-[18px] text-white/70 mb-6">
        Manage all your materials and supplies.
      </p>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => { setTab("all"); setPage(1); }}
            className={`h-[44px] px-5 rounded-[15px] font-['Roboto',sans-serif] font-medium text-[15px] text-white transition-colors ${
              tab === "all" ? "bg-[rgba(202,73,140,0.25)]" : "bg-[#141414] hover:bg-[rgba(255,255,255,0.05)]"
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => { setTab("out"); setPage(1); }}
            className={`h-[44px] px-5 rounded-[15px] font-['Roboto',sans-serif] font-medium text-[15px] text-white transition-colors ${
              tab === "out" ? "bg-[rgba(202,73,140,0.25)]" : "bg-[#141414] hover:bg-[rgba(255,255,255,0.05)]"
            }`}
          >
            Out of Stock
          </button>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search Materials"
            className="w-full h-[48px] pl-10 pr-4 bg-[#141414] border border-[rgba(255,255,255,0.25)] rounded-[15px] font-['Roboto',sans-serif] text-[15px] text-white placeholder:text-white/40 outline-none focus:border-[#ca498c]/60"
          />
        </div>

        <button
          onClick={() => navigate("/admin/inventory/new")}
          className="flex items-center gap-2 h-[48px] px-5 bg-[#e856b5] border border-[rgba(255,255,255,0.25)] rounded-[10px] font-['Roboto',sans-serif] font-medium text-[15px] text-[#110f10] hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        onRowClick={(row) => navigate(`/admin/inventory/${row.id}/edit`)}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No items found."
      />
    </div>
  );
}

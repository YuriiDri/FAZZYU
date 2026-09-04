import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAppData } from "@/app/context/AppDataContext";
import { DataTable, StatusBadge, type ColumnDef } from "@/app/components/admin/DataTable";
import { AdminDropdown } from "@/app/components/admin/AdminDropdown";
import type { Order } from "@/app/context/AppDataContext";

const ROWS_PER_PAGE = 7;
const STATUS_OPTIONS = ["All Status", "Available", "Out of Stock", "Paid", "Pending"];

export default function AdminAddEditPage() {
  const { orders, deleteOrder } = useAppData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageRows = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const columns: ColumnDef<Order>[] = [
    { key: "title", label: "Title", width: "2fr" },
    { key: "price", label: "Price", width: "1fr", render: (r) => `₱${r.price}` },
    { key: "paymentDate", label: "Date", width: "1.5fr" },
    {
      key: "status",
      label: "Status",
      width: "1.2fr",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "action",
      label: "Action",
      width: "80px",
      render: (r) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/orders/${encodeURIComponent(r.id)}/edit`);
          }}
          className="text-[#9d9898] hover:text-[#ca498c] transition-colors"
        >
          <Pencil className="w-5 h-5" />
        </button>
      ),
    },
  ];

  function handleDelete(id: string) {
    deleteOrder(id);
    toast.success("Order deleted.");
    if (pageRows.length === 1 && page > 1) setPage((p) => p - 1);
  }

  return (
    <div className="text-white">
      <h1 className="font-['Crimson_Text',serif] text-[56px] text-white leading-tight mb-1">
        Add / Edit Order
      </h1>
      <p className="font-['Roboto',sans-serif] text-[18px] text-white/70 mb-6">
        Manage and track all customer orders.
      </p>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search Order, Customer..."
            className="w-full h-[48px] pl-10 pr-4 bg-[#141414] border border-[rgba(255,255,255,0.25)] rounded-[15px] font-['Roboto',sans-serif] text-[15px] text-white placeholder:text-white/40 outline-none focus:border-[#ca498c]/60"
          />
        </div>
        <AdminDropdown
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
          className="w-[180px]"
        />
        <button
          onClick={() => navigate("/admin/orders/new")}
          className="flex items-center gap-2 h-[48px] px-5 bg-[#ca498c] border border-[rgba(255,255,255,0.25)] rounded-[15px] font-['Roboto',sans-serif] font-semibold text-[16px] text-white/90 hover:bg-[#b83d7a] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Order
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        onRowClick={(row) => navigate(`/admin/orders/${encodeURIComponent(row.id)}/edit`)}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No orders found."
      />
    </div>
  );
}

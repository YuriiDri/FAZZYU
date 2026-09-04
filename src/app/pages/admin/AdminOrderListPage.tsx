import { useState } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";
import { useAppData } from "@/app/context/AppDataContext";
import { DataTable, StatusBadge, type ColumnDef } from "@/app/components/admin/DataTable";
import { AdminDropdown } from "@/app/components/admin/AdminDropdown";
import type { Order } from "@/app/context/AppDataContext";

const ROWS_PER_PAGE = 7;
const PAYMENT_OPTIONS = ["All Payment", "GCASH", "CASH"];

export default function AdminOrderListPage() {
  const { orders } = useAppData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All Payment");
  const [page, setPage] = useState(1);

// In AdminOrderListPage.tsx, filter out items without customer orders
  const filtered = orders.filter((o) => {
    const isCustomerOrder = Boolean(o.customer && o.customer.trim());
    const matchSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.title.toLowerCase().includes(search.toLowerCase());
    const matchPayment = paymentFilter === "All Payment" || o.payment === paymentFilter;
    return isCustomerOrder && matchSearch && matchPayment;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageRows = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const columns: ColumnDef<Order>[] = [
    { key: "id", label: "Order ID", width: "1.2fr" },
    { key: "customer", label: "Customer", width: "1.5fr" },
    { key: "category", label: "Category", width: "1.2fr" },
    { key: "price", label: "Price", width: "1fr", render: (r) => `₱${r.price}` },
    { key: "payment", label: "Payment", width: "1fr" },
    { key: "paymentDate", label: "Date", width: "1.4fr" },
    {
      key: "status",
      label: "Status",
      width: "1.2fr",
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="text-white">
      <h1 className="font-['Crimson_Text',serif] text-[56px] text-white leading-tight mb-1">
        Order List
      </h1>
      <p className="font-['Roboto',sans-serif] text-[18px] text-white/70 mb-6">
        Manage and track all customer orders.
      </p>

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
          options={PAYMENT_OPTIONS}
          value={paymentFilter}
          onChange={(v) => { setPaymentFilter(v); setPage(1); }}
          className="w-[180px]"
        />
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

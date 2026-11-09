import { useState } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";
import { useAppData } from "@/app/context/AppDataContext";

export default function AdminOrderListPage() {
  const { orders } = useAppData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");

  // Filter strictly for actual customer orders (Paid or Pending status)
  const customerOrders = orders.filter((o) => 
    o.status === "Paid" || o.status === "Pending"
  );

  const filteredOrders = customerOrders.filter((o) => {
    const matchesSearch = 
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesPayment = paymentFilter === "All" || o.payment === paymentFilter;

    return matchesSearch && matchesPayment;
  });

  return (
    <div className="text-white">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-['Crimson_Text',serif] text-[56px] text-white leading-tight">
            Order List
          </h1>
          <p className="font-['Roboto',sans-serif] text-[18px] text-white/70">
            Manage and track all customer orders.
          </p>
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order, Customer..."
            className="w-full h-[48px] pl-11 pr-4 bg-[#140e11] border border-white/20 rounded-[12px] text-sm text-white outline-none focus:border-[#ca498c]"
          />
        </div>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="h-[48px] px-4 bg-[#140e11] border border-white/20 rounded-[12px] text-sm text-white outline-none focus:border-[#ca498c] cursor-pointer"
        >
          <option value="All">All Payment</option>
          <option value="GCASH">GCASH</option>
          <option value="CASH">CASH</option>
        </select>
      </div>

      {/* ── Table Container ── */}
      <div className="bg-[#140e11] border border-white/15 rounded-[16px] overflow-hidden shadow-xl">
        <div className="grid grid-cols-7 px-6 py-4 border-b border-white/10 text-xs font-medium text-white/50 uppercase tracking-wider">
          <span>Order ID</span>
          <span>Customer</span>
          <span>Category</span>
          <span>Price</span>
          <span>Payment</span>
          <span>Date</span>
          <span>Status</span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-24 text-white/40 font-['Roboto',sans-serif] text-[16px]">
            No customer orders found.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredOrders.map((order) => (
              <div 
                key={order.id}
                onClick={() => navigate(`/admin/orders/${encodeURIComponent(order.id)}/edit`)}
                className="grid grid-cols-7 px-6 py-4 items-center text-sm text-white/90 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="font-medium text-[#ca498c]">{order.id}</span>
                <span>{order.customer || "General Customer"}</span>
                <span>{order.category}</span>
                <span>₱{order.price}</span>
                <span>{order.payment || "GCASH"}</span>
                <span>{order.paymentDate || "N/A"}</span>
                <span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    order.status === "Paid" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {order.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
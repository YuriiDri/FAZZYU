import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Plus } from "lucide-react";
import { useAppData } from "@/app/context/AppDataContext";

export default function AdminAddEditPage() {
  const { orders } = useAppData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((o) => 
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.customer?.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="text-white">
      {/* ── Header & Add Button (Always visible) ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-['Crimson_Text',serif] text-[56px] text-white leading-tight">
            Add / Edit Order
          </h1>
          <p className="font-['Roboto',sans-serif] text-[18px] text-white/70">
            Manage, add, and track all customer orders and catalog products.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/orders/new")}
          className="flex items-center gap-2 h-[56px] px-6 bg-[#ca498c] rounded-[15px] font-['Roboto',sans-serif] font-medium text-[18px] text-white hover:bg-[#b83d7a] transition-colors cursor-pointer shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* ── Search Bar ── */}
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
      </div>

      {/* ── Table Container with Permanent Headers ── */}
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
            No customer orders found. Click "+ Add New Product" above to create your first item!
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
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#ca498c]/20 text-[#ca498c]">
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
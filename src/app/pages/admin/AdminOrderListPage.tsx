import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Copy } from "lucide-react";
import { toast } from "sonner";
import { useAppData, type Order } from "@/app/context/AppDataContext";

export default function AdminOrderListPage() {
  const { orders, addOrder } = useAppData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const customerOrders = orders.filter(
    (o) =>
      (o.status === "Paid" || o.status === "Pending") &&
      Boolean(o.customer && o.customer.trim() && o.customer.trim() !== "General Customer")
  );

  const filteredOrders = customerOrders.filter((o) => {
    const matchesSearch =
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());

    const matchesPayment = paymentFilter === "All" || o.payment === paymentFilter;

    return matchesSearch && matchesPayment;
  });

  async function handleDuplicateOrder(e: React.MouseEvent, sourceOrder: Order) {
    e.stopPropagation();

    const nextCustomer = window.prompt(
      `Duplicate "${sourceOrder.title}" for a different customer.\nEnter new customer name:`,
      ""
    );

    if (nextCustomer === null) return;
    const trimmedCustomer = nextCustomer.trim();

    if (!trimmedCustomer) {
      toast.error("Please enter a customer name.");
      return;
    }

    if (trimmedCustomer.toLowerCase() === (sourceOrder.customer ?? "").trim().toLowerCase()) {
      toast.error("Enter a different customer name to duplicate this order.");
      return;
    }

    setDuplicatingId(sourceOrder.id);
    try {
      const clonedOrder: Order = {
        ...sourceOrder,
        id: `#YC-CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: trimmedCustomer,
        paymentDate: new Date().toISOString().split("T")[0],
        images: [...(sourceOrder.images ?? [])],
      };

      await addOrder(clonedOrder);
      toast.success(`Duplicated order for ${trimmedCustomer} (${clonedOrder.id}).`);
    } catch (err: any) {
      console.error("Duplicate error:", err);
      toast.error(err?.message ? `Database error: ${err.message}` : "Failed to duplicate order.");
    } finally {
      setDuplicatingId(null);
    }
  }

  return (
    <div className="text-white">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-['Crimson_Text',serif] text-[56px] text-white leading-tight">
            Order List
          </h1>
          <p className="font-['Roboto',sans-serif] text-[18px] text-white/70">
            Manage and track all customer orders. Click an order to view details and update Pending/Paid status.
          </p>
        </div>
      </div>

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

      <div className="bg-[#140e11] border border-white/15 rounded-[16px] overflow-hidden shadow-xl">
        <div className="grid grid-cols-8 px-6 py-4 border-b border-white/10 text-xs font-medium text-white/50 uppercase tracking-wider">
          <span>Order ID</span>
          <span>Customer</span>
          <span>Category</span>
          <span>Price</span>
          <span>Payment</span>
          <span>Date</span>
          <span>Status</span>
          <span className="text-right">Action</span>
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
                onClick={() => navigate(`/admin/order-list/${encodeURIComponent(order.id)}`)}
                className="grid grid-cols-8 px-6 py-4 items-center text-sm text-white/90 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="font-medium text-[#ca498c]">{order.id}</span>
                <span>{order.customer}</span>
                <span>{order.category}</span>
                <span>₱{order.price}</span>
                <span>{order.payment || "GCASH"}</span>
                <span>{order.paymentDate || "N/A"}</span>
                <span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === "Paid"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </span>
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={duplicatingId === order.id}
                    onClick={(e) => handleDuplicateOrder(e, order)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#ca498c]/30 text-xs font-medium text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {duplicatingId === order.id ? "Copying..." : "Duplicate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
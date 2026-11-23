import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save, Trash2, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAppData, type Order } from "@/app/context/AppDataContext";
import { AdminDropdown } from "@/app/components/admin/AdminDropdown";

const ORDER_STATUS_OPTIONS = ["Pending", "Paid"] as const;
const PAYMENT_OPTIONS = ["GCASH", "CASH"] as const;

const inputCls =
  "w-full h-[48px] px-4 bg-[#140e11] border border-[rgba(255,255,255,0.25)] rounded-[10px] font-['Roboto',sans-serif] text-[15px] text-white outline-none focus:border-[#ca498c]/60 placeholder:text-white/30";
const labelCls =
  "block font-['Roboto',sans-serif] font-medium text-[20px] text-white/75 mb-2";

function normalizeOrderStatus(status?: Order["status"]): "Pending" | "Paid" {
  return status === "Paid" ? "Paid" : "Pending";
}

export default function AdminOrderDetailPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const { orders, updateOrder, deleteOrder } = useAppData();
  const navigate = useNavigate();

  const orderId = rawId ? decodeURIComponent(rawId) : "";
  const order = orders.find((o) => o.id === orderId);

  const [status, setStatus] = useState<"Pending" | "Paid">(
    normalizeOrderStatus(order?.status)
  );
  const [customer, setCustomer] = useState(order?.customer ?? "");
  const [payment, setPayment] = useState<"GCASH" | "CASH">(order?.payment ?? "GCASH");
  const [paymentDate, setPaymentDate] = useState(order?.paymentDate ?? "");
  const [notes, setNotes] = useState(order?.notes ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(normalizeOrderStatus(order.status));
      setCustomer(order.customer ?? "");
      setPayment(order.payment ?? "GCASH");
      setPaymentDate(order.paymentDate ?? "");
      setNotes(order.notes ?? "");
    }
  }, [order]);

  async function handleSaveChanges() {
    if (!order) return;
    setIsSaving(true);
    try {
      await updateOrder(order.id, {
        status,
        customer: customer.trim(),
        payment,
        paymentDate: paymentDate.trim(),
        notes: notes.trim(),
      });
      toast.success(`Order ${order.id} updated to ${status}.`);
      navigate("/admin/order-list");
    } catch (err: any) {
      console.error("Failed to update order:", err);
      toast.error(err?.message ? `Database error: ${err.message}` : "Failed to update order.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteOrder() {
    if (!order) return;
    setIsDeleting(true);
    try {
      await deleteOrder(order.id);
      toast.success(`Order ${order.id} deleted.`);
      navigate("/admin/order-list");
    } catch (err: any) {
      console.error("Failed to delete order:", err);
      toast.error(err?.message ? `Database error: ${err.message}` : "Failed to delete order.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (!order) {
    return (
      <div className="text-white">
        <button
          type="button"
          onClick={() => navigate("/admin/order-list")}
          className="inline-flex items-center gap-2 h-[46px] px-5 mb-6 bg-[#140e11] border border-white/20 rounded-[12px] text-sm text-white/80 hover:border-white/40 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Order List
        </button>
        <div className="bg-[#140e11] border border-white/15 rounded-[16px] p-10 text-center text-white/60">
          Order not found. It may have been removed or is still loading.
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/order-list")}
            className="inline-flex items-center gap-2 h-[42px] px-4 mb-3 bg-[#140e11] border border-white/20 rounded-[10px] text-sm text-white/75 hover:border-white/40 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Order List
          </button>
          <h1 className="font-['Crimson_Text',serif] text-[56px] text-white leading-tight">
            Order Details
          </h1>
          <p className="font-['Roboto',sans-serif] text-[20px] text-white/75">
            Viewing <span className="text-[#ca498c] font-semibold">{order.id}</span> — update status between Pending and Paid.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            onClick={handleDeleteOrder}
            disabled={isSaving || isDeleting}
            className="h-[64px] px-6 bg-[#140e11] border border-red-500/30 rounded-[15px] font-['Roboto',sans-serif] font-medium text-[18px] text-red-400 hover:border-red-500/60 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            Delete
          </button>
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving || isDeleting}
            className="h-[64px] px-8 bg-[#ca498c] border border-white/25 rounded-[15px] font-['Roboto',sans-serif] font-semibold text-[20px] text-white hover:bg-[#b83d7a] transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? "Saving..." : "Save Order"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Order & Customer Status Card */}
        <div className="bg-[#140e11] border border-[rgba(255,255,255,0.25)] rounded-[15px] p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="font-['Roboto',sans-serif] font-bold text-[22px] text-white/85">
              Order & Payment Status
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                status === "Paid"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}
            >
              {status}
            </span>
          </div>

          <div>
            <label className={labelCls}>Order ID</label>
            <input value={order.id} readOnly className={`${inputCls} opacity-75 cursor-not-allowed`} />
          </div>

          <div>
            <label className={labelCls}>Status (Pending / Paid)</label>
            <AdminDropdown
              options={[...ORDER_STATUS_OPTIONS]}
              value={status}
              onChange={(val) => setStatus(val as "Pending" | "Paid")}
            />
          </div>

          <div>
            <label className={labelCls}>Customer</label>
            <input
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Customer name"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Payment Method</label>
            <AdminDropdown
              options={[...PAYMENT_OPTIONS]}
              value={payment}
              onChange={(val) => setPayment(val as "GCASH" | "CASH")}
            />
          </div>

          <div>
            <label className={labelCls}>Order / Payment Date</label>
            <div className="relative">
              <input
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                placeholder="YYYY-MM-DD"
                className={`${inputCls} pr-10`}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Delivery notes, contact details, or remarks..."
              className="w-full px-4 py-3 bg-[#140e11] border border-[rgba(255,255,255,0.25)] rounded-[10px] font-['Roboto',sans-serif] text-[15px] text-white outline-none focus:border-[#ca498c]/60 resize-none"
            />
          </div>
        </div>

        {/* Item Summary Card */}
        <div className="bg-[#140e11] border border-[rgba(255,255,255,0.25)] rounded-[15px] p-6 flex flex-col gap-5">
          <h2 className="font-['Roboto',sans-serif] font-bold text-[22px] text-white/85">
            Ordered Item Summary
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/25 border border-white/10 rounded-[12px] p-4">
              <p className="text-xs text-white/50 uppercase mb-1">Arrangement / Title</p>
              <p className="text-base font-medium text-white">{order.title}</p>
            </div>
            <div className="bg-black/25 border border-white/10 rounded-[12px] p-4">
              <p className="text-xs text-white/50 uppercase mb-1">Total Price</p>
              <p className="text-base font-semibold text-[#ca498c]">₱{order.price}</p>
            </div>
            <div className="bg-black/25 border border-white/10 rounded-[12px] p-4">
              <p className="text-xs text-white/50 uppercase mb-1">Category</p>
              <p className="text-base text-white">{order.category}</p>
            </div>
            <div className="bg-black/25 border border-white/10 rounded-[12px] p-4">
              <p className="text-xs text-white/50 uppercase mb-1">Specifications</p>
              <p className="text-sm text-white/85">{order.definition || "Standard specification"}</p>
            </div>
          </div>

          <div className="bg-black/25 border border-white/10 rounded-[12px] p-4">
            <p className="text-xs text-white/50 uppercase mb-1">Instructions / Description</p>
            <p className="text-sm text-white/85 whitespace-pre-line">
              {order.description || "No additional instructions."}
            </p>
          </div>

          {order.images && order.images.length > 0 && (
            <div>
              <p className="text-xs text-white/50 uppercase mb-2">Attached Images</p>
              <div className="flex flex-wrap gap-3">
                {order.images.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`${order.title} ${idx + 1}`}
                    className="w-28 h-28 object-cover rounded-[10px] border border-white/20"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
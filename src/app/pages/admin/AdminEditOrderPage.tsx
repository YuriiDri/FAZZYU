import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { Upload, X, Calendar, Heart } from "lucide-react";
import { toast } from "sonner";
import { useAppData, type Order } from "@/app/context/AppDataContext";
import { AdminDropdown } from "@/app/components/admin/AdminDropdown";

const STATUS_OPTIONS = ["Available", "Out of Stock", "Paid", "Pending"];
const CATEGORY_OPTIONS = ["Bouquet", "Themed", "Dolls", "Craft"];
const PAYMENT_OPTIONS = ["GCASH", "CASH"];

const inputCls =
  "w-full h-[48px] px-4 bg-[#140e11] border border-[rgba(255,255,255,0.25)] rounded-[10px] font-['Roboto',sans-serif] text-[15px] text-white outline-none focus:border-[#ca498c]/60 placeholder:text-white/30";
const labelCls =
  "block font-['Roboto',sans-serif] font-medium text-[22px] text-white/75 mb-2";

export default function AdminEditOrderPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const { orders, updateOrder, deleteOrder } = useAppData();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const id = rawId ? decodeURIComponent(rawId) : "";
  const order = orders.find((o) => o.id === id);

  const [title, setTitle] = useState(order?.title ?? "");
  const [price, setPrice] = useState(String(order?.price ?? ""));
  const [category, setCategory] = useState(order?.category ?? "Bouquet");
  const [status, setStatus] = useState<Order["status"]>(order?.status ?? "Available");
  const [definition, setDefinition] = useState(order?.definition ?? "");
  const [customer, setCustomer] = useState(order?.customer ?? "");
  
  // Keep existing Order ID if it already has one; otherwise leave blank until customer is entered
  const [orderId, setOrderId] = useState(
    order?.id && order.id.startsWith("#YC-") ? order.id : ""
  );

  const [payment, setPayment] = useState<"GCASH" | "CASH">(order?.payment ?? "GCASH");
  const [paymentDate, setPaymentDate] = useState(order?.paymentDate ?? "");
  const [notes, setNotes] = useState(order?.notes ?? "");
  const [images, setImages] = useState<string[]>(order?.images ?? []);

  if (!order) {
    return (
      <div className="text-white text-center py-20">
        <p className="font-['Roboto',sans-serif] text-[20px]">Order not found.</p>
        <button
          onClick={() => navigate("/admin/orders")}
          className="mt-4 text-[#ca498c] underline cursor-pointer"
        >
          Back to orders
        </button>
      </div>
    );
  }

  // Auto-generate Order ID when customer name is typed for a product
  function handleCustomerChange(value: string) {
    setCustomer(value);
    if (value.trim() && !orderId) {
      setOrderId(`#YC-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result)
          setImages((prev) => [...prev, e.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }

  // Move selected photo to position 0 so it becomes the main cover image
  function handleSetPrimary(idx: number) {
    setImages((prev) => {
      const updated = [...prev];
      const [selected] = updated.splice(idx, 1);
      updated.unshift(selected);
      return updated;
    });
    toast.success("Set as main product image.");
  }

  function handleSave() {
    if (!title.trim()) {
      toast.error("Please fill in Order Title.");
      return;
    }
    updateOrder(order.id, {
      id: orderId || order.id,
      title,
      price: Number(price),
      category,
      status,
      definition,
      customer,
      payment,
      paymentDate,
      notes,
      images,
    });
    toast.success("Order updated.");
    navigate("/admin/orders");
  }

  function handleDelete() {
    deleteOrder(order.id);
    toast.success("Order deleted.");
    navigate("/admin/orders");
  }

  return (
    <div className="text-white">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-['Crimson_Text',serif] text-[64px] text-white leading-tight">
            Edit Order
          </h1>
          <p className="font-['Roboto',sans-serif] text-[24px] text-white leading-snug">
            Update an existing order.
          </p>
        </div>

        {/* Cancel + Save Order */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => navigate(-1)}
            className="h-[72px] px-8 bg-[#140e11] border border-[rgba(255,255,255,0.25)] rounded-[15px] font-['Roboto',sans-serif] font-medium text-[20px] text-[rgba(255,255,255,0.74)] hover:border-white/40 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-[72px] px-8 bg-[#ca498c] border border-[rgba(255,255,255,0.25)] rounded-[15px] font-['Roboto',sans-serif] font-semibold text-[22px] text-[rgba(255,255,255,0.74)] hover:bg-[#b83d7a] transition-colors cursor-pointer"
          >
            Save Order
          </button>
        </div>
      </div>

      {/* ── Two-column panels ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Left: Order Information */}
        <div className="bg-[#140e11] border border-[rgba(255,255,255,0.25)] rounded-[15px] p-6">
          <h2 className="font-['Roboto',sans-serif] font-bold text-[23px] text-white/75 mb-6">
            Order Information
          </h2>
          <div className="flex flex-col gap-5">
            <div>
              <label className={labelCls}>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <AdminDropdown
                options={CATEGORY_OPTIONS}
                value={category}
                onChange={setCategory}
              />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <AdminDropdown
                options={STATUS_OPTIONS}
                value={status}
                onChange={(v) => setStatus(v as Order["status"])}
              />
            </div>
            <div>
              <label className={labelCls}>Definition</label>
              <textarea
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-[#140e11] border border-[rgba(255,255,255,0.25)] rounded-[10px] font-['Roboto',sans-serif] text-[15px] text-white outline-none focus:border-[#ca498c]/60 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Order Details */}
        <div className="bg-[#140e11] border border-[rgba(255,255,255,0.25)] rounded-[15px] p-6">
          {/* Panel header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Roboto',sans-serif] font-bold text-[23px] text-white/75">
              Order Details
            </h2>
            <button
              onClick={handleDelete}
              className="h-[48px] px-5 bg-[#140e11] border border-[rgba(255,255,255,0.25)] rounded-[15px] font-['Roboto',sans-serif] font-medium text-[20px] text-[rgba(233,44,44,0.74)] hover:border-red-500/40 transition-colors whitespace-nowrap cursor-pointer"
            >
              Delete Order
            </button>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <label className={labelCls}>Order ID</label>
              <input
                value={orderId || "Will generate upon customer entry"}
                readOnly
                className={`${inputCls} opacity-60 cursor-not-allowed`}
              />
            </div>
            <div>
              <label className={labelCls}>Customer</label>
              <input
                value={customer}
                onChange={(e) => handleCustomerChange(e.target.value)}
                placeholder="Enter customer name..."
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Payment Method</label>
              <AdminDropdown
                options={PAYMENT_OPTIONS}
                value={payment}
                onChange={(v) => setPayment(v as "GCASH" | "CASH")}
              />
            </div>
            <div>
              <label className={labelCls}>Payment Date</label>
              <div className="relative">
                <input
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  placeholder="e.g. 22 May 2024"
                  className={`${inputCls} pr-10`}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-[#140e11] border border-[rgba(255,255,255,0.25)] rounded-[10px] font-['Roboto',sans-serif] text-[15px] text-white outline-none focus:border-[#ca498c]/60 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Attach Product Image ── */}
      <div className="bg-[#140e11] border border-[rgba(255,255,255,0.25)] rounded-[15px] p-6">
        <h2 className="font-['Roboto',sans-serif] font-bold text-[23px] text-white/75 mb-1">
          Attach Product Image
        </h2>
        <p className="font-['Roboto',sans-serif] text-[18px] text-white/75 mb-5">
          Click the heart icon on an image to set it as the primary cover photo for the shop.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-[195px] h-[177px] bg-[#140e11] border border-dashed border-[rgba(255,255,255,0.25)] rounded-[12px] flex flex-col items-center justify-center gap-3 hover:border-[#ca498c]/60 transition-colors cursor-pointer"
          >
            <Upload className="w-10 h-10 text-white/60" />
            <span className="font-['Roboto',sans-serif] text-[14px] text-white/75">
              Click to upload image
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {images.map((src, i) => {
            const isPrimary = i === 0;

            return (
              <div
                key={i}
                className="relative group w-[166px] h-[177px] rounded-[12px] overflow-hidden border border-[rgba(255,255,255,0.25)]"
              >
                <img src={src} alt="" className="w-full h-full object-cover" />

                {/* Overlay Controls: Heart & Delete */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(i)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      isPrimary ? "bg-[#ca498c] text-white" : "bg-black/60 text-white hover:bg-[#ca498c]/70"
                    }`}
                    title={isPrimary ? "Main Cover Photo" : "Set as Cover Photo"}
                  >
                    <Heart className={`w-4 h-4 ${isPrimary ? "fill-white text-white" : "text-white"}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="w-9 h-9 bg-black/60 rounded-full flex items-center justify-center hover:bg-red-600/80 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* MAIN Badge */}
                {isPrimary && (
                  <span className="absolute bottom-2 left-2 bg-[#ca498c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full pointer-events-none">
                    MAIN
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
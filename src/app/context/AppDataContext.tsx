import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";

import imgItemMain from "@/imports/ItemPage/8bbe4ef13bf84089b951b93a9d69a2de0996fbf9.png";
import imgExampleImage from "@/imports/ShopPage/bd0d35e3b33ca2ee7e667baf374d09ada53d69bc.png";
import imgGallerySample from "@/imports/GalleryPage/8bbe4ef13bf84089b951b93a9d69a2de0996fbf9.png";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  status: "Available" | "Sold Out";
  image: string;
  description: string;
  bouquetType: string;
  size: string;
};

export type Order = {
  id: string;
  title: string;
  price: number;
  category: string;
  status: "Available" | "Preorder" | "Out of Stock" | "Paid" | "Pending";
  description: string;
  definition: string;
  customer: string;
  payment: "GCASH" | "CASH";
  paymentDate: string;
  notes?: string;
  images: string[];
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  lastRestock: string;
  unitPrice: number;
  totalValue: number;
  supplier: string;
  supplierLink?: string;
};

export type GalleryImage = {
  id: string;
  src: string;
  productId?: number;
};

export type CustomizedMaterial = {
  id: string;
  name: string;
  category: "flower" | "wrapper";
  price: number;
  image?: string;
};

export type CustomOrderSubmission = {
  orderId: string;
  title: string;
  price: number;
  category: string;
  size: string;
  themeInput?: string;
  description: string;
  definition: string;
  customerName: string;
  customerContact: string;
  customerAddress: string;
  notes: string;
  selectedMaterials: { materialId: string; quantity: number }[];
  images: string[];
  aiConcepts?: { prompt: string; imageUrl: string }[];
  submissionMethod?: "Form" | "AI Chat";
};

export type PhotoboothQrRecord = {
  shareCode: string;
  presetId: string;
  bannerTitle: string;
  bannerSubtitle?: string;
  autoStickers: boolean;
  customerId?: number | null;
  orderId?: string | null;
};

type ImageOrders = Record<number, number[]>;

interface AppDataContextValue {
  products: Product[];
  getPrimaryImageIndex: (productId: number) => number;
  setPrimaryImage: (productId: number, imgIndex: number) => void;

  orders: Order[];
  addOrder: (o: Order) => Promise<void>;
  submitNormalizedCustomOrder: (payload: CustomOrderSubmission) => Promise<void>;
  updateOrder: (id: string, patch: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  inventory: InventoryItem[];
  addInventoryItem: (item: InventoryItem) => Promise<void>;
  updateInventoryItem: (id: string, patch: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;

  galleryImages: GalleryImage[];
  addGalleryImage: (img: GalleryImage) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;

  customizedMaterials: CustomizedMaterial[];
  addCustomizedMaterial: (item: CustomizedMaterial) => Promise<void>;
  updateCustomizedMaterial: (id: string, patch: Partial<CustomizedMaterial>) => Promise<void>;
  deleteCustomizedMaterial: (id: string) => Promise<void>;

  // Photobooth QR & Session DB Functions
  savePhotoboothQrCode: (params: PhotoboothQrRecord) => Promise<void>;
  logPhotoboothActivity: (shareCode?: string) => Promise<void>;

  // AI Chat Session & Message DB Functions
  createChatSession: () => Promise<number | null>;
  logChatMessage: (sessionId: number | null, sender: "Customer" | "AI", messageText: string) => Promise<void>;
}

const SEED_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Lily Gold Purple Bouquet",
    price: 170,
    category: "Bouquets",
    status: "Available",
    image: imgItemMain,
    description:
      "A beautiful handmade bouquet featuring vibrant yellow lilies, delicate purple and pink flowers, and lush greenery, wrapped in elegant lavender paper with a soft white ribbon.",
    bouquetType: "Medium Bouquet",
    size: "Approx. 35cm H",
  },
  {
    id: 2,
    name: "Pink Lily Bouquet",
    price: 120,
    category: "Bouquets",
    status: "Available",
    image: imgExampleImage,
    description:
      "A delicate handmade bouquet of soft pink lilies crafted with fuzzy wire, wrapped in pastel tissue paper. Perfect for expressing warmth and affection.",
    bouquetType: "Small Bouquet",
    size: "Approx. 28cm H",
  },
  {
    id: 3,
    name: "Sunset Rose Arrangement",
    price: 150,
    category: "Bouquets",
    status: "Available",
    image: imgExampleImage,
    description:
      "A vibrant bouquet of sunset-colored roses in orange, coral, and yellow hues, handcrafted with premium fuzzy wire and wrapped in kraft paper.",
    bouquetType: "Medium Bouquet",
    size: "Approx. 32cm H",
  },
  {
    id: 4,
    name: "Lavender Dream Bouquet",
    price: 130,
    category: "Bouquets",
    status: "Available",
    image: imgExampleImage,
    description:
      "Soft lavender-toned flowers artfully bundled in a romantic arrangement. Wrapped in white crinkle paper with a satin ribbon.",
    bouquetType: "Small Bouquet",
    size: "Approx. 25cm H",
  },
  {
    id: 5,
    name: "Pastel Garden Mix",
    price: 200,
    category: "Bouquets",
    status: "Available",
    image: imgExampleImage,
    description:
      "A luxurious mix of pastel-toned handmade flowers — blush, mint, and ivory — creating a garden-fresh aesthetic in a large round arrangement.",
    bouquetType: "Large Bouquet",
    size: "Approx. 45cm H",
  },
  {
    id: 6,
    name: "Cherry Blossom Bundle",
    price: 110,
    category: "Themed",
    status: "Available",
    image: imgExampleImage,
    description:
      "Inspired by Japanese spring, this themed arrangement features delicate cherry blossom-styled fuzzy wire blooms in light pink.",
    bouquetType: "Themed Arrangement",
    size: "Approx. 30cm H",
  },
];

const SEED_GALLERY: GalleryImage[] = [
  { id: "1", src: imgGallerySample, productId: 1 },
  { id: "2", src: imgItemMain, productId: 1 },
  { id: "3", src: imgExampleImage, productId: 2 },
  { id: "4", src: imgExampleImage, productId: 3 },
];

const SEED_MATERIALS: CustomizedMaterial[] = [
  { id: "1", name: "Sunflower", category: "flower", price: 50 },
  { id: "2", name: "Rose", category: "flower", price: 40 },
  { id: "3", name: "Classic Cellophane", category: "wrapper", price: 30 },
  { id: "4", name: "Korean Paper", category: "wrapper", price: 45 },
];

const AppDataContext = createContext<AppDataContextValue | null>(null);

function loadFromStorage() {
  try {
    const raw = localStorage.getItem("yc_app_data");
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

function saveToStorage(data: object) {
  try {
    localStorage.setItem("yc_app_data", JSON.stringify(data));
  } catch {
    // ignore
  }
}

// Helper: Map UI status <-> Phase 3 DB status
function mapDbStatusToUi(dbStatus: string): Order["status"] {
  switch (dbStatus) {
    case "Delivered":
      return "Paid";
    case "Cancelled":
      return "Out of Stock";
    case "Preorder":
      return "Preorder";
    case "Processing":
    case "Out for Delivery":
      return "Available";
    default:
      return "Pending";
  }
}

function mapUiStatusToDb(uiStatus?: string): string {
  switch (uiStatus) {
    case "Paid":
      return "Delivered";
    case "Out of Stock":
      return "Cancelled";
    case "Preorder":
      return "Preorder";
    case "Available":
      return "Processing";
    case "Processing":
    case "Out for Delivery":
    case "Delivered":
    case "Cancelled":
      return uiStatus;
    default:
      return "Pending";
  }
}

function normalizeOrderId(rawId: string): string {
  const cleaned = rawId.trim();
  if (cleaned.startsWith("#YC-CUST-")) return cleaned.slice(0, 30);
  if (/^#YC-\d+$/i.test(cleaned)) return cleaned.toUpperCase().slice(0, 30);
  const suffix = cleaned.replace(/^#?(YC-CUST-|YC-)?/i, "");
  return `#YC-CUST-${suffix}`.slice(0, 30);
}

function detectDeliveryZoneId(address: string): number | null {
  const lower = address.toLowerCase();
  if (lower.includes("pulanglupa")) return 1;
  if (lower.includes("naga")) return 2;
  if (lower.includes("bf")) return 3;
  if (lower.includes("sucat")) return 4;
  if (lower.includes("makati")) return 5;
  return null;
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const stored = loadFromStorage();

  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [imageOrders, setImageOrders] = useState<ImageOrders>(stored?.imageOrders ?? {});
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [customizedMaterials, setCustomizedMaterials] = useState<CustomizedMaterial[]>([]);

  async function fetchAllNormalizedData() {
    const [
      { data: prodData, error: prodErr },
      { data: orderData, error: orderErr },
      { data: matData, error: matErr },
      { data: galData, error: galErr },
    ] = await Promise.all([
      supabase
        .from("product")
        .select(
          "product_id, product_name, description, price, stock_quantity, image_url, is_visible, category(category_name)"
        )
        .order("product_id", { ascending: true }),
      supabase
        .from("orders")
        .select(`
          order_id,
          payment_method,
          order_date,
          status,
          street,
          size,
          color,
          addon,
          notes,
          customer(first_name, last_name, email, phone),
          customization_inquiry(
            inquiry_id,
            arrangement,
            additional_instructions,
            estimated_price,
            final_price,
            reference_image(image_url),
            ai_design(generated_image_url)
          ),
          order_item(quantity, unit_price, product(product_name, category(category_name)))
        `)
        .order("order_date", { ascending: false }),
      supabase
        .from("material")
        .select(
          "material_id, item_name, color, description, image_url, stock, unit, unit_price, last_restock, is_available, material_type(type_name)"
        )
        .order("material_id", { ascending: true }),
      supabase
        .from("gallery_image")
        .select("gallery_image_id, image_url, caption, display_order")
        .order("display_order", { ascending: true }),
    ]);

    // 1. Products
    if (!prodErr && prodData && prodData.length > 0) {
      setProducts(
        prodData.map((p: any) => {
          const catName = p.category?.category_name || "Bouquets";
          const inStock = (p.stock_quantity ?? 0) > 0 && p.is_visible !== false;
          return {
            id: p.product_id,
            name: p.product_name,
            price: Number(p.price ?? 0),
            category: catName,
            status: inStock ? "Available" : "Sold Out",
            image: p.image_url || imgExampleImage,
            description: p.description || "Handmade fuzzy-wire craft by Yuri's Craft.",
            bouquetType: `${catName} Arrangement`,
            size: "Standard",
          };
        })
      );
    } else {
      setProducts(SEED_PRODUCTS);
    }

    // 2. Orders
    if (!orderErr && orderData) {
      const formattedOrders: Order[] = orderData.map((row: any) => {
        const cust = row.customer;
        const inq = row.customization_inquiry;
        const items = row.order_item || [];

        const itemTotal = items.reduce(
          (sum: number, it: any) => sum + Number(it.quantity || 0) * Number(it.unit_price || 0),
          0
        );
        const computedPrice =
          itemTotal > 0
            ? itemTotal
            : Number(inq?.final_price ?? inq?.estimated_price ?? 0);

        const refImgs = (inq?.reference_image || []).map((r: any) => r.image_url).filter(Boolean);
        const aiImgs = (inq?.ai_design || []).map((a: any) => a.generated_image_url).filter(Boolean);
        const allImages = Array.from(new Set([...refImgs, ...aiImgs]));

        const firstProductCat = items[0]?.product?.category?.category_name;
        const inferredCat =
          firstProductCat ||
          (inq?.arrangement?.includes("Dolls")
            ? "Dolls"
            : inq?.arrangement?.includes("Themed")
            ? "Themed"
            : inq?.arrangement?.includes("Crafts")
            ? "Crafts"
            : "Bouquets");

        const customerFullName = cust
          ? `${cust.first_name || ""} ${cust.last_name || ""}`.trim()
          : "";

        const defParts = [
          row.size ? `Size: ${row.size}` : null,
          row.color ? `Color: ${row.color}` : null,
          row.addon ? `Add-on: ${row.addon}` : null,
          row.street ? `Address: ${row.street}` : null,
        ].filter(Boolean);

        return {
          id: row.order_id,
          title: inq?.arrangement || items[0]?.product?.product_name || "Custom Creation",
          price: computedPrice,
          category: inferredCat,
          status: mapDbStatusToUi(row.status),
          description: inq?.additional_instructions || "Custom client request.",
          definition: defParts.join(" | ") || "Standard specification",
          customer: customerFullName,
          payment: row.payment_method === "COD" ? "CASH" : "GCASH",
          paymentDate: row.order_date || new Date().toISOString().split("T")[0],
          notes: row.notes || "",
          images: allImages,
        };
      });
      setOrders(formattedOrders);
    }

    // 3. Materials -> feeds BOTH `inventory` & `customizedMaterials`
    if (!matErr && matData && matData.length > 0) {
      const formattedInv: InventoryItem[] = matData.map((m: any) => {
        const stockNum = Number(m.stock ?? 0);
        const unitPriceNum = Number(m.unit_price ?? 0);
        return {
          id: String(m.material_id),
          name: m.item_name,
          category: m.material_type?.type_name || "Fuzzy Wire",
          stock: stockNum,
          unit: m.unit || "pcs",
          lastRestock: m.last_restock || new Date().toISOString().split("T")[0],
          unitPrice: unitPriceNum,
          totalValue: stockNum * unitPriceNum,
          supplier: m.description || "Craft Supplies PH",
          supplierLink: m.image_url || "",
        };
      });
      setInventory(formattedInv);

      const customMats: CustomizedMaterial[] = matData
        .filter((m: any) => m.is_available !== false)
        .map((m: any) => {
          const tName = (m.material_type?.type_name || "").toLowerCase();
          const matCategory: "flower" | "wrapper" =
            tName.includes("wrap") || tName.includes("paper") || tName.includes("fabric")
              ? "wrapper"
              : "flower";
          return {
            id: String(m.material_id),
            name: m.item_name,
            category: matCategory,
            price: Number(m.unit_price ?? 0),
            image: m.image_url || undefined,
          };
        });
      setCustomizedMaterials(customMats.length > 0 ? customMats : SEED_MATERIALS);
    } else {
      setCustomizedMaterials(SEED_MATERIALS);
    }

    // 4. Gallery
    if (!galErr && galData && galData.length > 0) {
      setGalleryImages(
        galData.map((g: any) => ({
          id: String(g.gallery_image_id),
          src: g.image_url,
          productId: undefined,
        }))
      );
    } else {
      setGalleryImages(SEED_GALLERY);
    }
  }

  useEffect(() => {
    fetchAllNormalizedData();

    const channel = supabase
      .channel("fazzyu-3nf-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => fetchAllNormalizedData())
      .on("postgres_changes", { event: "*", schema: "public", table: "customization_inquiry" }, () => fetchAllNormalizedData())
      .on("postgres_changes", { event: "*", schema: "public", table: "product" }, () => fetchAllNormalizedData())
      .on("postgres_changes", { event: "*", schema: "public", table: "material" }, () => fetchAllNormalizedData())
      .on("postgres_changes", { event: "*", schema: "public", table: "gallery_image" }, () => fetchAllNormalizedData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    saveToStorage({ imageOrders });
  }, [imageOrders]);

  function getPrimaryImageIndex(productId: number): number {
    const order = imageOrders[productId];
    return order?.[0] ?? 0;
  }

  function setPrimaryImage(productId: number, imgIndex: number) {
    setImageOrders((prev) => {
      const current = prev[productId] ?? [];
      const rest = current.filter((i) => i !== imgIndex);
      return { ...prev, [productId]: [imgIndex, ...rest] };
    });
  }

  async function findOrCreateCustomer(fullName: string, contact?: string): Promise<number> {
    const parts = fullName.trim().split(/\s+/);
    const firstName = (parts[0] || "Guest").slice(0, 50);
    const lastName = (parts.slice(1).join(" ") || "Customer").slice(0, 50);
    const isEmail = contact?.includes("@");
    const cleanEmail = isEmail ? contact!.trim().slice(0, 150) : null;
    const cleanPhone =
      !isEmail && contact
        ? contact.replace(/[^0-9+-]/g, "").slice(0, 20) || null
        : null;

    if (cleanEmail) {
      const { data: byEmail } = await supabase
        .from("customer")
        .select("customer_id")
        .eq("email", cleanEmail)
        .maybeSingle();
      if (byEmail) return byEmail.customer_id;
    }

    const { data: existing } = await supabase
      .from("customer")
      .select("customer_id")
      .ilike("first_name", firstName)
      .ilike("last_name", lastName)
      .limit(1)
      .maybeSingle();

    if (existing) return existing.customer_id;

    const { data: inserted, error } = await supabase
      .from("customer")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: cleanEmail,
        phone: cleanPhone && cleanPhone.length >= 7 ? cleanPhone : null,
      })
      .select("customer_id")
      .single();

    if (error) throw error;
    return inserted.customer_id;
  }

  // Full 3NF Custom Order Submission (`customer` -> `customization_inquiry` -> `inquiry_material` -> `reference_image` -> `ai_design` -> `orders`)
  async function submitNormalizedCustomOrder(payload: CustomOrderSubmission) {
    const validOrderId = normalizeOrderId(payload.orderId);
    const customerId = await findOrCreateCustomer(payload.customerName, payload.customerContact);

    // 1. Insert Customization Inquiry
    const { data: inquiryRow, error: inqErr } = await supabase
      .from("customization_inquiry")
      .insert({
        customer_id: customerId,
        submission_method: payload.submissionMethod || "Form",
        arrangement: payload.title.slice(0, 100),
        additional_instructions: payload.description || null,
        estimated_price: payload.price,
        final_price: payload.price,
        status: "Pending",
      })
      .select("inquiry_id")
      .single();

    if (inqErr) throw inqErr;
    const inquiryId = inquiryRow.inquiry_id;

    // 2. Insert Selected Materials (`inquiry_material`)
    const validMaterials = payload.selectedMaterials
      .map((m) => ({
        materialId: Number(m.materialId),
        quantity: m.quantity,
      }))
      .filter((m) => Number.isFinite(m.materialId) && m.materialId > 0 && m.quantity > 0);

    if (validMaterials.length > 0) {
      await supabase.from("inquiry_material").insert(
        validMaterials.map((m) => ({
          inquiry_id: inquiryId,
          material_id: m.materialId,
          quantity: m.quantity,
        }))
      );
    }

    // 3. Insert Reference Images (`reference_image`)
    if (payload.images.length > 0) {
      await supabase.from("reference_image").insert(
        payload.images.map((url) => ({
          inquiry_id: inquiryId,
          image_url: url,
        }))
      );
    }

    // 4. Insert AI Designs (`ai_design`)
    if (payload.aiConcepts && payload.aiConcepts.length > 0) {
      await supabase.from("ai_design").insert(
        payload.aiConcepts.map((c) => ({
          inquiry_id: inquiryId,
          prompt_text: c.prompt || "Custom AI bouquet design",
          generated_image_url: c.imageUrl,
          disclaimer_acknowledged: true,
        }))
      );
    }

    // 5. Insert Order (`orders`)
    const zoneId = detectDeliveryZoneId(payload.customerAddress);
    const { error: orderErr } = await supabase.from("orders").insert({
      order_id: validOrderId,
      customer_id: customerId,
      inquiry_id: inquiryId,
      zone_id: zoneId,
      payment_method: "GCash",
      status: "Pending",
      street: payload.customerAddress ? payload.customerAddress.slice(0, 100) : null,
      size: payload.size || null,
      addon: payload.themeInput ? payload.themeInput.slice(0, 60) : null,
      notes: `Contact: ${payload.customerContact}\n${payload.notes}`.trim(),
    });

    if (orderErr) throw orderErr;
    await fetchAllNormalizedData();
  }

  // Admin / Standard Order Insert (`customer` -> `customization_inquiry` -> `reference_image` -> `orders`)
  async function addOrder(o: Order) {
    const validOrderId = normalizeOrderId(o.id);
    const customerId = await findOrCreateCustomer(o.customer);

    const { data: inquiryRow, error: inqErr } = await supabase
      .from("customization_inquiry")
      .insert({
        customer_id: customerId,
        submission_method: "Form",
        arrangement: (o.title || "Custom Order").slice(0, 100),
        additional_instructions: o.description || o.definition || null,
        estimated_price: Number(o.price || 0),
        final_price: Number(o.price || 0),
        status: o.status === "Paid" ? "Completed" : "Pending",
      })
      .select("inquiry_id")
      .single();

    if (inqErr) throw inqErr;

    if (o.images && o.images.length > 0) {
      await supabase.from("reference_image").insert(
        o.images.map((url) => ({
          inquiry_id: inquiryRow.inquiry_id,
          image_url: url,
        }))
      );
    }

    const { error: orderErr } = await supabase.from("orders").insert({
      order_id: validOrderId,
      customer_id: customerId,
      inquiry_id: inquiryRow.inquiry_id,
      payment_method: o.payment === "CASH" ? "COD" : "GCash",
      status: mapUiStatusToDb(o.status),
      notes: o.notes || null,
    });

    if (orderErr) throw orderErr;
    await fetchAllNormalizedData();
  }

  async function updateOrder(id: string, patch: Partial<Order>) {
    const currentOrder = orders.find((o) => o.id === id);
    const orderPatch: Record<string, any> = {};

    if (patch.status !== undefined) orderPatch.status = mapUiStatusToDb(patch.status);
    if (patch.payment !== undefined) orderPatch.payment_method = patch.payment === "CASH" ? "COD" : "GCash";
    if (patch.notes !== undefined) orderPatch.notes = patch.notes;
    if (patch.id !== undefined && patch.id.trim() && patch.id.trim() !== id) {
      orderPatch.order_id = patch.id.trim().slice(0, 30);
    }
    if (
      patch.customer !== undefined &&
      patch.customer.trim() &&
      patch.customer.trim() !== (currentOrder?.customer ?? "").trim()
    ) {
      orderPatch.customer_id = await findOrCreateCustomer(patch.customer.trim());
    }

    const { data: updatedOrder, error } = await supabase
      .from("orders")
      .update(orderPatch)
      .eq("order_id", id)
      .select("order_id, inquiry_id, customer_id")
      .maybeSingle();

    if (error) throw error;

    const targetInquiryId = updatedOrder?.inquiry_id;
    if (targetInquiryId) {
      const inqPatch: Record<string, any> = {};
      if (patch.title !== undefined) inqPatch.arrangement = patch.title.slice(0, 100);
      if (patch.price !== undefined) {
        inqPatch.estimated_price = Number(patch.price);
        inqPatch.final_price = Number(patch.price);
      }
      if (patch.description !== undefined) inqPatch.additional_instructions = patch.description;
      if (patch.status !== undefined) {
        inqPatch.status =
          patch.status === "Paid"
            ? "Completed"
            : patch.status === "Out of Stock"
            ? "Cancelled"
            : "Processing";
      }
      if (Object.keys(inqPatch).length > 0) {
        const { error: inqError } = await supabase
          .from("customization_inquiry")
          .update(inqPatch)
          .eq("inquiry_id", targetInquiryId);
        if (inqError) throw inqError;
      }
    }

    await fetchAllNormalizedData();
  }

  async function deleteOrder(id: string) {
    const { data: row } = await supabase
      .from("orders")
      .select("inquiry_id")
      .eq("order_id", id)
      .maybeSingle();

    await supabase.from("orders").delete().eq("order_id", id);
    if (row?.inquiry_id) {
      await supabase.from("customization_inquiry").delete().eq("inquiry_id", row.inquiry_id);
    }
    await fetchAllNormalizedData();
  }

  // --- INVENTORY (`material` + `material_type`) ---
  async function resolveMaterialTypeId(typeName: string): Promise<number> {
    const clean = (typeName || "Fuzzy Wire").trim().slice(0, 50);
    const { data: existing } = await supabase
      .from("material_type")
      .select("material_type_id")
      .ilike("type_name", clean)
      .limit(1)
      .maybeSingle();

    if (existing) return existing.material_type_id;

    const { data: created, error } = await supabase
      .from("material_type")
      .insert({ type_name: clean })
      .select("material_type_id")
      .single();

    if (error) return 1;
    return created.material_type_id;
  }

  async function addInventoryItem(item: InventoryItem) {
    const typeId = await resolveMaterialTypeId(item.category);
    await supabase.from("material").insert({
      item_name: item.name.slice(0, 100),
      material_type_id: typeId,
      admin_id: 1,
      stock: Math.max(0, Number(item.stock || 0)),
      unit: (item.unit || "pcs").slice(0, 20),
      unit_price: Math.max(0, Number(item.unitPrice || 0)),
      description: item.supplier || null,
      image_url: item.supplierLink || null,
      is_available: true,
    });
    await fetchAllNormalizedData();
  }

  async function updateInventoryItem(id: string, patch: Partial<InventoryItem>) {
    const numId = Number(id);
    if (!Number.isFinite(numId)) return;

    const dbPatch: Record<string, any> = {};
    if (patch.name !== undefined) dbPatch.item_name = patch.name.slice(0, 100);
    if (patch.category !== undefined) dbPatch.material_type_id = await resolveMaterialTypeId(patch.category);
    if (patch.stock !== undefined) dbPatch.stock = Math.max(0, Number(patch.stock));
    if (patch.unit !== undefined) dbPatch.unit = patch.unit.slice(0, 20);
    if (patch.unitPrice !== undefined) dbPatch.unit_price = Math.max(0, Number(patch.unitPrice));
    if (patch.supplier !== undefined) dbPatch.description = patch.supplier;
    if (patch.supplierLink !== undefined) dbPatch.image_url = patch.supplierLink;

    await supabase.from("material").update(dbPatch).eq("material_id", numId);
    await fetchAllNormalizedData();
  }

  async function deleteInventoryItem(id: string) {
    const numId = Number(id);
    if (!Number.isFinite(numId)) return;
    await supabase.from("material").delete().eq("material_id", numId);
    await fetchAllNormalizedData();
  }

  // --- GALLERY (`gallery_image`) ---
  async function addGalleryImage(img: GalleryImage) {
    const { error } = await supabase.from("gallery_image").insert({
      admin_id: 1,
      image_url: img.src,
      caption: img.productId ? `Product #${img.productId}` : "Fazzyu Showcase",
      display_order: galleryImages.length + 1,
    });
    if (!error) {
      await fetchAllNormalizedData();
    } else {
      console.error("Failed to add gallery image:", error);
    }
  }

  async function deleteGalleryImage(id: string) {
    const numId = Number(id);
    if (Number.isFinite(numId)) {
      await supabase.from("gallery_image").delete().eq("gallery_image_id", numId);
    } else {
      await supabase.from("gallery_image").delete().eq("image_url", id);
    }
    await fetchAllNormalizedData();
  }

  // --- CUSTOMIZED MATERIALS (`material` with type `flower` / `wrapper`) ---
  async function addCustomizedMaterial(item: CustomizedMaterial) {
    const typeId = await resolveMaterialTypeId(item.category);
    const { error } = await supabase.from("material").insert({
      item_name: item.name.slice(0, 100),
      material_type_id: typeId,
      admin_id: 1,
      stock: 50,
      unit: "pcs",
      unit_price: Math.max(0, Number(item.price || 0)),
      image_url: item.image || null,
      is_available: true,
    });
    if (!error) {
      await fetchAllNormalizedData();
    } else {
      console.error("Failed to add custom material:", error);
    }
  }

  async function updateCustomizedMaterial(id: string, patch: Partial<CustomizedMaterial>) {
    const numId = Number(id);
    if (!Number.isFinite(numId)) return;

    const dbPatch: Record<string, any> = {};
    if (patch.name !== undefined) dbPatch.item_name = patch.name.slice(0, 100);
    if (patch.category !== undefined) dbPatch.material_type_id = await resolveMaterialTypeId(patch.category);
    if (patch.price !== undefined) dbPatch.unit_price = Math.max(0, Number(patch.price));
    if (patch.image !== undefined) dbPatch.image_url = patch.image;

    await supabase.from("material").update(dbPatch).eq("material_id", numId);
    await fetchAllNormalizedData();
  }

  async function deleteCustomizedMaterial(id: string) {
    const numId = Number(id);
    if (!Number.isFinite(numId)) return;
    await supabase.from("material").delete().eq("material_id", numId);
    await fetchAllNormalizedData();
  }

  // --- PHOTOBOOTH QR & SESSION TRACKING (`photobooth_qr_code` & `photobooth_session`) ---
  async function savePhotoboothQrCode(params: PhotoboothQrRecord) {
    const { error } = await supabase.from("photobooth_qr_code").upsert(
      {
        share_code: params.shareCode,
        preset_id: params.presetId,
        banner_title: params.bannerTitle.slice(0, 80),
        banner_subtitle: params.bannerSubtitle ? params.bannerSubtitle.slice(0, 100) : null,
        auto_stickers: params.autoStickers,
        customer_id: params.customerId ?? null,
        order_id: params.orderId ?? null,
      },
      { onConflict: "share_code" }
    );
    if (error) console.error("Failed to save Photobooth QR code:", error);
  }

  async function logPhotoboothActivity(shareCode?: string) {
    let qrCodeId: number | null = null;

    if (shareCode) {
      const { data: qrRow } = await supabase
        .from("photobooth_qr_code")
        .select("qr_code_id, scan_count")
        .eq("share_code", shareCode)
        .maybeSingle();

      if (qrRow) {
        qrCodeId = qrRow.qr_code_id;
        await supabase
          .from("photobooth_qr_code")
          .update({ scan_count: (qrRow.scan_count || 0) + 1 })
          .eq("qr_code_id", qrCodeId);
      }
    }

    await supabase.from("photobooth_session").insert({
      customer_id: null,
      qr_code_id: qrCodeId,
    });
  }

  // --- AI CHAT SESSION & MESSAGES (`chat_session` & `chat_message`) ---
  async function createChatSession(): Promise<number | null> {
    const { data, error } = await supabase
      .from("chat_session")
      .insert({ customer_id: null })
      .select("session_id")
      .single();

    if (error) {
      console.error("Failed to create chat session:", error);
      return null;
    }
    return data.session_id;
  }

  async function logChatMessage(
    sessionId: number | null,
    sender: "Customer" | "AI",
    messageText: string
  ) {
    if (!sessionId || !messageText.trim()) return;
    await supabase.from("chat_message").insert({
      session_id: sessionId,
      sender,
      message_text: messageText,
    });
  }

  return (
    <AppDataContext.Provider
      value={{
        products,
        getPrimaryImageIndex,
        setPrimaryImage,
        orders,
        addOrder,
        submitNormalizedCustomOrder,
        updateOrder,
        deleteOrder,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        galleryImages,
        addGalleryImage,
        deleteGalleryImage,
        customizedMaterials,
        addCustomizedMaterial,
        updateCustomizedMaterial,
        deleteCustomizedMaterial,
        savePhotoboothQrCode,
        logPhotoboothActivity,
        createChatSession,
        logChatMessage,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
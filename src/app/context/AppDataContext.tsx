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
  status: "Available" | "Out of Stock" | "Paid" | "Pending";
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

type ImageOrders = Record<number, number[]>;

interface AppDataContextValue {
  products: Product[];
  getPrimaryImageIndex: (productId: number) => number;
  setPrimaryImage: (productId: number, imgIndex: number) => void;

  orders: Order[];
  addOrder: (o: Order) => Promise<void>;
  updateOrder: (id: string, patch: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  inventory: InventoryItem[];
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, patch: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  galleryImages: GalleryImage[];
  addGalleryImage: (img: GalleryImage) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;

  customizedMaterials: CustomizedMaterial[];
  addCustomizedMaterial: (item: CustomizedMaterial) => Promise<void>;
  updateCustomizedMaterial: (id: string, patch: Partial<CustomizedMaterial>) => Promise<void>;
  deleteCustomizedMaterial: (id: string) => Promise<void>;
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

const SEED_ORDERS: Order[] = [
  {
    id: "#YC-1025",
    title: "Sunflower Bouquet",
    price: 650,
    category: "Bouquets",
    status: "Paid",
    description: "Yellow sunflower arrangement for birthday.",
    definition: "Large themed bouquet with yellow accents.",
    customer: "Maria Santos",
    payment: "GCASH",
    paymentDate: "22 May 2024",
    notes: "",
    images: [],
  },
  {
    id: "#YC-1024",
    title: "Pink Dream Bouquet",
    price: 450,
    category: "Bouquets",
    status: "Pending",
    description: "Soft pink arrangement.",
    definition: "Small bouquet in pastel tones.",
    customer: "Ana Reyes",
    payment: "CASH",
    paymentDate: "20 May 2024",
    notes: "",
    images: [],
  },
];

const SEED_INVENTORY: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Fuzzy Wire (Pink)",
    category: "Fuzzy Wire",
    stock: 90,
    unit: "pcs",
    lastRestock: "20 May 2024",
    unitPrice: 15,
    totalValue: 1350,
    supplier: "Craft Supplies PH",
    supplierLink: "",
  },
  {
    id: "inv-2",
    name: "Fuzzy Wire (White)",
    category: "Fuzzy Wire",
    stock: 60,
    unit: "pcs",
    lastRestock: "18 May 2024",
    unitPrice: 15,
    totalValue: 900,
    supplier: "Craft Supplies PH",
    supplierLink: "",
  },
  {
    id: "inv-3",
    name: "Wrapping Paper",
    category: "Packaging",
    stock: 30,
    unit: "sheets",
    lastRestock: "15 May 2024",
    unitPrice: 20,
    totalValue: 600,
    supplier: "Paper World",
    supplierLink: "",
  },
];

const SEED_GALLERY: GalleryImage[] = [
  { id: "gal-1", src: imgGallerySample, productId: 1 },
  { id: "gal-2", src: imgItemMain, productId: 1 },
  { id: "gal-3", src: imgExampleImage, productId: 2 },
  { id: "gal-4", src: imgExampleImage, productId: 3 },
];

const SEED_MATERIALS: CustomizedMaterial[] = [
  { id: "mat-1", name: "Sunflower", category: "flower", price: 50 },
  { id: "mat-2", name: "Rose", category: "flower", price: 40 },
  { id: "mat-3", name: "Classic Cellophane", category: "wrapper", price: 30 },
  { id: "mat-4", name: "Korean Paper", category: "wrapper", price: 45 },
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

export function AppDataProvider({ children }: { children: ReactNode }) {
  const stored = loadFromStorage();

  const [products] = useState<Product[]>(SEED_PRODUCTS);
  const [imageOrders, setImageOrders] = useState<ImageOrders>(stored?.imageOrders ?? {});
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>(stored?.inventory ?? SEED_INVENTORY);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [customizedMaterials, setCustomizedMaterials] = useState<CustomizedMaterial[]>([]);

  // 1. Fetch Orders, Gallery, and Customized Materials on Mount
  useEffect(() => {
    async function fetchData() {
      // Fetch Orders
      const { data: orderData, error: orderError } = await supabase.from("orders").select("*");
      if (orderError) {
        setOrders(stored?.orders ?? SEED_ORDERS);
      } else {
        const formattedOrders: Order[] = orderData.map((item: any) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          category: item.category,
          status: item.status,
          description: item.description,
          definition: item.definition,
          customer: item.customer,
          payment: item.payment,
          paymentDate: item.payment_date,
          notes: item.notes,
          images: item.images || [],
        }));
        setOrders(formattedOrders);
      }

      // Fetch Gallery Images
      const { data: galleryData, error: galleryError } = await supabase.from("gallery").select("*");
      if (galleryError) {
        setGalleryImages(SEED_GALLERY);
      } else {
        const formattedGallery: GalleryImage[] = galleryData.map((item: any) => ({
          id: item.id,
          src: item.src,
          productId: item.product_id,
        }));
        setGalleryImages(formattedGallery);
      }

      // Fetch Customized Materials
      const { data: matData, error: matError } = await supabase.from("customized_materials").select("*");
      if (matError || !matData || matData.length === 0) {
        setCustomizedMaterials(SEED_MATERIALS);
      } else {
        setCustomizedMaterials(matData.map((m: any) => ({
          id: m.id,
          name: m.name,
          category: m.category,
          price: m.price,
          image: m.image,
        })));
      }
    }
    
    fetchData();

    // 2. Real-time Subscriptions
    const orderChannel = supabase
      .channel("public:orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => fetchData())
      .subscribe();

    const galleryChannel = supabase
      .channel("public:gallery")
      .on("postgres_changes", { event: "*", schema: "public", table: "gallery" }, () => fetchData())
      .subscribe();

    const materialChannel = supabase
      .channel("public:customized_materials")
      .on("postgres_changes", { event: "*", schema: "public", table: "customized_materials" }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(galleryChannel);
      supabase.removeChannel(materialChannel);
    };
  }, []);

  useEffect(() => {
    saveToStorage({ imageOrders, inventory });
  }, [imageOrders, inventory]);

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

  async function addOrder(o: Order) {
    const { error } = await supabase.from("orders").insert([
      {
        id: o.id,
        title: o.title,
        price: o.price,
        category: o.category,
        status: o.status,
        description: o.description,
        definition: o.definition,
        customer: o.customer,
        payment: o.payment,
        payment_date: o.paymentDate,
        notes: o.notes,
        images: o.images,
      },
    ]);
    if (!error) {
      setOrders((prev) => [o, ...prev]);
    }
  }

  async function updateOrder(id: string, patch: Partial<Order>) {
    const dbPatch: Record<string, any> = {};
    if (patch.title !== undefined) dbPatch.title = patch.title;
    if (patch.price !== undefined) dbPatch.price = patch.price;
    if (patch.category !== undefined) dbPatch.category = patch.category;
    if (patch.status !== undefined) dbPatch.status = patch.status;
    if (patch.description !== undefined) dbPatch.description = patch.description;
    if (patch.definition !== undefined) dbPatch.definition = patch.definition;
    if (patch.customer !== undefined) dbPatch.customer = patch.customer;
    if (patch.payment !== undefined) dbPatch.payment = patch.payment;
    if (patch.paymentDate !== undefined) dbPatch.payment_date = patch.paymentDate;
    if (patch.notes !== undefined) dbPatch.notes = patch.notes;
    if (patch.images !== undefined) dbPatch.images = patch.images;

    const { error } = await supabase.from("orders").update(dbPatch).match({ id });
    if (!error) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
    }
  }

  async function deleteOrder(id: string) {
    const { error } = await supabase.from("orders").delete().match({ id });
    if (!error) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  }

  function addInventoryItem(item: InventoryItem) {
    setInventory((prev) => [item, ...prev]);
  }

  function updateInventoryItem(id: string, patch: Partial<InventoryItem>) {
    setInventory((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function deleteInventoryItem(id: string) {
    setInventory((prev) => prev.filter((i) => i.id !== id));
  }

  async function addGalleryImage(img: GalleryImage) {
    const { error } = await supabase.from("gallery").insert([
      {
        id: img.id,
        src: img.src,
        product_id: img.productId,
      },
    ]);
    if (!error) {
      setGalleryImages((prev) => [...prev, img]);
    } else {
      console.error("Failed to add image to DB:", error);
    }
  }

  async function deleteGalleryImage(id: string) {
    const { error } = await supabase.from("gallery").delete().match({ id });
    if (!error) {
      setGalleryImages((prev) => prev.filter((g) => g.id !== id));
    } else {
      console.error("Failed to delete image from DB:", error);
    }
  }

  // --- CUSTOMIZED MATERIALS CLOUD FUNCTIONS ---

  async function addCustomizedMaterial(item: CustomizedMaterial) {
    const { error } = await supabase.from("customized_materials").insert([
      {
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        image: item.image,
      },
    ]);
    if (!error) {
      setCustomizedMaterials((prev) => [...prev, item]);
    } else {
      console.error("Failed to add custom material:", error);
    }
  }

  async function updateCustomizedMaterial(id: string, patch: Partial<CustomizedMaterial>) {
    const { error } = await supabase.from("customized_materials").update(patch).match({ id });
    if (!error) {
      setCustomizedMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    } else {
      console.error("Failed to update custom material:", error);
    }
  }

  async function deleteCustomizedMaterial(id: string) {
    const { error } = await supabase.from("customized_materials").delete().match({ id });
    if (!error) {
      setCustomizedMaterials((prev) => prev.filter((m) => m.id !== id));
    } else {
      console.error("Failed to delete custom material:", error);
    }
  }

  return (
    <AppDataContext.Provider
      value={{
        products,
        getPrimaryImageIndex,
        setPrimaryImage,
        orders,
        addOrder,
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
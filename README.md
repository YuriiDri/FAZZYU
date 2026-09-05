# FAZZYU Creations

A handmade fuzzy wire crafts business website with a customer-facing storefront and a protected admin dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Animations | Motion (motion/react) |
| Charts | Recharts |
| Toasts | Sonner |
| Icons | Lucide React |
| UI Primitives | Radix UI |

---

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm, pnpm, or yarn

### Install and run

```bash
# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

The app runs at **http://localhost:5173**

### Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## Admin Login

Navigate to `/login` and use any username and password (the demo accepts any non-empty values).

> The admin token is stored in `localStorage` under the key `yc_admin_token`. Clearing localStorage logs you out.

---

## Project Structure

```
fazzyu-creations/
├── index.html                        # Vite HTML entry
├── vite.config.ts                    # Vite + Tailwind + @ alias config
├── tsconfig.json                     # TypeScript config
├── package.json
│
└── src/
    ├── main.tsx                      # React DOM entry point
    ├── styles/
    │   ├── index.css                 # Root CSS: imports fonts, tailwind, theme
    │   ├── tailwind.css              # Tailwind v4 directives
    │   ├── fonts.css                 # Google Fonts imports
    │   └── theme.css                 # Design tokens (@theme block + CSS vars)
    │
    ├── app/
    │   ├── App.tsx                   # Root router + layout shells
    │   │
    │   ├── context/
    │   │   └── AppDataContext.tsx    # Global state (orders, inventory, gallery)
    │   │
    │   ├── components/
    │   │   ├── Navbar.tsx            # Customer navbar (Home, Shop)
    │   │   ├── Card.tsx              # Reusable card with variants
    │   │   ├── HeartButton.tsx       # Image priority toggle (gallery)
    │   │   ├── AuthGuard.tsx         # Redirects to /login if no admin token
    │   │   └── admin/
    │   │       ├── AdminDropdown.tsx # Animated filter dropdown
    │   │       ├── DataTable.tsx     # Sortable table with status badges
    │   │       └── Pagination.tsx    # Page controls
    │   │
    │   ├── layouts/
    │   │   └── AdminLayout.tsx       # Fixed sidebar + mobile drawer
    │   │
    │   └── pages/
    │       ├── HomePage.tsx          # Hero + Gallery + Delivery + Contact
    │       ├── ShopPage.tsx          # Product grid (reads from orders)
    │       ├── ItemPage.tsx          # Single product detail page
    │       ├── GalleryPage.tsx       # Masonry photo gallery
    │       ├── LoginPage.tsx         # Admin login
    │       └── admin/
    │           ├── AdminDashboard.tsx       # Stats + charts
    │           ├── AdminAddEditPage.tsx     # Order table (list + search)
    │           ├── AdminAddOrderPage.tsx    # New order form
    │           ├── AdminEditOrderPage.tsx   # Edit/delete order form
    │           ├── AdminOrderListPage.tsx   # Read-only customer order list
    │           ├── AdminInventoryPage.tsx   # Inventory list
    │           ├── AdminAddNewItemPage.tsx  # New inventory item form
    │           ├── AdminEditItemPage.tsx    # Edit/delete inventory item
    │           └── AdminGalleryPage.tsx     # Upload + manage gallery photos
    │
    └── imports/                      # Figma-exported assets (PNG images)
        ├── image.png                 # Hero background (bouquet + petals)
        ├── image-1.png               # Login page background
        ├── HomePage/                 # Hero + gallery + map images
        ├── ItemPage/                 # Product detail images
        ├── ShopPage/                 # Shop card fallback image
        ├── GalleryPage/              # Gallery sample images
        ├── LoginPage/                # Logo for login
        └── DashboardPage/            # Logo for admin sidebar
```

---

## Routing

### Customer routes (wrapped in Navbar)

| Path | Page |
|---|---|
| `/` | HomePage |
| `/shop` | ShopPage |
| `/shop/:id` | ItemPage (product detail) |
| `/gallery` | GalleryPage |

### Auth

| Path | Page |
|---|---|
| `/login` | LoginPage |

### Admin routes (behind AuthGuard + sidebar layout)

| Path | Page |
|---|---|
| `/admin` | Dashboard |
| `/admin/orders` | Add / Edit Order list |
| `/admin/orders/new` | Add new order form |
| `/admin/orders/:id/edit` | Edit order form |
| `/admin/order-list` | Read-only customer order list |
| `/admin/inventory` | Inventory list |
| `/admin/inventory/new` | Add inventory item |
| `/admin/inventory/:id/edit` | Edit inventory item |
| `/admin/gallery` | Gallery management |

> **Note on order IDs:** Order IDs contain `#` (e.g. `#YC-1025`). All navigation calls use `encodeURIComponent(id)` and all param reads use `decodeURIComponent(rawId)` to prevent the `#` from being interpreted as a URL fragment.

---

## Global State — AppDataContext

All shared state lives in `src/app/context/AppDataContext.tsx` and is persisted to `localStorage` under the key `yc_app_data`.

### Data types

```ts
type Order = {
  id: string;           // "#YC-XXXX" — auto-generated
  title: string;
  price: number;
  category: string;     // "Bouquets" | "Themed" | "Dolls" | "Crafts"
  status: "Available" | "Out of Stock" | "Paid" | "Pending";
  description: string;
  definition: string;   // displayed in Edit Order left panel
  customer: string;
  payment: "GCASH" | "CASH";
  paymentDate: string;
  notes?: string;
  images: string[];     // data URLs from file uploads
};

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  lastRestock: string;
  unitPrice: number;
  totalValue: number;   // auto: stock × unitPrice
  supplier: string;
  supplierLink?: string;
};

type GalleryImage = {
  id: string;
  src: string;          // ES module import or data URL
  productId?: number;   // links to static Product for overlay display
};
```

### Available context values

```ts
// Orders (also drives the customer Shop page)
orders: Order[]
addOrder(o: Order): void
updateOrder(id: string, patch: Partial<Order>): void
deleteOrder(id: string): void

// Inventory
inventory: InventoryItem[]
addInventoryItem(item: InventoryItem): void
updateInventoryItem(id: string, patch: Partial<InventoryItem>): void
deleteInventoryItem(id: string): void

// Gallery images
galleryImages: GalleryImage[]
addGalleryImage(img: GalleryImage): void
deleteGalleryImage(id: string): void

// Image priority (HeartButton)
products: Product[]          // static seed — used for gallery image name/price overlays
getPrimaryImageIndex(productId: number): number
setPrimaryImage(productId: number, imgIndex: number): void
```

### Admin ↔ Customer sync

The **Shop page** reads directly from `orders`. Any order added, edited, or deleted in the admin **Add/Edit Order** page is immediately reflected on the customer-facing shop — they share the same context array. No page reload is needed.

---

## Design Tokens

Defined in `src/styles/theme.css` inside the `@theme` block (auto-generates Tailwind utility classes).

| Token | Value | Tailwind class |
|---|---|---|
| `--color-bg-base` | `#0d0d0d` | `bg-bg-base` |
| `--color-bg-surface` | `#241119` | `bg-bg-surface` |
| `--color-border-accent` | `#e8a0be` | `border-border-accent` |
| `--color-brand-pink` | `#e8a0be` | `text-brand-pink` |
| `--color-brand-pink-deep` | `#d46a93` | `bg-brand-pink-deep` |
| `--color-text-primary` | `#f5f0f0` | `text-text-primary` |
| `--color-text-muted` | `#b8a8ae` | `text-text-muted` |
| `--color-accent-highlight` | `#f06292` | `text-accent-highlight` |
| `--font-serif` | Playfair Display | `font-serif` |
| `--font-sans` | Poppins | `font-sans` |

### Admin palette (hardcoded, isolated from above tokens)

| Purpose | Value |
|---|---|
| Page background | `#0c0d0c` |
| Sidebar | `#110f10` |
| Cards / tables | `#141414` |
| CTA / active pink | `#ca498c` |
| Active sidebar pill | `#381c2a` |

### Layout utility

```css
.page-container {
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: 1.5rem;   /* 3rem on lg+ */
}
```

---

## Key Implementation Notes

### Vite path alias
`@` is aliased to `./src` in both `vite.config.ts` and `tsconfig.json`. All imports use `@/app/...`, `@/imports/...`, etc.

### Tailwind CSS v4
- Uses `@theme { ... }` (not `tailwind.config.js`) to define design tokens.
- Uses `@theme inline { ... }` to map CSS vars like `--background` to Tailwind classes like `bg-background`.
- Do **not** add a `tailwind.config.js` — Tailwind v4 is fully config-file-free.
- Plugin: `@tailwindcss/vite` (not `postcss`).

### Motion
- All animation imports come from `"motion/react"`, not `"framer-motion"`.
- `AnimatePresence` is imported from `"motion/react"`.

### React Router v7
- Import from `"react-router"` (not `"react-router-dom"`).
- Static route segments (`/new`) are declared **before** dynamic ones (`/:id`) so they take priority.

### Image uploads
- Admin image uploads (Edit Order, Gallery) use `FileReader` to convert files to base64 data URLs stored in state and persisted to localStorage.
- Large numbers of large images may approach localStorage limits (~5–10 MB depending on browser).

---

## Customizing Seed Data

To change the default orders or inventory that appear on first load, edit the seed arrays near the top of `src/app/context/AppDataContext.tsx`:

- `SEED_ORDERS` — the orders that drive the shop page on first load
- `SEED_INVENTORY` — the inventory items
- `SEED_GALLERY` — the gallery images

After the first page load, data is stored in `localStorage`. Clear `localStorage` (DevTools → Application → Storage → Clear) to reset to seeds.

---

## VS Code Extensions (recommended)

- **Tailwind CSS IntelliSense** — autocomplete for Tailwind classes
- **ES7+ React/Redux/React-Native snippets** — React component snippets
- **Prettier** — code formatter
- **TypeScript Vue Plugin** — better TS support (optional)

Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## Frequently Asked Questions

**Q: Why does the shop show orders instead of a separate "products" catalog?**  
A: By design — in this made-to-order business model, each "order" IS a product listing. When admin adds an order with status "Available," it appears in the shop. When it's marked "Paid" or "Out of Stock," it reflects immediately on the customer side.

**Q: How do I add a real product to the shop?**  
A: Go to Admin → Add/Edit Order → Add New Order. Fill in the title, price, category, description, attach images, and set status to "Available." It will immediately appear on the customer Shop page.

**Q: How do I reset all data to defaults?**  
A: Open browser DevTools → Application tab → Local Storage → select the site → Delete `yc_app_data`. Refresh the page.

**Q: Why does the admin login accept any password?**  
A: This is a demo/prototype. In production, replace the login handler in `LoginPage.tsx` with a real authentication API call and use secure session tokens.

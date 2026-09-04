# Yuri's Craft — Full Website Implementation Plan
## Customer Pages (Phase 2) + Admin Pages (Phase 3) — Combined

---

## 1. Context & Goal

The v1 customer pages (HomePage, ShopPage, ItemPage, LoginPage) are built and routing works at `/`, `/shop`, `/shop/:id`, `/login`. This combined plan completes the website in two coordinated phases:

- **Phase 2 — Customer enhancements**: Gallery page, heart/image-priority feature, fluid typography tokens, responsive Navbar, ItemPage Figma-1 delta.
- **Phase 3 — Admin section**: Full protected admin area with sidebar layout, Dashboard, Order management, Inventory management, Gallery management, and auth guard.

Both phases share a single **AppDataContext** so that admin actions (adding gallery photos, marking orders) reflect instantly on customer-facing pages.

---

## 2. Architecture Overview

### Route Tree

```
/                         → WithNav > HomePage
/shop                     → WithNav > ShopPage
/shop/:id                 → WithNav > ItemPage
/gallery                  → WithNav > GalleryPage          ← NEW Phase 2
/login                    → LoginPage (standalone)          ← updated: redirects to /admin
/admin                    → AdminShell > AdminDashboard
/admin/orders             → AdminShell > AdminAddEditPage
/admin/orders/new         → AdminShell > AdminAddOrderPage
/admin/orders/:id/edit    → AdminShell > AdminEditOrderPage
/admin/order-list         → AdminShell > AdminOrderListPage
/admin/inventory          → AdminShell > AdminInventoryPage
/admin/inventory/new      → AdminShell > AdminAddNewItemPage
/admin/inventory/:id/edit → AdminShell > AdminEditItemPage
/admin/gallery            → AdminShell > AdminGalleryPage
```

`WithNav` = customer Navbar + `<main className="pt-[94px] min-h-screen bg-[#120e0e]">`.
`AdminShell` = `<AuthGuard>` + `<AdminLayout>` (sidebar).

### Context Hierarchy

```tsx
<BrowserRouter>
  <AppDataProvider>        ← single source of truth: orders, inventory, gallery images, product image priority
    <Routes>
      <Route path="/*" ... />   ← customer routes
      <Route path="/admin/*" .../>  ← admin routes
    </Routes>
  </AppDataProvider>
</BrowserRouter>
```

---

## 3. Files to Create

### Phase 2 — Customer

| File | Role |
|---|---|
| `src/app/context/AppDataContext.tsx` | All shared state: products, imageOrders, orders, inventory, galleryImages. Persisted in localStorage. |
| `src/app/pages/GalleryPage.tsx` | `/gallery` — masonry photo grid, all product images. |
| `src/app/components/HeartButton.tsx` | ♥ toggle; reads/writes via `useAppData`. |

### Phase 3 — Admin

| File | Role |
|---|---|
| `src/app/layouts/AdminLayout.tsx` | Fixed sidebar nav + scrollable content. |
| `src/app/components/AuthGuard.tsx` | Checks `localStorage.getItem("yc_admin_token")`, redirects to `/login` if absent. |
| `src/app/components/admin/AdminDropdown.tsx` | Animated dropdown (AnimatePresence) for Status/Category/Payment filters. |
| `src/app/components/admin/DataTable.tsx` | Shared table: sortable columns, clickable rows, status badges. |
| `src/app/components/admin/Pagination.tsx` | Pink active-page pill, prev/next arrows. |
| `src/app/pages/admin/AdminDashboard.tsx` | Stats cards + recharts bar/line/pie charts. |
| `src/app/pages/admin/AdminAddEditPage.tsx` | Order table, Status dropdown, Search, "Add New Order" button, row edit icon. |
| `src/app/pages/admin/AdminAddOrderPage.tsx` | Add order form: Title, Price, Status, Category, Description + Attach Product Image panel. |
| `src/app/pages/admin/AdminEditOrderPage.tsx` | Edit order form: two side-by-side panels (Order Info + Order Details) + Attach Product Image panel + Delete Order. |
| `src/app/pages/admin/AdminOrderListPage.tsx` | Read-only order table, Payment dropdown, Search. |
| `src/app/pages/admin/AdminInventoryPage.tsx` | Inventory table, tabs, Search, "Add New Item". |
| `src/app/pages/admin/AdminAddNewItemPage.tsx` | Add inventory item form (Item Information + Supplier panels). |
| `src/app/pages/admin/AdminEditItemPage.tsx` | Edit inventory item form + Delete button. |
| `src/app/pages/admin/AdminGalleryPage.tsx` | Photo grid, trash icons, "Add Photos" button, heart priority. |

---

## 4. Files to Modify

| File | What changes |
|---|---|
| `src/app/App.tsx` | Wrap everything in `AppDataProvider`; add `/gallery` + all `/admin/*` routes. |
| `src/app/components/Navbar.tsx` | Add "Gallery" link; hamburger + slide-in drawer at <768px. |
| `src/app/pages/LoginPage.tsx` | On success: `localStorage.setItem("yc_admin_token", "admin")` → `navigate("/admin")`. |
| `src/app/pages/HomePage.tsx` | Switch imports to `HomePage-1` assets; add "View All →" link to `/gallery` in gallery section. |
| `src/app/pages/ShopPage.tsx` | Read `products` from `AppDataContext` instead of local array; `ProductCard` uses context-primary image. |
| `src/app/pages/ItemPage.tsx` | Remove InfoPanel block; move Facebook button up; add `<HeartButton>` on thumbnails; switch to `ItemPage-1` imports. |
| `src/styles/theme.css` | Append fluid `--font-*` and `--space-*` clamp tokens. |

---

## 5. AppDataContext — Full Design

```ts
// Product (moved from ShopPage.tsx — same type, same fields)
type Product = { id, name, price, category, status, image, description, bouquetType, size }

// Image priority per product
type ImageOrders = Record<number, number[]>; // productId → [primaryIndex, ...rest]

// Orders (fields from actual Figma AddNewOrderPage + EditOrderPage designs)
type Order = {
  id: string;             // "#YC-1025" — auto-generated on add
  title: string;          // "Sunflower Bouquet"
  price: number;
  category: string;       // Bouquet | Themed | Dolls | Craft
  status: "Available" | "Out of Stock" | "Paid" | "Pending";
  description: string;    // visible on AddNewOrderPage
  definition: string;     // visible on EditOrderPage left panel
  customer: string;       // EditOrderPage right panel
  payment: "GCASH" | "CASH";
  paymentDate: string;    // e.g. "22 May 2024"
  notes?: string;         // optional
  images: string[];       // data URLs from Attach Product Image panel — visible to customer
};

// Inventory (materials/supplies — separate from customer products)
type InventoryItem = {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  lastRestock: string;
  unitPrice: number;
  totalValue: number;     // auto: stock × unitPrice
  supplier: string;
  supplierLink?: string;
};

// Gallery images (admin uploads; customer gallery reads)
type GalleryImage = {
  id: string;
  src: string;            // ES module import path or data URL
  productId?: number;
};

interface AppDataContextValue {
  // Customer side
  products: Product[];
  getPrimaryImageIndex: (productId: number) => number;
  setPrimaryImage: (productId: number, imgIndex: number) => void;

  // Admin orders
  orders: Order[];
  addOrder: (o: Order) => void;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  deleteOrder: (id: string) => void;

  // Admin inventory
  inventory: InventoryItem[];
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, patch: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  // Gallery (shared)
  galleryImages: GalleryImage[];
  addGalleryImage: (img: GalleryImage) => void;
  deleteGalleryImage: (id: string) => void;
}
```

- Seed data: 6 products (from current ShopPage.tsx), 1 sample order (#YC-1025 Maria Santos), 3 inventory items (Fuzzy Wire Pink etc.), and existing product images as starting gallery.
- All mutations immediately call `localStorage.setItem("yc_app_data", JSON.stringify(state))`.
- Initial load reads from localStorage with fallback to seed data.

---

## 6. Fluid Token System (theme.css additions)

Append inside `:root` (do not replace any existing tokens):

```css
/* Fluid typography */
--font-display:  clamp(2rem,    4.5vw + 0.5rem, 4rem);
--font-heading:  clamp(1.5rem,  3vw   + 0.25rem, 3rem);
--font-subhead:  clamp(1.125rem,1.5vw,            1.5rem);
--font-body:     clamp(0.875rem,1vw   + 0.25rem,  1.125rem);
--font-small:    clamp(0.75rem, 0.8vw,             0.875rem);

/* Fluid spacing */
--space-xs:  clamp(0.25rem, 0.5vw, 0.5rem);
--space-sm:  clamp(0.5rem,  1vw,   1rem);
--space-md:  clamp(1rem,    2vw,   2rem);
--space-lg:  clamp(2rem,    4vw,   4rem);
--space-xl:  clamp(3rem,    6vw,   6rem);
--container-px:  clamp(1rem, 5vw, 5rem);
--container-max: 1440px;
```

Use via `text-[var(--font-display)]`, `gap-[var(--space-md)]`, etc.

---

## 7. Phase 2 — Customer Changes Detail

### Navbar (responsive)
- Add "Gallery" link between "Shop" and right icons.
- Below 768px: hide center links, show `Menu` icon (Lucide) that opens `motion`-animated slide-in drawer with all nav links. `X` closes; navigating auto-closes.
- Logo shrinks: `w-[202px]` desktop → `w-[140px]` mobile.

### GalleryPage (`/gallery`)
- Header: "Our Gallery" (Crimson Text `var(--font-heading)`) + subtitle.
- Grid: `grid-cols-[repeat(auto-fill,minmax(220px,1fr))]` — no fixed column count, fills viewport.
- Each cell: image `aspect-[4/5] object-cover rounded-[20px]`, bottom overlay with product name + price, `<HeartButton>` at top-right, clicking card → `/shop/:id`.
- Source: flattened list of all `galleryImages` from context.

### HeartButton
- Filled pink heart (`text-[#d17ea5]`) when this image index === `getPrimaryImageIndex(productId)`.
- Outline heart otherwise.
- `onClick` → `setPrimaryImage(productId, imgIndex)` → context updates → ShopPage card cover image updates.

### ItemPage (Figma-1 delta)
- **Delete** the bordered InfoPanel (`<div className="relative rounded-[15px] border-[3px] border-[#fdd0d0]/40 ...">` with Bouquet Type / Size rows).
- **Move** Facebook button: place directly after description paragraph (no InfoPanel gap).
- **Add** `<HeartButton productId={product.id} imageIndex={i} />` overlaid on each thumbnail.
- Switch image imports to `@/imports/ItemPage-1/` (same hash filenames).

### HomePage
- Switch imports from `@/imports/HomePage/` to `@/imports/HomePage-1/`.
- Gallery section: add `<Link to="/gallery">View All →</Link>` button (pink, right-aligned in section header row). Each gallery image card → `<Link to="/gallery">`.

### ShopPage
- Move `products` array and `Product` type to `AppDataContext`; ShopPage imports from context.
- `ProductCard` reads `getPrimaryImageIndex(product.id)` → uses that index as cover image.

---

## 8. Phase 3 — Admin Section Detail

### AdminLayout
- Sidebar: `w-[328px] min-h-screen bg-[#110f10] rounded-[20px] fixed left-3 top-3` — matches Figma SIDE PANEL exactly.
- Content: `ml-[360px] flex-1 bg-[#0c0d0c] min-h-screen p-8`.
- Nav items: Dashboard, Add/Edit Order, Inventory, Order List — active item gets `bg-[#381c2a]` pill.
- SVG icons extracted from Figma imports and inlined.
- Logout at bottom: clears `yc_admin_token`, navigates to `/login`.
- **Responsive collapse** (≤1024px): sidebar icon-only strip `w-[72px]`; ≤768px: top hamburger + drawer overlay.

### AdminDropdown (v1 style, AnimatePresence)
Generic component for Status, Category, Payment filters:
- Trigger: `h-[72px] bg-[#141414] border-[rgba(255,255,255,0.25)] rounded-[15px]` + ChevronDown.
- Panel: `bg-[#1a1a1a] border-[#878787] rounded-bl-[10px] rounded-br-[10px]` — Figma-exact.
- Each option: `h-[48px] rounded-[10px]`, highlighted on active.
- Animation: `initial={{ opacity:0, y:-8 }}` → `animate={{ opacity:1, y:0 }}` → `exit={{ opacity:0, y:-8 }}`.

### DataTable (shared)
```tsx
<DataTable
  columns={columnDefs}
  rows={filteredRows}
  onRowClick={(row) => navigate(`/admin/inventory/${row.id}/edit`)}
  currentPage={page}
  totalPages={total}
  onPageChange={setPage}
/>
```
- `bg-[#141414] border-[rgba(255,255,255,0.25)] rounded-[15px]`.
- Clickable rows: `cursor-pointer hover:bg-[rgba(255,255,255,0.03)]`.
- Status badges: green `rgba(144,238,144,0.2)` for Paid/Available, red for Out of Stock, yellow for Pending.

### Page Specifications

**AdminDashboard** (`/admin`)
- Stat cards: Total Revenue (sum of all order prices), Total Orders (count).
- BarChart + LineChart via recharts, using `--chart-1..5` tokens.
- No background image — `bg-[#0c0d0c]` only.

**AdminAddEditPage** (`/admin/orders`)
- Table columns: Title, Price, Date, Status, Action (edit pencil icon).
- Status filter via `AdminDropdown`. Search bar filters title/customer.
- "Add New Order" (`#ca498c`) → `navigate("/admin/orders/new")`.
- Row pencil icon → `navigate(\`/admin/orders/${row.id}/edit\`)`.
- Trash icon on row → `deleteOrder(id)` → immediate update; reflected on OrderListPage.

**AdminAddOrderPage** (`/admin/orders/new`)
- One card panel: "Order Information" — fields: Order Title (text), Price ₱ (number), Status (`AdminDropdown`: Available/Out of Stock/Paid/Pending), Category (`AdminDropdown`: Bouquet/Themed/Dolls/Craft), Description (textarea, tall).
- "Attach Product Image" card below: dashed-border upload zone (click → `<input type="file">`) + thumbnail previews with per-image delete (trash) icons. Caption: "This image will be visible to the customer in their order details."
- Buttons: Cancel → `navigate(-1)`; "Add New Order" (pink `#ca498c`) → `addOrder(...)` → `toast.success` → `navigate("/admin/orders")`.

**AdminEditOrderPage** (`/admin/orders/:id/edit`)
- TWO side-by-side card panels:
  - Left "Order Information": Title, Price, Category (`AdminDropdown`), Status (`AdminDropdown`), Definition (textarea).
  - Right "Order Details": Order ID (read-only or editable text), Customer (text), Payment Method (`AdminDropdown`: GCASH/CASH), Payment Date (date picker with calendar icon), Notes (textarea, optional).
- "Attach Product Image" card at the bottom (same as Add page — pre-filled with existing images).
- Buttons: Cancel; "Save Order" (pink); "Delete Order" (red text `rgba(233,44,44,0.74)`) → `deleteOrder(id)` → `navigate("/admin/orders")`.
- Pre-fill all fields from `orders.find(o => o.id === params.id)`.

**AdminOrderListPage** (`/admin/order-list`)
- Columns: Order ID, Customer, Category, Price, Payment, Date, Status.
- Payment filter + Search. Read-only (no edit icon). Pagination.

**AdminInventoryPage** (`/admin/inventory`)
- Columns: Item Name, Category, Stock, Unit, Last Restock, Unit Price, Total Value.
- "All Items" / "Out of Stock" tabs. Search. "Add New Item" → `/admin/inventory/new`.
- **Every row clickable** → `navigate(\`/admin/inventory/${item.id}/edit\`)`.

**AdminAddNewItemPage** (`/admin/inventory/new`)
- Two panel cards: Item Information (Item Name, Current Stock, Purchase Price, Total Value, Last Restock Date) + Supplier (Supplier, Link Optional).
- Total Value auto-computes `stock × unitPrice` on blur.
- "Cancel" → `navigate(-1)`. "Save Item" → `addInventoryItem` → `navigate("/admin/inventory")`.

**AdminEditItemPage** (`/admin/inventory/:id/edit`)
- Same form, pre-filled from context. Plus "Delete Item" button (red text).
- "Save Item" → `updateInventoryItem`. "Delete Item" → `deleteInventoryItem` → `navigate("/admin/inventory")`.

**AdminGalleryPage** (`/admin/gallery`)
- Grid of `galleryImages` from context. Each card: image + pink trash icon.
- Trash → `deleteGalleryImage(id)` → updates context → disappears from customer `/gallery` too.
- "Add Photos" → `<input type="file" accept="image/*" multiple>` → FileReader data URLs → `addGalleryImage` per file.
- **Heart button** on each image → `setPrimaryImage(productId, imgIndex)` (same context call as customer side).

### Auth Flow
- LoginPage success: `localStorage.setItem("yc_admin_token", "admin")` → `navigate("/admin")`.
- `AuthGuard`: `useEffect` checks token; if absent → `navigate("/login", { replace: true })`.
- Admin Logout: `localStorage.removeItem("yc_admin_token")` → `navigate("/login")`.

---

## 9. Storyboard / Relationship Map

```
Customer side:
  HomePage → /gallery (View All link + photo clicks)
  ShopPage → /shop/:id (product card click)
  ItemPage → ♥ thumbnail → setPrimaryImage → ShopPage card image updates

Admin side:
  /login ──success──▶ /admin (Dashboard)
  Dashboard ──sidebar──▶ /admin/orders
                         /admin/order-list
                         /admin/inventory
                         /admin/gallery

  /admin/orders ──"Add New Order"──▶ /admin/orders/new
               │                    (form: Title, Price, Status, Category, Description + image upload)
               │                    "Add New Order" saves → back to /admin/orders
               ──row edit icon  ──▶ /admin/orders/:id/edit
               │                    (form: two panels — Order Info + Order Details + image panel)
               │                    "Save Order" updates → back; "Delete Order" removes → back
               ──row trash      ──▶ deleteOrder() → reflected on /admin/order-list

  /admin/inventory ──row click──▶ /admin/inventory/:id/edit
                   ──"Add New" ──▶ /admin/inventory/new

  /admin/gallery ──"Add Photos"──▶ galleryImages context ──▶ customer /gallery reads same
                 ──trash        ──▶ remove from both sides
                 ──♥ heart      ──▶ setPrimaryImage ──▶ ShopPage cover image updates
```

---

## 10. Design Tokens — Admin vs Customer

Admin pages use slightly different colors (Figma-exact), applied as Tailwind arbitrary values:

| Purpose | Admin value | Customer token |
|---|---|---|
| Page bg | `#0c0d0c` | `bg-background` (`#120e0e`) |
| Side panel | `#110f10` | — |
| Card/table bg | `#141414` | `bg-card` (`#1e1518`) |
| CTA pink | `#ca498c` | `bg-primary` (`#d17ea5`) |
| Active sidebar pill | `#381c2a` | — |

These coexist with existing theme tokens — no token values are overwritten.

---

## 11. Responsive Behavior

| Breakpoint | Customer | Admin |
|---|---|---|
| ≥1280px | Full navbar, 4-5 col grid | Sidebar 328px, content `ml-[360px]` |
| 768–1279px | Full navbar | Sidebar icon-only 72px, content `ml-[88px]` |
| <768px | Hamburger drawer | Top bar + hamburger drawer |

Tables (admin) scroll horizontally within their containers at small widths via `overflow-x-auto`.

---

## 12. Implementation Order

1. `AppDataContext.tsx` — foundation everything else depends on.
2. `src/styles/theme.css` — fluid tokens.
3. **Phase 2 customer** (Navbar → GalleryPage → HeartButton → update ShopPage/ItemPage/HomePage).
4. `src/app/App.tsx` — add `/gallery` and all `/admin/*` routes; wrap in provider.
5. `AuthGuard.tsx` + update `LoginPage.tsx`.
6. `AdminLayout.tsx` + `AdminDropdown.tsx` + `DataTable.tsx` + `Pagination.tsx`.
7. **Admin pages** in dependency order: Dashboard → AddEditPage → AddOrderPage → EditOrderPage → OrderListPage → InventoryPage → AddNewItemPage → EditItemPage → GalleryPage.

---

## 13. Verification Steps

**Customer:**
1. Resize 375px → 1440px on each customer page; no horizontal scroll; grids reflow.
2. Heart a thumbnail on `/shop/1` → visit `/shop` → product 1 card shows hearted image.
3. Open `/gallery`; all product images appear; clicking navigates to `/shop/:id`.
4. "View All →" on HomePage → navigates to `/gallery`.
5. Mobile at 375px: hamburger shows; tap → drawer with Home, Shop, Gallery links; tap link → correct page, drawer closes.
6. ItemPage: InfoPanel gone; Facebook button immediately below description.
7. Heart state survives hard-refresh (localStorage).

**Admin:**
8. Open `/admin` without login → redirect to `/login`. Log in → `/admin`.
9. Each sidebar link highlights correct active item.
10. Add order on `/admin/orders` → row appears on both AddEditPage and OrderListPage.
11. Delete order row → gone on both pages immediately.
12. Click inventory row → EditItemPage pre-filled. Save → back to inventory with update. Delete → row removed.
13. Total Value auto-calculates on AddNewItemPage.
14. Admin gallery: upload photo → appears in grid AND customer `/gallery`. Delete → gone from both.
15. Heart in admin gallery → ShopPage card image updates.
16. Status/Payment dropdowns animate in/out; filter applies to table.
17. Pagination: >5 rows shows page 2 correctly; active page is pink.
18. Logout → clears token → `/login`; browser back button blocked by AuthGuard.
19. Admin responsive at 768px: sidebar collapses; at 375px: hamburger drawer opens.

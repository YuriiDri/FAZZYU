# FAZZYU Creations — Website Blueprint & Unification Plan

**Scope of this document:** Full site blueprint (customer + admin), but **execution priority is customer-side only**. Admin sections are documented so the whole system stays coherent, but nothing in admin gets touched/rebuilt yet, per your instruction.

---

## 1. Audit — What's Causing the "No Unity" Feeling

This is the specific list of what I found scanning your 20 screens, grouped by root cause rather than by page, because most of these repeat across pages.

### 1.1 No shared layout container
- Home hero, Shop grid, and Product Detail all use **different left/right margins**. Home has generous side gutters, Shop has slightly tighter ones, Product Detail's image almost touches the edge.
- Home hero overflows its own viewport in one capture (Shop Now button clipped) and fits cleanly in another — meaning hero height isn't fixed, it's just "however much content there is."
- **Fix:** one `max-width` page container (recommend `1280px`, centered, with `24px` mobile / `48px` desktop side padding) that every page section sits inside, no exceptions.

### 1.2 No shared card component
- Gallery card: thin solid 1px pink border, dark plum fill, arrows placed *outside* the card's own edge (they're clipped by the container boundary — a genuine bug, not a style choice).
- Delivery/map card: border **+ heavy outer glow**, different corner radius feel.
- Contact/"Send us a message" card: barely-there border, and its sibling ("Let's Create Something Beautiful Together!") has **no card at all** — so two things sitting side by side in the same row have inconsistent framing.
- Shop product card: image (rounded top corners) directly butted against a name/price bar (square corners) — reads as two stacked elements, not one card.
- **Fix:** one `Card` component with 3 controlled variants (`solid-border`, `glow-border`, `flat`) — never invented per-section again.

### 1.3 Background color drift
- Home hero / Shop grid background: near-black (`#0D0D0D`-ish).
- Shop nav bar: solid maroon/plum bar.
- Contact section background: lighter plum (`#2E1620`-ish) — a visible seam between it and the section above.
- **Fix:** lock 2 background tokens only — `bg-base` (near-black, used everywhere as the page background) and `bg-surface` (the plum, used *only* inside cards, never as a full-page band).

### 1.4 Typography inconsistency
- Heading serif font size/weight shifts slightly between Home hero, "Our Gallery," and "Let's Create Something" — not dramatically, but enough to feel unplanned.
- **Fix:** fixed type scale (below).

### 1.5 Nav bar inconsistency
- Transparent/black nav on Home vs. solid maroon nav on Shop.
- "Home" tab underline sits tight under the text; "Shop" tab underline floats with a visible gap below it.
- **Fix:** nav is a single shared component, rendered once, styled once — page background never changes its appearance.

### 1.6 Placeholder content masking real bugs
- Every Shop card shows the identical "Pink Lily Bouquet" photo and price — can't fully judge grid rhythm until real varied images are in, but the *card shape* problem (1.2) is independent of that and needs fixing regardless.
- Product Detail's ₱170 has a strikethrough with no second (discounted) price shown next to it — either finish the sale-price treatment or remove the strikethrough.

### 1.7 (Admin — flagged, not fixed now) Data model conflation
- "Edit Order" (your product catalog form) contains **Customer** and **Payment Method** fields, which belong to an actual customer purchase, not a product listing. Per your own notes, Add/Edit Order = your product catalog, Order List = real customer orders. Right now the Edit Order form is doing both jobs at once. I'm flagging this because it will cause real bugs later (e.g., "deleting an order" becoming ambiguous — deleting a *product* vs. deleting a *customer's purchase*). Recommendation is in Section 6.

---

## 2. Design System (Foundations)

Lock these once, reference everywhere. Nothing below is decorative — every page-level inconsistency above traces back to one of these not being fixed yet.

### 2.1 Color tokens
| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#0D0D0D` | Page background, everywhere, always |
| `--bg-surface` | `#241119` | Card fills (gallery card, product card footer, contact card) |
| `--bg-surface-alt` | `#2E1620` | Nav bar on inner pages (Shop, admin) — used sparingly |
| `--border-accent` | `#E8A0BE` | 1px card borders |
| `--brand-pink` | `#E8A0BE` → `#D46A93` (gradient) | Primary buttons (Shop Now, Save, Login) |
| `--text-primary` | `#F5F0F0` | Headings, body on dark bg |
| `--text-muted` | `#B8A8AE` | Subtext, descriptions |
| `--accent-highlight` | `#F06292` | Links, "Creativity," price text |
| `--status-available` | `#4A7A4A` bg / `#DFF3DF` text | "Available" pill |
| `--status-paid` | same green family | "Paid" status pill (admin) |

### 2.2 Typography scale
- Display serif (hero H1): `48px / 56px line-height`, weight 500 — one size, used only for page-hero headlines.
- Section H2 (serif, e.g. "Our Gallery"): `32px / 40px`.
- Card title (serif, e.g. product name on detail page): `28px / 36px`.
- Body: sans, `16px / 26px`, `--text-muted` for descriptions, `--text-primary` for labels.
- Small/eyebrow (e.g. "HANDMADE WITH LOVE" pill): `12px`, letter-spacing `0.08em`, uppercase.

Font pairing to keep: serif (Playfair Display or similar) for headings, clean sans (Inter/Poppins) for body and UI — this part of your current design already works, just needs consistent sizing.

### 2.3 Spacing scale (8px base)
`4, 8, 16, 24, 32, 48, 64, 96px` — no arbitrary values outside this list. Section vertical padding is always `64px` desktop / `32px` mobile. Card internal padding is always `24px`.

### 2.4 Radius & elevation
- Cards: `16px` radius, 1px solid `--border-accent`, **no glow by default**.
- The map/delivery card's glow becomes an intentional *exception* used only for embedded map images (to visually separate a "foreign" iframe-like element) — not copied elsewhere.
- Buttons: full pill radius (`9999px`), consistent with your current Shop Now / Inquire on Facebook / Save Order buttons — this one's already right, just needs to apply everywhere (Send a Message button included).

### 2.5 Breakpoints (mobile-first, flexible + sticky nav as requested)
| Name | Width | Behavior |
|---|---|---|
| `sm` | 0–639px | Single column, nav collapses to hamburger, hero stacks image below text |
| `md` | 640–1023px | 2-column hero, 2-col product grid |
| `lg` | 1024–1279px | 3-col product grid |
| `xl` | 1280px+ | Full desktop layout, content capped at `1280px` centered, nav becomes **sticky** (`position: sticky; top: 0`) with a subtle background blur/solidify on scroll |

This directly answers your "wider like standard PC width, flexible and sticky on all devices" note: container caps at 1280px so it never stretches awkwardly on ultra-wide monitors, but scales fluidly down to mobile, and the nav sticks on scroll on every breakpoint.

---

## 3. Site Map (Information Architecture)

**Customer-facing**
```
/                    Home (Hero → Gallery preview → Delivery → Contact)
/shop                Shop grid (filter/sort)
/shop/:productId     Product detail
```

**Admin-facing** (documented only — not being modified right now)
```
/admin/login
/admin/dashboard
/admin/products          ("Add/Edit Order" — this is your catalog, see 6.3 rename note)
/admin/products/new
/admin/products/:id/edit
/admin/orders            ("Order List" — real customer purchases)
/admin/orders/:id
/admin/inventory
/admin/inventory/new
/admin/inventory/:id/edit
/admin/gallery
```

---

## 4. Data Model (so admin and customer sides can sync correctly)

This is the fix underlying issue 1.7. Four separate entities, not two overloaded ones:

```
Product
 - id, name, description, price, category, status (Available/Sold/Hidden)
 - images: ProductImage[]           ← powers the heart/primary-image function
 - createdAt, updatedAt

ProductImage
 - id, productId, url, isPrimary (bool)   ← "heart" toggles this
 - sortOrder

CustomerOrder                        ← this is "Order List," real purchases
 - id, orderCode (#YC-1025), customerName, productId (ref),
   price, paymentMethod, paymentDate, status (Paid/Pending), notes

InventoryItem
 - id, name, category, stock, unit, unitPrice, totalValue,
   lastRestockDate, supplier, supplierLink

GalleryPhoto
 - id, url, sortOrder, isVisible     ← admin curates, customer only ever sees isVisible=true, read-only
```

With this split: "Add/Edit Order" in your admin becomes **"Products"** (manages `Product` + its images + the heart function), and "Order List" stays exactly as-is (manages `CustomerOrder`). Nothing about your admin *screens* has to look different — this is a backend/data fix, not a redesign — but it resolves why the Edit Order form currently has both product fields and customer fields jammed together.

---

## 5. Customer-Side Page Specs (priority build now)

### 5.1 Global Header (shared across Home + Shop + Product Detail)
- Fixed height `72px`, `bg-base` with `backdrop-blur` once scrolled (sticky).
- Left: logo. Center-left: nav links (Home, Shop) — underline indicator is a `2px` bar directly beneath the active link, `4px` gap, same treatment on every page, no exceptions.
- Right: search icon, account icon — same icon set, same spacing (`24px` gap) on every page.
- **Never changes background color between pages.** This alone fixes issue 1.5.

### 5.2 Home Page

**Hero**
- Container: `min-height: 640px` on desktop (not "auto," so content can't overflow the fold unpredictably), 2-column grid (`45% text / 55% image` desktop, stacks on mobile).
- Text column: eyebrow pill → H1 (3 lines, middle line accent-colored) → body → CTA button, `16px` vertical gap between each.
- Image column: bouquet photo contained within a fixed-ratio box (`4:5`), decorative petals as an absolutely-positioned overlay layer *outside* the image's own bounding box so they never get cropped oddly — floating asset layer, `z-index` above image, `pointer-events: none`.
- CTA button always fully visible — because the section has a defined min-height instead of shrink-wrapping content, this class of bug (button clipped off-screen) can't recur.

**Gallery preview section**
- One `Card` (solid-border variant), heading + subheading inside, carousel of *real, distinct* product photos (pull from `GalleryPhoto` where `isVisible=true`, ordered by `sortOrder` — this is literally the "picture only, display, nothing else" behavior you asked for).
- Arrow buttons positioned `-20px` outside the image track but *inside* the card's own padding box (card padding increased to `48px` on the sides specifically to make room) — fixes the clipped-arrow bug directly.
- All 4 (or however many) slides are visually cropped to the same aspect ratio and treatment (soft shadow, no colored border on the photo itself, since the border already belongs to the arrows/track) so mixed photo sources don't look mismatched.

**Delivery section**
- Card (glow-border variant — this becomes the intentional one glow exception), icon + heading + copy on the left, map image on the right, same `24px` card padding as every other card.

**Contact section**
- Two cards side by side, both using the same `Card` (flat variant) treatment — "Let's Create Something Beautiful Together" gets a real card wrapper matching "Send us a Message," so they read as a matched pair instead of one boxed / one floating.
- Input fields restyled to match the pink-outline input style already used on your admin login (Image 10) — dark fill, `1px` pink-tinted border, `12px` radius, consistent with the rest of the palette instead of the current washed-out brown.

### 5.3 Shop Page
- Header banner (title + subtitle) sits inside the same `1280px` container as everything else, no separate margin rules.
- Filter row: pill buttons (category) + Sort dropdown + Filter button, all same height (`44px`), `12px` gaps.
- Product grid: `repeat(auto-fill, minmax(240px, 1fr))`, gap `24px`. **Card = single element**, not image + separate bar: rounded `16px` on all four corners including the price footer, image and footer share one background/shadow, subtle 1:1 visual continuity.
- Card content: image (`4:3`) → status pill (top-right, overlaid) → name → price → chevron, all inside one bounded card with consistent `16px` internal padding on the text portion.

### 5.4 Product Detail Page
- Same `1280px` container/margins as Home and Shop (fixes issue 1.1's tight-margin problem).
- Left: thumbnail rail (vertical, `72px` wide) + main image (`4:5`, rounded `16px`), arrows overlaid centered-vertically on the image edges.
- Right: title, price (if a sale price exists, show **both**: strikethrough original + new price in accent color, side by side — if no sale is active, no strikethrough at all), description, single CTA.
- Decision needed from you: is ₱170 a genuine sale price with a missing new-price value, or should the strikethrough just be removed? I'll default to **no strikethrough** unless you confirm there's a real discount to show.

### 5.5 Animation & Motion (uniform across the site)
Keep this restrained and consistent rather than decorative-per-page:
- Page/section entrance: fade-up, `24px` translate, `400ms ease-out`, staggered `80ms` per child element.
- Card hover: `scale(1.02)` + soft shadow lift, `200ms`.
- Petal/sparkle decorations: slow drifting float loop (`8–12s`, randomized per-particle delay so they don't sync), `opacity 0.6–1`, capped particle count (6–10) so it never feels cluttered like some current crops suggest.
- Carousel transitions: `slide, 350ms ease-in-out`.
- Button press: `scale(0.97)` on active state.
- Nav sticky transition: background fades in over `200ms` on scroll past `40px`.

---

## 6. Admin-Side Blueprint (documented for continuity — not built/touched right now)

### 6.1 Login
Keep the **Image 10 version** as the baseline going forward: centered card, home icon (return to customer site), pink-toned input borders (not red), "Secure admin access only" footnote. Image 9's off-center layout and red input borders get retired.

### 6.2 Dashboard
Structure is already solid (revenue/orders stat cards, trend chart, category pie chart, "Go to Gallery" shortcut). Per your note: the flower/petal background decoration is a static design asset, not a user-uploaded photo — it should stay hardcoded in the theme layer, not pull from any image upload field. No original/uncropped image is ever needed here — whatever's already placed stays as-is.

### 6.3 "Add/Edit Order" → rename internally to **Products**
Per Section 4's data model: this section manages your catalog (name, price, category, status, description, images) — not customer purchases.
- **Heart/primary-image function:** on the Attach Product Image panel (Images 16/19), each attached thumbnail gets a small heart icon on its bottom edge. Clicking it sets that image's `isPrimary = true` (and unsets any other image on that product). The primary image is what renders first in the Shop grid and as the main image on Product Detail — thumbnail order elsewhere stays whatever the admin uploaded, only "which one is first" changes.
- **Clickable table rows:** every row in the Products table (Image 12) routes to that product's edit page on click — the whole row is the click target, not just the pencil icon, matching "just like the prototype" behavior you described.
- **Real-time reflection:** saving here updates the `Product` record; the customer Shop/Detail pages read live from the same source (see Section 7), so edits/deletes reflect without a manual customer-side refresh needed beyond standard page-load/polling.

### 6.4 Order List (real customer orders)
Stays as-is structurally — Order ID, Customer, Category, Price, Payment, Date, Status. This is where you manually log orders that come through Facebook/email. Rows here are **not** the ones that route to product editing (that's only the Products table) — this avoids the exact conflation flagged in 1.7.

### 6.5 Inventory
Same clickable-row pattern as Products: row click → `/admin/inventory/:id/edit`, "+ Add New Item" → `/admin/inventory/new` (Image 14/20 form). Matches your ask directly.

### 6.6 Gallery (admin)
Admin uploads/removes/reorders photos here (Image 17); customer Home gallery section is strictly read-only display of whatever's marked visible — exactly the "just showcase, nothing more" behavior you described.

### 6.7 Dropdown menus
You asked to keep "the first version" of the dropdown panels — I want to confirm which one before documenting it as final, since I only have the closed/collapsed state of these dropdowns in your screenshots (Status, Category, Payment Method, Sort By), not their open/expanded panel states. Once you send a screenshot of the open dropdown panel (the one you consider the "first version"), I'll lock that exact style into the design system so it's used identically everywhere a dropdown appears.

---

## 7. Real-Time Sync (Admin ↔ Customer)

Recommended approach, in order of simplicity:
1. **Simplest (good enough for a capstone + low traffic):** customer pages fetch product/gallery data on page load and re-fetch on a short interval (e.g. every 30–60s) or on window focus. No extra infrastructure.
2. **True real-time (if you want it for the demo):** WebSocket channel (Socket.io) — admin save/delete emits an event, connected customer tabs patch their local state instantly without a refresh.
3. Either way: deletes should be **soft** at the database level initially (a `deletedAt` flag) rather than hard-removed, so a mis-click can be undone before it's permanent — cheap insurance for a live capstone demo.

Start with option 1. It satisfies "fastest way possible" without adding deployment complexity; option 2 is a clean upgrade later if your defense panel wants to see live sync in action.

---

## 8. Recommended Tech Stack & Deployable Structure

Given your existing experience (Node/Express, PostgreSQL, Docker) and that this was prototyped in Figma Make (React-based), the lowest-friction path is:

- **Frontend:** React + Vite + Tailwind CSS (design tokens from Section 2 as a `tailwind.config.js` theme extension — this is what actually *enforces* unity, since components can't drift from the scale).
- **Backend:** Node.js + Express, same stack you already know from the blog project.
- **Database:** MySQL (matches your SIS capstone experience) or PostgreSQL (matches your blog project) — either works; MySQL if you want one less thing to context-switch between with your capstone.
- **Image storage:** Cloudinary (free tier is enough for a capstone) — also gives you built-in cropping, which directly solves your "support the cropped, don't need the original" note: you upload once, crop in the UI, and only the cropped derivative URL gets stored/served.
- **Deployment:** Frontend → Vercel/Netlify (free), Backend + DB → Railway or Render (free/low-cost tier).

Suggested folder structure:
```
fazzyu/
├── client/                  (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/      (shared: Nav, Card, Button, ProductCard, Carousel)
│   │   ├── pages/customer/  (Home, Shop, ProductDetail)
│   │   ├── pages/admin/     (Login, Dashboard, Products, Orders, Inventory, Gallery)
│   │   ├── styles/tokens.css or tailwind.config.js
│   │   └── lib/api.js
├── server/                  (Node/Express)
│   ├── routes/ (products.js, orders.js, inventory.js, gallery.js, auth.js)
│   ├── models/
│   └── db/
└── README.md
```

---

## 9. Execution Order (what happens next, in sequence)

1. Lock the design tokens (Section 2) into a real Tailwind config — this single step prevents every spacing/color drift issue from recurring.
2. Rebuild shared components: Header, Card (3 variants), Button, ProductCard — once, reused everywhere.
3. Rebuild Home page sections against the new components + fixed hero container.
4. Rebuild Shop grid + Product Detail against the same components/container.
5. Wire customer pages to real (even placeholder-but-varied) product/gallery data so spacing can be judged with real content.
6. Only after customer side is solid: revisit admin per Section 6, starting with the Products/Orders data-model split.

## 10. Two things I need from you before I start building
- The **open/expanded state** of your dropdown menus (Status, Category, Sort By, Payment) — a screenshot of one open, so I lock the "first version" style.
- Confirm: is the ₱170 strikethrough a real sale that's missing its discounted price, or should I just remove the strikethrough?

Once I have those, I'll start on Step 1–4 above (shared components + Home/Shop/Product Detail rebuild) as an actual running project scaffold.
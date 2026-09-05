import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";

import { AppDataProvider } from "./context/AppDataContext";
import { AuthGuard } from "./components/AuthGuard";
import Navbar from "./components/Navbar";
import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import PhotoboothPage from "./pages/PhotoboothPage";
import ItemPage from "./pages/ItemPage";
import GalleryPage from "./pages/GalleryPage";
import LoginPage from "./pages/LoginPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAddEditPage from "./pages/admin/AdminAddEditPage";
import AdminAddOrderPage from "./pages/admin/AdminAddOrderPage";
import AdminEditOrderPage from "./pages/admin/AdminEditOrderPage";
import AdminOrderListPage from "./pages/admin/AdminOrderListPage";
import AdminInventoryPage from "./pages/admin/AdminInventoryPage";
import AdminAddNewItemPage from "./pages/admin/AdminAddNewItemPage";
import AdminEditItemPage from "./pages/admin/AdminEditItemPage";
import AdminGalleryPage from "./pages/admin/AdminGalleryPage";

function WithNav({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />
      <main className="pt-[72px]">{children}</main>
    </div>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminLayout>{children}</AdminLayout>
    </AuthGuard>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppDataProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#2d1f24",
              color: "white",
              border: "1px solid rgba(209,126,165,0.3)",
            },
          }}
        />
        <Routes>
          {/* Customer routes */}
          <Route path="/" element={<WithNav><HomePage /></WithNav>} />
          <Route path="/shop" element={<WithNav><ShopPage /></WithNav>} />
          <Route path="/shop/:id" element={<WithNav><ItemPage /></WithNav>} />
          <Route path="/photobooth" element={<WithNav><PhotoboothPage /></WithNav>} />
          <Route path="/gallery" element={<WithNav><GalleryPage /></WithNav>} />

          {/* Login standalone */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminShell><AdminDashboard /></AdminShell>} />
          <Route path="/admin/orders" element={<AdminShell><AdminAddEditPage /></AdminShell>} />
          <Route path="/admin/orders/new" element={<AdminShell><AdminAddOrderPage /></AdminShell>} />
          <Route path="/admin/orders/:id/edit" element={<AdminShell><AdminEditOrderPage /></AdminShell>} />
          <Route path="/admin/order-list" element={<AdminShell><AdminOrderListPage /></AdminShell>} />
          <Route path="/admin/inventory" element={<AdminShell><AdminInventoryPage /></AdminShell>} />
          <Route path="/admin/inventory/new" element={<AdminShell><AdminAddNewItemPage /></AdminShell>} />
          <Route path="/admin/inventory/:id/edit" element={<AdminShell><AdminEditItemPage /></AdminShell>} />
          <Route path="/admin/gallery" element={<AdminShell><AdminGalleryPage /></AdminShell>} />
        </Routes>
      </AppDataProvider>
    </BrowserRouter>
  );
}
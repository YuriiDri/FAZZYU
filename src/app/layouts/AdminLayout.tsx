import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, LayoutDashboard, ClipboardList, Package, List, Images, LogOut } from "lucide-react";

import imgLogo from "@/imports/DashboardPage/b34d701fd1ceed4106f0f96c9254084af23d9951.png";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Add/Edit Order", path: "/admin/orders", icon: ClipboardList },
  { label: "Inventory", path: "/admin/inventory", icon: Package },
  { label: "Order List", path: "/admin/order-list", icon: List },
  { label: "Gallery", path: "/admin/gallery", icon: Images },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  function isActive(path: string) {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  }

  function handleLogout() {
    localStorage.removeItem("yc_admin_token");
    navigate("/login");
    onNavigate?.();
  }

  return (
    <div className="flex flex-col h-full py-3">
      {/* Logo */}
      <div className="px-4 mb-8">
        <img src={imgLogo} alt="Logo" className="w-[180px] h-auto object-contain" />
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-2">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-4 rounded-[10px] font-['Roboto',sans-serif] text-[18px] text-white transition-colors ${
              isActive(path) ? "bg-[#381c2a]" : "hover:bg-[rgba(56,28,42,0.4)]"
            }`}
          >
            <Icon className="w-6 h-6 flex-shrink-0 text-[#e6e6e6]" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 mt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-4 rounded-[10px] w-full font-['Roboto',sans-serif] text-[18px] text-white hover:bg-[rgba(56,28,42,0.4)] transition-colors"
        >
          <LogOut className="w-6 h-6 flex-shrink-0 text-[#e6e6e6]" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

// Replace line 58 of AdminLayout.tsx:
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1E1518] flex"> {/* Changed bg-[#0c0d0c] to bg-[#1E1518] */}
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-3 top-3 bottom-3 w-[300px] bg-[#110f10] rounded-[20px] z-40 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-[64px] bg-[#110f10] z-40 flex items-center justify-between px-4 border-b border-[rgba(255,255,255,0.08)]">
        <img src={imgLogo} alt="Logo" className="h-[40px] object-contain" />
        <button
          onClick={() => setDrawerOpen(true)}
          className="text-white p-2"
          aria-label="Open menu"
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#110f10] z-50 lg:hidden overflow-y-auto"
            >
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-4 text-white p-1"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
              <SidebarContent onNavigate={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:ml-[316px] pt-[64px] lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8 min-h-screen">{children}</div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Home, ShieldAlert, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TurnstileWidget } from "@/app/components/TurnstileWidget";

import imgLogo from "@/imports/LoginPage/b34d701fd1ceed4106f0f96c9254084af23d9951.png";
import imgPetals from "@/imports/image-1.png";

const WORKER_URL = "https://withered-boat-9829.gata-andrie.workers.dev";

export default function AdminLoginPage() {
  const [adminKey, setAdminKey] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [resetCounter, setResetCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleAdminSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!adminKey.trim()) {
      toast.error("Please enter the Admin Access Key.");
      return;
    }

    if (import.meta.env.VITE_TURNSTILE_SITE_KEY && !turnstileToken) {
      toast.error("Please complete the Cloudflare security check.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "admin_login",
          adminKey: adminKey.trim(),
          turnstileToken,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.token) {
        setResetCounter((c) => c + 1);
        throw new Error(data.error || "Invalid Admin Access Key.");
      }

      localStorage.setItem("yc_admin_token", data.token);
      toast.success("Admin access verified.");
      navigate("/admin", { replace: true });
    } catch (err: any) {
      setResetCounter((c) => c + 1);
      toast.error(err.message || "Admin verification failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      <img
        src={imgPetals}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-[#0d0a0b]/85" />

      <Link
        to="/"
        aria-label="Return home"
        className="absolute top-8 right-8 text-[#e6e6e6] hover:text-[#d17ea5] transition-colors duration-200 z-20"
      >
        <Home className="w-10 h-10" strokeWidth={1.5} />
      </Link>

      <div className="absolute top-6 left-8 w-[180px] h-[64px] z-20">
        <img
          src={imgLogo}
          alt="Yuri's Craft"
          className="h-full w-full object-contain object-left"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[460px] mx-4"
      >
        <div className="absolute inset-0 rounded-[20px] border-2 border-[#ca498c]/40 shadow-[0px_4px_50px_15px_rgba(202,73,140,0.25)]" />
        <div className="absolute inset-0 rounded-[20px] bg-[#140e11]/95 backdrop-blur-md" />

        <div className="relative z-10 px-8 py-10">
          <div className="flex items-center gap-2 text-[#ca498c] text-xs uppercase tracking-widest font-bold mb-2">
            <ShieldAlert className="w-4 h-4" /> Restricted Staff Portal
          </div>
          <h2 className="font-['Crimson_Text',serif] text-4xl text-white mb-2">
            Admin Access
          </h2>
          <p className="text-sm text-white/70 mb-7">
            Enter your Cloudflare-verified Admin Access Key to manage orders and inventory.
          </p>

          <form onSubmit={handleAdminSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-sm text-white/90 block mb-1.5">
                Admin Access Key
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter ADMIN_ACCESS_KEY"
                  className="w-full h-12 rounded-[10px] border border-[#f3a3a5]/50 bg-black/40 pl-11 pr-4 text-base text-white outline-none focus:border-[#ca498c] transition-all placeholder:text-white/30"
                />
              </div>
            </div>

            <TurnstileWidget
              onVerify={setTurnstileToken}
              resetSignal={resetCounter}
            />

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full h-12 bg-[#ca498c] rounded-[10px] font-bold text-base text-white shadow-[0_4px_20px_rgba(202,73,140,0.4)] hover:bg-[#b53d7b] transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Unlock Admin Dashboard
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
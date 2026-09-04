import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Home, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import imgLogo from "@/imports/LoginPage/b34d701fd1ceed4106f0f96c9254084af23d9951.png";
import imgPetals from "@/imports/image-1.png";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // ── DEFINE YOUR ADMIN CREDENTIALS HERE ──
    const ADMIN_USERNAME = "yuri";
    const ADMIN_PASSWORD = "dadangcutie";

    // 1. Check if fields are empty
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter your username and password.");
      return;
    }

    // 2. Validate credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      toast.error("Invalid username or password.");
      return;
    }

    // 3. Success logic
    toast.success("Logging in…");
    localStorage.setItem("yc_admin_token", "admin");
    setTimeout(() => navigate("/admin"), 1200);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Petal background image */}
      <img
        src={imgPetals}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />
      {/* Dark overlay to maintain legibility */}
      <div className="absolute inset-0 bg-[#0d0a0b]/80" />

      {/* Home button */}
      <Link
        to="/"
        aria-label="Return home"
        className="absolute top-10 right-10 text-[#e6e6e6] hover:text-[#d17ea5] transition-colors duration-200 z-20"
      >
        <Home className="w-[50px] h-[50px]" strokeWidth={1.4} />
      </Link>

      {/* Logo */}
      <div className="absolute top-[22px] left-10 w-[202px] h-[72px] z-20">
        <img src={imgLogo} alt="Yuri's Craft" className="h-full w-full object-contain object-left" />
      </div>

      {/* Login panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-[600px] mx-6"
      >
        {/* Panel glow border */}
        <div className="absolute inset-0 rounded-[20px] border-[3px] border-[#fdd0d0]/30 shadow-[0px_4px_50px_20px_rgba(204,120,159,0.3)]" />
        <div className="absolute inset-0 rounded-[20px] bg-[#8b596e]/10" />

        <div className="relative z-10 px-10 py-14">
          <h2 className="font-['Crimson_Text',serif] not-italic text-[55px] text-white mb-3">
            Welcome back!
          </h2>
          <p className="font-['Roboto',sans-serif] font-normal text-[23px] text-white mb-10">
            Please login to your admin account.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username */}
            <div>
              <label className="font-['Roboto',sans-serif] font-normal text-[23px] text-white block mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full h-[69px] rounded-[10px] border border-[#f3a3a5]/70 bg-transparent px-5 font-['Roboto',sans-serif] text-[22px] text-white outline-none focus:border-[#d17ea5] focus:shadow-[0_0_0_2px_rgba(209,126,165,0.3)] transition-all duration-200 placeholder:text-white/30"
                placeholder="Enter your username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="font-['Roboto',sans-serif] font-normal text-[23px] text-white block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full h-[69px] rounded-[10px] border border-[#f3a3a5]/70 bg-transparent px-5 font-['Roboto',sans-serif] text-[22px] text-white outline-none focus:border-[#d17ea5] focus:shadow-[0_0_0_2px_rgba(209,126,165,0.3)] transition-all duration-200 placeholder:text-white/30"
                placeholder="Enter your password"
              />
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setRemember((v) => !v)}
                className={`w-[40px] h-[40px] rounded-[5px] border border-[#f3a3a5]/70 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                  remember ? "bg-[#d17ea5]/40 border-[#d17ea5]" : "bg-transparent"
                }`}
              >
                {remember && (
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                    <path
                      d="M1 7L6.5 12.5L17 1"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span className="font-['Roboto',sans-serif] font-normal text-[23px] text-white">
                Remember me
              </span>
            </div>

            {/* Login button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-[69px] bg-[#d17ea5] rounded-[10px] font-['Roboto',sans-serif] font-bold text-[27px] text-white shadow-[0_4px_24px_rgba(209,126,165,0.4)] hover:bg-[#c26d94] transition-colors duration-200 mt-2 cursor-pointer"
            >
              Login
            </motion.button>
          </form>

          {/* Secure note */}
          <div className="flex items-center gap-3 mt-8">
            <ShieldCheck className="w-[28px] h-[28px] text-[#D45D94] flex-shrink-0" />
            <span className="font-['Roboto',sans-serif] font-normal text-[22px] text-white">
              Secure admin access only
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
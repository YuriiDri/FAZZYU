import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Home, ShieldCheck, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/app/context/AppDataContext";
import { TurnstileWidget } from "@/app/components/TurnstileWidget";

import imgLogo from "@/imports/LoginPage/b34d701fd1ceed4106f0f96c9254084af23d9951.png";
import imgPetals from "@/imports/image-1.png";

const WORKER_URL = "https://withered-boat-9829.gata-andrie.workers.dev";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [resetCounter, setResetCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password.trim() || (isSignUp && !fullName.trim())) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (import.meta.env.VITE_TURNSTILE_SITE_KEY && !turnstileToken) {
      toast.error("Please complete the Cloudflare security check.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Verify Turnstile & rate limits via Cloudflare Worker
      const secRes = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "verify_security",
          turnstileToken,
        }),
      });

      const secData = await secRes.json();
      if (!secRes.ok || !secData.success) {
        setResetCounter((c) => c + 1);
        throw new Error(secData.error || "Security verification failed.");
      }

      // 2. Authenticate customer via Supabase Auth
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() },
          },
        });

        if (error) throw error;

        if (data.session) {
          toast.success("Account created! Welcome to Fazzyu Creations 🌸");
          navigate("/shop");
        } else {
          toast.success(
            "Account created! Please check your email to confirm, then log in."
          );
          setIsSignUp(false);
          setResetCounter((c) => c + 1);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        toast.success("Welcome back! 🌸");
        navigate("/shop");
      }
    } catch (err: any) {
      setResetCounter((c) => c + 1);
      toast.error(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-16">
      <img
        src={imgPetals}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-[#0d0a0b]/80" />

      {/* Home button */}
      <Link
        to="/"
        aria-label="Return home"
        className="absolute top-8 right-8 text-[#e6e6e6] hover:text-[#d17ea5] transition-colors duration-200 z-20"
      >
        <Home className="w-10 h-10" strokeWidth={1.5} />
      </Link>

      {/* Logo */}
      <Link
        to="/"
        className="absolute top-6 left-8 w-[180px] h-[64px] z-20"
      >
        <img
          src={imgLogo}
          alt="Fazzyu Creations"
          className="h-full w-full object-contain object-left"
        />
      </Link>

      {/* Customer Login / Sign Up Panel */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[500px] mx-4"
      >
        <div className="absolute inset-0 rounded-[20px] border-2 border-[#fdd0d0]/30 shadow-[0px_4px_50px_15px_rgba(204,120,159,0.25)]" />
        <div className="absolute inset-0 rounded-[20px] bg-[#1a1115]/90 backdrop-blur-md" />

        <div className="relative z-10 px-8 py-10">
          <div className="flex items-center gap-2 text-[#E8A0BE] text-xs uppercase tracking-widest font-semibold mb-2">
            <Sparkles className="w-4 h-4" /> Customer Portal
          </div>
          <h2 className="font-['Crimson_Text',serif] text-4xl text-white mb-2">
            {isSignUp ? "Create an Account" : "Welcome Back!"}
          </h2>
          <p className="font-['Roboto',sans-serif] text-sm text-white/75 mb-7">
            {isSignUp
              ? "Sign up to save custom bouquet designs and place orders faster."
              : "Sign in to your Fazzyu Creations customer account."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignUp && (
              <div>
                <label className="text-sm text-white/90 block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 rounded-[10px] border border-[#f3a3a5]/50 bg-black/30 px-4 text-base text-white outline-none focus:border-[#d17ea5] transition-all placeholder:text-white/30"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="text-sm text-white/90 block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full h-12 rounded-[10px] border border-[#f3a3a5]/50 bg-black/30 px-4 text-base text-white outline-none focus:border-[#d17ea5] transition-all placeholder:text-white/30"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm text-white/90 block mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="w-full h-12 rounded-[10px] border border-[#f3a3a5]/50 bg-black/30 px-4 text-base text-white outline-none focus:border-[#d17ea5] transition-all placeholder:text-white/30"
                placeholder="••••••••"
              />
            </div>

            {/* Cloudflare Turnstile Widget */}
            <TurnstileWidget
              onVerify={setTurnstileToken}
              resetSignal={resetCounter}
            />

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full h-12 bg-[#d17ea5] rounded-[10px] font-bold text-base text-white shadow-[0_4px_20px_rgba(209,126,165,0.4)] hover:bg-[#c26d94] transition-colors mt-1 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSignUp ? "Create Account" : "Sign In"}
            </motion.button>
          </form>

          {/* Toggle Login / Sign Up */}
          <div className="mt-6 text-center text-sm text-white/75">
            {isSignUp ? "Already have an account?" : "New to Fazzyu Creations?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp((prev) => !prev);
                setResetCounter((c) => c + 1);
              }}
              className="text-[#E8A0BE] font-semibold hover:underline cursor-pointer"
            >
              {isSignUp ? "Sign In" : "Create an Account"}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 pt-5 border-t border-white/10">
            <ShieldCheck className="w-4 h-4 text-[#D45D94]" />
            <span className="text-xs text-white/60">
              Protected by Cloudflare Turnstile
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
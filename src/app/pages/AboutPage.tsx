import { Link } from "react-router";
import { motion } from "motion/react";
import { Facebook, Mail, GraduationCap, Heart, Sparkles } from "lucide-react";

// Reference the exact image you provided
import imgAbout from "@/imports/about me.png";

export default function AboutPage() {
  return (
    <div className="bg-[#1E1518] min-h-screen text-white font-sans pt-[104px] pb-16 px-4 sm:px-8 selection:bg-[#ca498c] selection:text-white">
      {/* WIDENED Main Layout Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1400px] mx-auto bg-[#140e11] rounded-[48px] p-6 sm:p-10 lg:p-12 border border-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.4)]"
      >
        {/* TOP SECTION: Hero Image with Bottom-Left Cutout */}
        <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] rounded-[32px] overflow-hidden mb-12 sm:mb-20">
          
          {/* Main Background Image */}
          <img 
            src={imgAbout} 
            alt="Yuriii - Fazzyu's Creation" 
            className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
          />
          
          {/* Dark gradient overlay for text readability on the right */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#140e11]/80 via-transparent to-transparent" />
          
          {/* Overlapping Text: Bottom Right */}
          <div className="absolute bottom-10 right-8 sm:right-12 text-right z-20">
            <p className="font-sans text-white/90 text-sm sm:text-xl tracking-[0.3em] uppercase font-bold drop-shadow-md mb-2">
              Fazzyu's Creation
            </p>
            <h1 
              className="font-serif text-6xl sm:text-[100px] lg:text-[140px] text-white font-black tracking-wider leading-none"
              style={{ textShadow: "4px 4px 0px rgba(202,73,140,0.5)" }}
            >
              YURIII
            </h1>
          </div>

          {/* THE CUTOUT: Bottom Left Overlap Area */}
          <div className="absolute bottom-0 left-0 w-full md:w-[50%] lg:w-[45%] xl:w-[40%] bg-[#140e11] rounded-tr-[48px] z-20 pt-10 pr-10">
            {/* Corner smoothing illusions (only visible on desktop) */}
            <div className="hidden md:block absolute top-[-40px] left-0 w-[40px] h-[40px] bg-transparent rounded-bl-[40px] shadow-[-20px_20px_0_0_#140e11]" />
            <div className="hidden md:block absolute bottom-0 right-[-40px] w-[40px] h-[40px] bg-transparent rounded-bl-[40px] shadow-[-20px_20px_0_0_#140e11]" />

            <h2 className="font-serif text-[#ca498c] text-3xl sm:text-4xl lg:text-5xl uppercase tracking-[0.1em] font-black mb-6">
              OUR CREATIONS
            </h2>
            <p className="font-sans text-white/70 text-base sm:text-lg leading-relaxed pr-4">
              We specialize in preparing authentic, handcrafted pieces ranging from beautiful fuzzy wire bouquets to unique custom dolls and crafts, bringing creativity and warmth to every single order.
            </p>
          </div>
        </div>

        {/* BOTTOM SECTION: Two-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 px-2 sm:px-6">
          
          {/* LEFT COLUMN: Check the Shop & Socials */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            
            {/* Check the Shop Section */}
            <div>
              <h2 className="font-serif text-[#ca498c] text-3xl sm:text-4xl uppercase tracking-[0.1em] font-black mb-6 leading-[1.2]">
                CHECK THE SHOP <br /> FOR MORE
              </h2>
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 bg-[#ca498c] hover:bg-[#b83d7a] text-white rounded-full font-sans font-bold text-sm tracking-widest uppercase transition-all shadow-[0_6px_25px_rgba(209,126,165,0.4)]"
                >
                  View the Catalog
                </motion.button>
              </Link>
            </div>

            {/* Social Media Card */}
            <div className="bg-black/40 border border-white/10 rounded-[32px] p-8 mt-auto">
              <p className="font-serif text-xl text-white font-bold tracking-widest uppercase mb-8">
                Connect with Fazzyu!
              </p>
              <div className="flex flex-col gap-6">
                <a href="https://www.facebook.com/fazzyuu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 group">
                  <div className="w-14 h-14 rounded-[16px] bg-[#ca498c] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Facebook className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-lg font-medium text-white/80 group-hover:text-white transition-colors">Fazzyu Creations</span>
                </a>
                <a href="https://www.tiktok.com/@ate_yuriiiiiii" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 group">
                  <div className="w-14 h-14 rounded-[16px] bg-[#ca498c] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <TikTokIcon />
                  </div>
                  <span className="text-lg font-medium text-white/80 group-hover:text-white transition-colors">@ate_yuriiiiiii</span>
                </a>
                <a href="mailto:lucasjoshmarie2005@gmail.com" className="flex items-center gap-5 group">
                  <div className="w-14 h-14 rounded-[16px] bg-[#ca498c] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-lg font-medium text-white/80 group-hover:text-white transition-colors break-all">lucasjoshmarie2005@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: About Me Info List */}
          <div className="lg:col-span-7 flex flex-col">
            <h2 className="font-serif text-[#ca498c] text-3xl sm:text-4xl uppercase tracking-[0.1em] font-black mb-10">
              ABOUT ME
            </h2>
            
            <div className="flex flex-col gap-8">
              {/* Item 1: Overview */}
              <div className="flex gap-6 sm:gap-8 items-start pb-8 border-b border-white/10">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-[24px] bg-[#ca498c]/20 border border-[#ca498c]/30 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-10 h-10 sm:w-14 sm:h-14 text-[#ca498c]" />
                </div>
                <div className="pt-2 sm:pt-4">
                  <p className="text-white/70 text-base sm:text-xl leading-relaxed font-sans">
                    Hello! I am currently an <strong className="text-white font-bold tracking-wide">iskolar student</strong> who creates these lovely bouquets and handcrafts alongside my studies.
                  </p>
                </div>
              </div>

              {/* Item 2: Hobby */}
              <div className="flex gap-6 sm:gap-8 items-start pb-8 border-b border-white/10">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-[24px] bg-[#ca498c]/20 border border-[#ca498c]/30 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-10 h-10 sm:w-14 sm:h-14 text-[#ca498c]" />
                </div>
                <div className="pt-2 sm:pt-4">
                  <p className="text-white/70 text-base sm:text-xl leading-relaxed font-sans">
                    Creating these bouquets and crafts is like a true <strong className="text-white font-bold tracking-wide">hobby for me and is deeply a part of who I am</strong>. Every twist of wire is made with love.
                  </p>
                </div>
              </div>

              {/* Item 3: Quality */}
              <div className="flex gap-6 sm:gap-8 items-start">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-[24px] bg-[#ca498c]/20 border border-[#ca498c]/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-10 h-10 sm:w-14 sm:h-14 text-[#ca498c]" />
                </div>
                <div className="pt-2 sm:pt-4">
                  <p className="text-white/70 text-base sm:text-xl leading-relaxed font-sans">
                    We make absolutely sure that all the products we make and sell are in the <strong className="text-white font-bold tracking-wide">highest quality</strong> that we can possibly make, ensuring you get the best.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}

function TikTokIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.61a8.18 8.18 0 004.78 1.53V6.7a4.85 4.85 0 01-1.02-.01z" />
    </svg>
  );
}
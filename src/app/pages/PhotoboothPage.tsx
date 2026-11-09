import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Download, Trash2, Sparkles, X, Maximize2, Minimize2 } from "lucide-react";
import { Rnd } from "react-rnd";
import { toast } from "sonner";

// Import your custom flower widget image
import imgWidgetFlower from "@/imports/widget-flower.jpg";

type Sticker = {
  id: string;
  type: "text" | "emoji" | "badge";
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function PhotoboothPage() {
  const [hasPermission, setHasPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);

  async function handleStartPhotobooth() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false,
      });
      setStream(mediaStream);
      setHasPermission(true);
      toast.success("Camera connected securely.");
    } catch (err) {
      console.error(err);
      toast.error("Camera access denied or unavailable.");
    }
  }

  // FIXED: Added `isFullscreen` to the dependency array. 
  // Now, when the view swaps between floating/fullscreen, the video stream re-attaches instantly!
  useEffect(() => {
    if (hasPermission && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [hasPermission, stream, isFullscreen]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  function handleCapture() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setPhotos((prev) => [dataUrl, ...prev]);
      toast.success("Snapshot captured!");
      
      // Flash effect on capture
      const flash = document.createElement("div");
      flash.className = "fixed inset-0 bg-white z-[9999] opacity-0 pointer-events-none transition-opacity duration-75";
      document.body.appendChild(flash);
      setTimeout(() => (flash.style.opacity = "1"), 0);
      setTimeout(() => {
        flash.style.opacity = "0";
        setTimeout(() => document.body.removeChild(flash), 100);
      }, 75);
    }
  }

  function handleAddSticker(content: string, type: "text" | "emoji" | "badge") {
    const newSticker: Sticker = {
      id: `stk-${Date.now()}`,
      type,
      content,
      x: window.innerWidth / 2 - 60,
      y: window.innerHeight / 2 - 60,
      width: type === "badge" ? 180 : 90,
      height: type === "badge" ? 50 : 90,
    };
    setStickers((prev) => [...prev, newSticker]);
  }

  function handleDeletePhoto(indexToDelete: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== indexToDelete));
    toast.success("Photo removed from filmstrip.");
  }

  const timeString = currentTime.toLocaleTimeString("en-US", {
    timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit", hour12: true,
  });

  const dateString = currentTime.toLocaleDateString("en-US", {
    timeZone: "Asia/Manila", weekday: "short", month: "short", day: "numeric",
  });

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  // Calculate centered default positions for the draggable widget
  const defaultWidth = 720;
  const defaultHeight = 540;
  const initialX = typeof window !== 'undefined' ? (window.innerWidth - defaultWidth) / 2 : 100;
  const initialY = typeof window !== 'undefined' ? (window.innerHeight - defaultHeight) / 2 - 60 : 100;

  return (
    <div className="bg-[#1E1518] min-h-[calc(100vh-72px)] overflow-hidden relative font-sans text-white select-none flex flex-col">
      {/* Magic Board Ambient Background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-80"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(212, 106, 147, 0.25) 0%, rgba(30, 21, 24, 1) 100%)",
        }}
      />

      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden">
        {!hasPermission ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#140e11] border border-white/25 rounded-[20px] p-6 sm:p-10 max-w-md text-center shadow-[0_10px_40px_rgba(209,126,165,0.2)] mx-auto"
          >
            <div className="w-16 h-16 bg-[#ca498c]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-8 h-8 text-[#ca498c]" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl mb-3">Magic Photobooth</h1>
            <p className="text-white/70 text-xs sm:text-sm mb-8 leading-relaxed font-sans">
              We need access to your camera to start the photobooth. All photos stay securely on your device and are never uploaded to any server.
            </p>
            <button
              onClick={handleStartPhotobooth}
              className="bg-[#ca498c] hover:bg-[#b83d7a] text-white font-medium px-8 py-3 rounded-full transition-colors w-full cursor-pointer shadow-[0_4px_20px_rgba(209,126,165,0.4)]"
            >
              Allow Camera Access
            </button>
          </motion.div>
        ) : (
          <div className="relative w-full h-full flex-1 flex flex-col">
            
            {/* ── macOS Desktop Widgets (Hidden on mobile & fullscreen) ── */}
            {!isFullscreen && (
              <div className="absolute left-4 top-4 hidden lg:flex flex-col gap-4 z-10 pointer-events-none select-none">
                <div className="w-[260px] bg-[#2a1e23]/80 backdrop-blur-md border border-white/10 rounded-[20px] p-4 shadow-2xl flex flex-col justify-center">
                  <div className="font-serif text-[36px] font-bold text-[#E8A0BE] leading-none tracking-tight">
                    {timeString}
                  </div>
                  <div className="font-sans text-xs text-white/70 mt-2 font-medium tracking-wide">
                    {dateString}, Makati City
                  </div>
                </div>

                <div className="w-[260px] h-[170px] rounded-[20px] overflow-hidden border border-white/10 shadow-2xl">
                  <img
                    src={imgWidgetFlower}
                    alt="Custom aesthetic flower"
                    className="w-full h-full object-cover filter brightness-95"
                  />
                </div>
              </div>
            )}

            {/* ── Magic Board Toggle Button ── */}
            <div className={`absolute left-4 z-40 transition-all ${isFullscreen ? "bottom-4 lg:bottom-6" : "bottom-24 lg:bottom-6"}`}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#140e11]/90 hover:bg-[#1a1116] border border-[#ca498c]/50 rounded-full shadow-[0_4px_20px_rgba(209,126,165,0.3)] transition-all cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-[#ca498c] animate-pulse" />
                <span className="font-sans text-xs sm:text-sm font-medium text-white hidden sm:inline-block">Magic Board</span>
              </button>
            </div>

            {/* ── Popup Magic Board Menu Drawer ── */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute left-4 w-[240px] sm:w-[260px] bg-[#140e11]/95 backdrop-blur-md border border-white/20 rounded-[16px] p-4 flex flex-col gap-3 z-50 shadow-2xl ${isFullscreen ? "bottom-16 sm:bottom-20" : "bottom-40 lg:bottom-20"}`}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="font-serif text-[15px] text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#ca498c]" /> Stickers & Designs
                    </h3>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="text-white/60 hover:text-white cursor-pointer p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-white/50">Tip: Double-click any sticker to delete it!</p>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-[#ca498c] font-bold">Decorations</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {["🌸", "💖", "🎀", "✨", "🧸", "🌷", "⭐", "🦋"].map((emoji, i) => (
                        <button
                          key={i}
                          onClick={() => handleAddSticker(emoji, "emoji")}
                          className="h-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[8px] text-base flex items-center justify-center transition-colors cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-[#ca498c] font-bold">Badges</span>
                    <button
                      onClick={() => handleAddSticker("Yuri's Craft 🌸", "badge")}
                      className="px-3 py-2 bg-[#ca498c]/20 hover:bg-[#ca498c]/30 border border-[#ca498c]/40 rounded-[8px] text-xs text-white text-left transition-colors cursor-pointer"
                    >
                      + Yuri's Craft Badge
                    </button>
                    <button
                      onClick={() => handleAddSticker("Made with Love ✨", "badge")}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[8px] text-xs text-white/80 text-left transition-colors cursor-pointer"
                    >
                      + Made with Love
                    </button>
                  </div>

                  {stickers.length > 0 && (
                    <button
                      onClick={() => setStickers([])}
                      className="text-xs text-red-400 hover:text-red-300 pt-2 border-t border-white/10 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Clear All Stickers
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Spawned Resizable & Double-Clickable Stickers ── */}
            {stickers.map((stk) => (
              <Rnd
                key={stk.id}
                default={{
                  x: stk.x,
                  y: stk.y,
                  width: stk.width,
                  height: stk.height,
                }}
                bounds="parent"
                className="flex items-center justify-center z-40 cursor-grab active:cursor-grabbing"
              >
                <div
                  onDoubleClick={() => setStickers((prev) => prev.filter((s) => s.id !== stk.id))}
                  title="Double-click to delete"
                  className={`relative w-full h-full flex items-center justify-center select-none ${
                    stk.type === "badge" 
                      ? "bg-[#140e11]/95 border border-[#ca498c]/60 rounded-[10px] px-3 shadow-lg text-xs font-medium text-white w-full h-full" 
                      : "text-4xl sm:text-5xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] w-full h-full flex items-center justify-center"
                  }`}
                >
                  {stk.content}
                </div>
              </Rnd>
            ))}

            {/* ── Responsive Camera Window (MacStyle Drag / Double Click Fullscreen) ── */}
            {isFullscreen || isMobile ? (
              <div 
                className="absolute inset-0 w-full h-full bg-black z-10 flex flex-col"
                onDoubleClick={() => !isMobile && setIsFullscreen(false)}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                {/* Fullscreen Exit Hint (Desktop) */}
                {!isMobile && isFullscreen && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white/70 text-xs tracking-wider flex items-center gap-2 pointer-events-none">
                    <Minimize2 className="w-3 h-3" /> Double-click anywhere to exit fullscreen
                  </div>
                )}
              </div>
            ) : (
              /* FIXED: Removed the interfering wrapper so Rnd can be dragged and resized properly on the window */
              <Rnd
                default={{
                  x: initialX,
                  y: initialY,
                  width: defaultWidth,
                  height: defaultHeight,
                }}
                minWidth={400}
                minHeight={300}
                bounds="window"
                dragHandleClassName="macos-window-header"
                className="bg-[#140e11] border border-white/20 rounded-[16px] shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden z-20 pointer-events-auto group absolute"
              >
                <div className="macos-window-header h-10 bg-[#1e1418] border-b border-white/10 flex items-center justify-between px-4 cursor-move flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div 
                      className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 cursor-pointer flex items-center justify-center transition-colors group/btn"
                      onClick={() => setIsFullscreen(true)}
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-2 h-2 text-black/50 opacity-0 group-hover/btn:opacity-100" />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-white/60 tracking-wider">
                    Photo Booth (Double click video for Fullscreen)
                  </span>
                  <div className="w-10"></div> {/* Spacer for centering */}
                </div>

                <div 
                  className="relative flex-1 bg-black overflow-hidden flex items-center justify-center cursor-pointer"
                  onDoubleClick={() => setIsFullscreen(true)}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  
                  {/* Hover expand icon */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 backdrop-blur-sm p-4 rounded-full">
                      <Maximize2 className="w-8 h-8 text-white/70" />
                    </div>
                  </div>
                </div>
              </Rnd>
            )}

            {/* ── Floating Bottom Shutter & Filmstrip Control Deck ── */}
            <div className={`absolute left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-6 bottom-4 lg:bottom-6 bg-[#140e11]/90 backdrop-blur-md border border-white/20 rounded-[20px] px-3 sm:px-5 py-2.5 sm:py-3 shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex items-center gap-3 sm:gap-5 z-40 max-w-[95vw] transition-all`}>
              <div className="flex items-center gap-2 overflow-x-auto max-w-[180px] sm:max-w-[320px] py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {photos.length === 0 ? (
                  <span className="text-xs text-white/40 italic font-sans px-2">No snapshots</span>
                ) : (
                  photos.map((src, i) => (
                    <div key={i} className="relative group w-10 h-10 sm:w-12 sm:h-12 rounded-[8px] overflow-hidden border border-white/20 flex-shrink-0 shadow-md">
                      <img src={src} alt="Snapshot" className="w-full h-full object-cover" />
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity">
                        <a
                          href={src}
                          download={`fazzyu-creations-photobooth-${i + 1}.png`}
                          className="text-white hover:text-[#ca498c] transition-colors"
                          title="Download photo"
                        >
                          <Download className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => handleDeletePhoto(i)}
                          className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="w-[1px] h-8 bg-white/20"></div>

              <button
                onClick={handleCapture}
                aria-label="Take picture"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#ca498c] hover:bg-[#b83d7a] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-[0_0_25px_rgba(209,126,165,0.6)] cursor-pointer flex-shrink-0"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/80 flex items-center justify-center">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
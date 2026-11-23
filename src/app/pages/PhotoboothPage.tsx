import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  Download,
  Trash2,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Eye,
  QrCode,
  Upload,
  RotateCcw,
  KeyRound,
} from "lucide-react";
import { Rnd } from "react-rnd";
import jsQR from "jsqr";
import { toast } from "sonner";
import { useAppData } from "@/app/context/AppDataContext";
import {
  PHOTOBOOTH_PRESETS,
  getPresetById,
  decodePhotoboothQR,
  encodePhotoboothCode,
  type PhotoboothQRPayload,
} from "@/app/utils/photoboothThemes";

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
  const { logPhotoboothActivity } = useAppData();

  const [hasPermission, setHasPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Custom Photobooth Theme (loaded via QR Scanner or Pasted Code)
  const [customTheme, setCustomTheme] = useState<PhotoboothQRPayload | null>(null);

  // QR Scanner & Paste Code Modal State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [pastedCode, setPastedCode] = useState("");
  const scannerVideoRef = useRef<HTMLVideoElement>(null);
  const qrFileInputRef = useRef<HTMLInputElement>(null);

  // Lightbox Preview Modal State
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const clockWidgetRef = useRef<HTMLDivElement>(null);
  const flowerWidgetRef = useRef<HTMLDivElement>(null);
  const flowerImgRef = useRef<HTMLImageElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const activePreset = getPresetById(customTheme?.presetId ?? PHOTOBOOTH_PRESETS[0].id);

  async function handleStartPhotobooth() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false,
      });
      setStream(mediaStream);
      setHasPermission(true);
      logPhotoboothActivity();
      toast.success("Camera connected securely.");
    } catch (err) {
      console.error(err);
      toast.error("Camera access denied or unavailable.");
    }
  }

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

  // Apply decoded QR or pasted code payload to the Photobooth
  const applyScannedTheme = useCallback(
    (payload: PhotoboothQRPayload) => {
      const preset = getPresetById(payload.presetId);
      setCustomTheme(payload);
      setPastedCode("");
      setIsScannerOpen(false);
      logPhotoboothActivity(encodePhotoboothCode(payload));

      if (payload.autoStickers) {
        const vw = typeof window !== "undefined" ? window.innerWidth : 1000;
        const vh = typeof window !== "undefined" ? window.innerHeight - 72 : 800;
        const now = Date.now();

        const themedStickers: Sticker[] = [
          {
            id: `stk-qr-1-${now}`,
            type: "emoji",
            content: preset.stickers[0] ?? "🌸",
            x: Math.max(20, vw * 0.16),
            y: Math.max(24, vh * 0.14),
            width: 72,
            height: 72,
          },
          {
            id: `stk-qr-2-${now}`,
            type: "emoji",
            content: preset.stickers[1] ?? "✨",
            x: Math.min(vw - 96, vw * 0.72),
            y: Math.max(24, vh * 0.14),
            width: 72,
            height: 72,
          },
          {
            id: `stk-qr-3-${now}`,
            type: "badge",
            content: preset.defaultBadge,
            x: Math.max(20, Math.min(vw - 200, vw * 0.65)),
            y: Math.max(100, Math.min(vh - 210, vh * 0.64)),
            width: 180,
            height: 44,
          },
        ];
        setStickers(themedStickers);
      }

      toast.success(`Custom Photobooth activated: ${preset.name}!`);
    },
    [logPhotoboothActivity]
  );

  function handleApplyPastedCode() {
    if (!pastedCode.trim()) {
      toast.error("Please paste a photobooth code first.");
      return;
    }
    const decoded = decodePhotoboothQR(pastedCode);
    if (!decoded) {
      toast.error("Invalid photobooth code. Please check and try again.");
      return;
    }
    applyScannedTheme(decoded);
  }

  // Live Camera QR Scanning Loop when Scanner Modal is Open
  useEffect(() => {
    if (!isScannerOpen) return;

    let activeStream: MediaStream | null = stream;
    let ownsStream = false;
    let animFrameId = 0;
    const scanCanvas = document.createElement("canvas");
    const scanCtx = scanCanvas.getContext("2d", { willReadFrequently: true });

    async function setupScanner() {
      try {
        if (!activeStream) {
          activeStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false,
          });
          ownsStream = true;
        }
        if (scannerVideoRef.current && activeStream) {
          scannerVideoRef.current.srcObject = activeStream;
          await scannerVideoRef.current.play().catch(() => {});
        }
        tickScan();
      } catch {
        // User can still paste code or upload QR image if camera is unavailable
      }
    }

    function tickScan() {
      const vid = scannerVideoRef.current;
      if (vid && vid.readyState === vid.HAVE_ENOUGH_DATA && scanCtx) {
        const targetWidth = Math.min(640, vid.videoWidth);
        const scaleRatio = targetWidth / vid.videoWidth;
        scanCanvas.width = targetWidth;
        scanCanvas.height = Math.floor(vid.videoHeight * scaleRatio);

        scanCtx.drawImage(vid, 0, 0, scanCanvas.width, scanCanvas.height);
        const imgData = scanCtx.getImageData(0, 0, scanCanvas.width, scanCanvas.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height, {
          inversionAttempts: "attemptBoth",
        });

        if (code && code.data) {
          const decoded = decodePhotoboothQR(code.data);
          if (decoded) {
            applyScannedTheme(decoded);
            return;
          }
        }
      }
      animFrameId = requestAnimationFrame(tickScan);
    }

    setupScanner();

    return () => {
      cancelAnimationFrame(animFrameId);
      if (ownsStream && activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isScannerOpen, stream, applyScannedTheme]);

  // Decode QR from Uploaded PNG/JPG File
  function handleQrImageUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height, {
          inversionAttempts: "attemptBoth",
        });

        if (!code || !code.data) {
          toast.error("No QR code detected in that image.");
          return;
        }

        const decoded = decodePhotoboothQR(code.data);
        if (!decoded) {
          toast.error("Invalid QR code. Please upload a Fazzyu Photobooth QR.");
          return;
        }

        applyScannedTheme(decoded);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    if (qrFileInputRef.current) qrFileInputRef.current.value = "";
  }

  const timeString = currentTime.toLocaleTimeString("en-US", {
    timeZone: "Asia/Manila",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const dateString = currentTime.toLocaleDateString("en-US", {
    timeZone: "Asia/Manila",
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // High-Resolution Full-Screen Canvas Composer
  function handleCapture() {
    if (!videoRef.current || !containerRef.current) return;

    try {
      const video = videoRef.current;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      const canvas = document.createElement("canvas");
      const scale = 2;
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;
      ctx.scale(scale, scale);

      // 1. Ambient Background Gradient
      const gradient = ctx.createRadialGradient(
        rect.width / 2,
        rect.height / 2,
        10,
        rect.width / 2,
        rect.height / 2,
        Math.max(rect.width, rect.height)
      );
      gradient.addColorStop(0, activePreset.glowInner);
      gradient.addColorStop(1, activePreset.glowOuter);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // 2. Custom QR/Code Theme Frame Border
      if (customTheme) {
        ctx.save();
        ctx.strokeStyle = activePreset.accentHex;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(12, 12, rect.width - 24, rect.height - 24, 24);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Desktop Clock & Date Widget
      if (!isFullscreen && clockWidgetRef.current) {
        const cRect = clockWidgetRef.current.getBoundingClientRect();
        if (cRect.width > 0 && cRect.height > 0) {
          const cx = cRect.left - rect.left;
          const cy = cRect.top - rect.top;

          ctx.save();
          ctx.fillStyle = "rgba(42, 30, 35, 0.85)";
          ctx.strokeStyle = customTheme ? activePreset.accentHex : "rgba(255, 255, 255, 0.1)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(cx, cy, cRect.width, cRect.height, 20);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = activePreset.accentLightHex;
          ctx.font = "bold 36px Georgia, serif";
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.fillText(timeString, cx + 16, cy + 16);

          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.font = "500 12px sans-serif";
          ctx.fillText(`${dateString}, Makati City`, cx + 16, cy + 60);
          ctx.restore();
        }
      }

      // 4. Desktop Aesthetic Flower Widget
      if (!isFullscreen && flowerWidgetRef.current && flowerImgRef.current) {
        const fRect = flowerWidgetRef.current.getBoundingClientRect();
        if (fRect.width > 0 && fRect.height > 0) {
          const fx = fRect.left - rect.left;
          const fy = fRect.top - rect.top;

          ctx.save();
          ctx.beginPath();
          ctx.roundRect(fx, fy, fRect.width, fRect.height, 20);
          ctx.clip();
          ctx.drawImage(flowerImgRef.current, fx, fy, fRect.width, fRect.height);
          ctx.restore();

          ctx.save();
          ctx.strokeStyle = customTheme ? activePreset.accentHex : "rgba(255, 255, 255, 0.1)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(fx, fy, fRect.width, fRect.height, 20);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 5. Camera Window
      if (isFullscreen) {
        ctx.save();
        ctx.translate(rect.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, rect.width, rect.height);
        ctx.restore();
      } else if (windowRef.current) {
        const winRect = windowRef.current.getBoundingClientRect();
        const relWinX = winRect.left - rect.left;
        const relWinY = winRect.top - rect.top;

        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 30;
        ctx.fillStyle = activePreset.windowBgHex;
        ctx.strokeStyle = customTheme ? activePreset.accentHex : "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = customTheme ? 2 : 1;

        ctx.beginPath();
        ctx.roundRect(relWinX, relWinY, winRect.width, winRect.height, 16);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        const titleBarHeight = 40;
        ctx.fillStyle = activePreset.titleBarHex;
        ctx.beginPath();
        ctx.roundRect(relWinX, relWinY, winRect.width, titleBarHeight, [16, 16, 0, 0]);
        ctx.fill();

        const dotY = relWinY + 20;
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(relWinX + 20, dotY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#eab308";
        ctx.beginPath();
        ctx.arc(relWinX + 40, dotY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.arc(relWinX + 60, dotY, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = customTheme ? activePreset.accentLightHex : "rgba(255, 255, 255, 0.6)";
        ctx.font = "600 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const windowTitle = customTheme ? `Photo Booth — ${activePreset.name}` : "Photo Booth";
        ctx.fillText(windowTitle, relWinX + winRect.width / 2, dotY);

        const videoBoxX = relWinX;
        const videoBoxY = relWinY + titleBarHeight;
        const videoBoxWidth = winRect.width;
        const videoBoxHeight = winRect.height - titleBarHeight;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(videoBoxX, videoBoxY, videoBoxWidth, videoBoxHeight, [0, 0, 16, 16]);
        ctx.clip();

        ctx.translate(videoBoxX + videoBoxWidth, videoBoxY);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, videoBoxWidth, videoBoxHeight);
        ctx.restore();
      }

      // 6. Custom Dedication Banner
      if (customTheme && bannerRef.current) {
        const bRect = bannerRef.current.getBoundingClientRect();
        if (bRect.width > 0 && bRect.height > 0) {
          const bx = bRect.left - rect.left;
          const by = bRect.top - rect.top;

          ctx.save();
          ctx.fillStyle = activePreset.windowBgHex;
          ctx.strokeStyle = activePreset.accentHex;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(bx, by, bRect.width, bRect.height, 16);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = activePreset.accentLightHex;
          ctx.font = "bold 17px Georgia, serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const titleY = customTheme.subtitle ? by + bRect.height * 0.38 : by + bRect.height * 0.5;
          ctx.fillText(customTheme.title || activePreset.name, bx + bRect.width / 2, titleY);

          if (customTheme.subtitle) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.font = "11px sans-serif";
            ctx.fillText(customTheme.subtitle, bx + bRect.width / 2, by + bRect.height * 0.72);
          }
          ctx.restore();
        }
      }

      // 7. Stickers & Badges
      stickers.forEach((stk) => {
        const stickerEl = document.getElementById(stk.id);
        if (stickerEl) {
          const sRect = stickerEl.getBoundingClientRect();
          const sX = sRect.left - rect.left;
          const sY = sRect.top - rect.top;

          ctx.save();
          if (stk.type === "badge") {
            ctx.fillStyle = activePreset.windowBgHex;
            ctx.strokeStyle = activePreset.accentHex;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(sX, sY, sRect.width, sRect.height, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.font = "600 12px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(stk.content, sX + sRect.width / 2, sY + sRect.height / 2);
          } else {
            ctx.font = `${sRect.height * 0.75}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(stk.content, sX + sRect.width / 2, sY + sRect.height / 2);
          }
          ctx.restore();
        }
      });

      const flash = document.createElement("div");
      flash.className =
        "fixed inset-0 bg-white z-[9999] opacity-0 pointer-events-none transition-opacity duration-75";
      document.body.appendChild(flash);
      setTimeout(() => (flash.style.opacity = "1"), 0);
      setTimeout(() => {
        flash.style.opacity = "0";
        setTimeout(() => document.body.removeChild(flash), 100);
      }, 75);

      const dataUrl = canvas.toDataURL("image/png");
      setPhotos((prev) => [dataUrl, ...prev]);
      toast.success("HD Composition captured successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to capture photo composition.");
    }
  }

  function handleAddSticker(content: string, type: "text" | "emoji" | "badge") {
    const w = type === "badge" ? 175 : 84;
    const h = type === "badge" ? 48 : 84;
    const maxX = Math.max(16, window.innerWidth - w - 16);
    const maxY = Math.max(16, window.innerHeight - h - 180);

    const newSticker: Sticker = {
      id: `stk-${Date.now()}`,
      type,
      content,
      x: Math.min(Math.max(16, window.innerWidth / 2 - w / 2), maxX),
      y: Math.min(Math.max(16, window.innerHeight / 2 - h / 2), maxY),
      width: w,
      height: h,
    };
    setStickers((prev) => [...prev, newSticker]);
  }

  function handleDeletePhoto(indexToDelete: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== indexToDelete));
    toast.success("Photo removed from filmstrip.");
  }

  const isClient = typeof window !== "undefined";
  const vw = isClient ? window.innerWidth : 1000;
  const vh = isClient ? window.innerHeight - 72 : 800;
  const isMobileView = vw < 1024;

  const topSafe = customTheme ? (isMobileView ? 88 : 96) : 16;
  const bottomSafe = isMobileView ? 168 : 110;
  const availableHeight = Math.max(250, vh - topSafe - bottomSafe);

  const initialWidth = Math.min(vw * 0.92, 720);
  const initialHeight = isMobileView
    ? Math.min(availableHeight, 440)
    : Math.min(vh * 0.56, 510);
  const initialX = Math.max(0, (vw - initialWidth) / 2);
  const initialY = isMobileView
    ? topSafe + Math.max(0, (availableHeight - initialHeight) / 2)
    : Math.max(topSafe, (vh - initialHeight) / 2 - 20);

  return (
    <div
      ref={containerRef}
      className="bg-[#1E1518] min-h-[calc(100vh-72px)] min-h-[calc(100dvh-72px)] overflow-hidden relative font-sans text-white select-none flex flex-col"
    >
      {/* Magic Board Ambient Background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-85 transition-all duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activePreset.glowInner} 0%, ${activePreset.glowOuter} 100%)`,
        }}
      />

      {/* Custom QR/Code Theme Screen Frame Border */}
      {customTheme && (
        <div
          className="absolute inset-2 sm:inset-3 rounded-[20px] sm:rounded-[24px] pointer-events-none z-10 transition-all duration-500"
          style={{
            border: `2px solid ${activePreset.accentHex}`,
            boxShadow: `inset 0 0 40px ${activePreset.glowInner}`,
          }}
        />
      )}

      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden">
        {!hasPermission ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#140e11] border border-white/25 rounded-[20px] p-6 sm:p-10 max-w-md w-full text-center shadow-[0_10px_40px_rgba(209,126,165,0.2)] mx-auto"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#ca498c]/20 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
              <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-[#ca498c]" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl mb-2.5 sm:mb-3">Magic Photobooth</h1>
            <p className="text-white/70 text-xs sm:text-sm mb-6 leading-relaxed font-sans">
              We need access to your camera to start the photobooth. All photos stay securely on your device and are never uploaded to any server.
            </p>

            {customTheme && (
              <div
                className="mb-5 px-4 py-2.5 rounded-[12px] text-xs font-medium border break-words"
                style={{
                  backgroundColor: activePreset.windowBgHex,
                  borderColor: activePreset.accentHex,
                  color: activePreset.accentLightHex,
                }}
              >
                Custom Theme Ready: <strong>{activePreset.name}</strong>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleStartPhotobooth}
                className="bg-[#ca498c] hover:bg-[#b83d7a] text-white font-medium px-6 sm:px-8 py-3 rounded-full transition-colors w-full cursor-pointer shadow-[0_4px_20px_rgba(209,126,165,0.4)] text-sm"
              >
                Allow Camera Access
              </button>
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-5 sm:px-6 py-2.5 rounded-full transition-colors w-full cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <QrCode className="w-4 h-4 text-[#ca498c] flex-shrink-0" /> Scan QR / Enter Photobooth Code
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="relative w-full h-full flex-1 flex flex-col">
            {/* ── Custom Theme Dedication Banner ── */}
            <AnimatePresence>
              {customTheme && (
                <motion.div
                  ref={bannerRef}
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="mx-auto mt-0.5 sm:mt-1 mb-2 z-40 px-4 sm:px-6 py-2 sm:py-2.5 rounded-[16px] backdrop-blur-md text-center shadow-xl max-w-[92vw] sm:max-w-md"
                  style={{
                    backgroundColor: activePreset.windowBgHex,
                    border: `1.5px solid ${activePreset.accentHex}`,
                  }}
                >
                  <p
                    className="font-serif text-sm sm:text-lg font-bold leading-tight break-words"
                    style={{ color: activePreset.accentLightHex }}
                  >
                    {customTheme.title || activePreset.name}
                  </p>
                  {customTheme.subtitle && (
                    <p className="font-sans text-[11px] text-white/80 mt-0.5 break-words">
                      {customTheme.subtitle}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── macOS Desktop Widgets ── */}
            {!isFullscreen && (
              <div className="absolute left-4 top-4 hidden lg:flex flex-col gap-4 z-10 pointer-events-none select-none">
                <div
                  ref={clockWidgetRef}
                  className="w-[260px] bg-[#2a1e23]/80 backdrop-blur-md border rounded-[20px] p-4 shadow-2xl flex flex-col justify-center transition-colors"
                  style={{
                    borderColor: customTheme ? activePreset.accentHex : "rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className="font-serif text-[36px] font-bold leading-none tracking-tight transition-colors"
                    style={{ color: activePreset.accentLightHex }}
                  >
                    {timeString}
                  </div>
                  <div className="font-sans text-xs text-white/70 mt-2 font-medium tracking-wide">
                    {dateString}, Makati City
                  </div>
                </div>

                <div
                  ref={flowerWidgetRef}
                  className="w-[260px] h-[170px] rounded-[20px] overflow-hidden border shadow-2xl transition-colors"
                  style={{
                    borderColor: customTheme ? activePreset.accentHex : "rgba(255,255,255,0.1)",
                  }}
                >
                  <img
                    ref={flowerImgRef}
                    src={imgWidgetFlower}
                    alt="Custom aesthetic flower"
                    className="w-full h-full object-cover filter brightness-95"
                  />
                </div>
              </div>
            )}

            {/* ── Magic Board & Scan QR / Enter Code Toggle Buttons ── */}
            <div
              className={`absolute left-3 right-3 sm:left-4 sm:right-auto z-40 flex flex-wrap items-center justify-center sm:justify-start gap-2 transition-all ${
                isFullscreen ? "bottom-20 sm:bottom-24 lg:bottom-6" : "bottom-[92px] sm:bottom-28 lg:bottom-6"
              }`}
            >
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 bg-[#140e11]/90 hover:bg-[#1a1116] border border-[#ca498c]/50 rounded-full shadow-[0_4px_20px_rgba(209,126,165,0.3)] transition-all cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-[#ca498c] animate-pulse flex-shrink-0" />
                <span className="font-sans text-xs sm:text-sm font-medium text-white">Magic Board</span>
              </button>

              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 bg-[#140e11]/90 hover:bg-[#1a1116] border border-white/25 hover:border-[#ca498c] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#E8A0BE] flex-shrink-0" />
                <span className="font-sans text-xs sm:text-sm font-medium text-white">
                  Scan QR / Code
                </span>
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
                  className={`absolute left-3 right-3 sm:right-auto sm:left-4 w-auto sm:w-[260px] bg-[#140e11]/95 backdrop-blur-md border border-white/20 rounded-[16px] p-4 flex flex-col gap-3 z-50 shadow-2xl ${
                    isFullscreen ? "bottom-32 sm:bottom-36 lg:bottom-20" : "bottom-[146px] sm:bottom-[164px] lg:bottom-20"
                  }`}
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
                    <span className="text-[10px] uppercase tracking-wider text-[#ca498c] font-bold">
                      Decorations
                    </span>
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
                    <span className="text-[10px] uppercase tracking-wider text-[#ca498c] font-bold">
                      Badges
                    </span>
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

                  {customTheme && (
                    <button
                      onClick={() => {
                        setCustomTheme(null);
                        toast.info("Reset to default Fazzyu Photobooth theme.");
                      }}
                      className="text-xs text-[#E8A0BE] hover:text-white pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Custom Theme
                    </button>
                  )}

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
                className="flex items-center justify-center z-50 cursor-grab active:cursor-grabbing"
              >
                <div
                  id={stk.id}
                  onDoubleClick={() => setStickers((prev) => prev.filter((s) => s.id !== stk.id))}
                  title="Double-click to delete"
                  className={`relative w-full h-full flex items-center justify-center select-none ${
                    stk.type === "badge"
                      ? "bg-[#140e11]/95 border rounded-[10px] px-3 shadow-lg text-xs font-medium text-white w-full h-full"
                      : "text-4xl sm:text-5xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] w-full h-full flex items-center justify-center"
                  }`}
                  style={
                    stk.type === "badge"
                      ? {
                          backgroundColor: activePreset.windowBgHex,
                          borderColor: activePreset.accentHex,
                        }
                      : undefined
                  }
                >
                  {stk.content}
                </div>
              </Rnd>
            ))}

            {/* ── Responsive Camera Window ── */}
            {isFullscreen ? (
              <div
                className="fixed inset-0 w-screen h-[100dvh] bg-black z-30 flex flex-col"
                onDoubleClick={() => setIsFullscreen(false)}
              >
                <div className="relative flex-1 w-full h-full overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                  />
                </div>
                <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white/70 text-xs tracking-wider flex items-center gap-2 pointer-events-none z-40 whitespace-nowrap">
                  <Minimize2 className="w-3 h-3" /> Double-click anywhere to exit fullscreen
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 pointer-events-none z-20">
                <Rnd
                  default={{
                    x: initialX,
                    y: initialY,
                    width: initialWidth,
                    height: initialHeight,
                  }}
                  minWidth={280}
                  minHeight={240}
                  bounds="parent"
                  dragHandleClassName="macos-window-header"
                  className="rounded-[16px] shadow-[0_25px_60px_rgba(0,0,0,0.8)] pointer-events-auto absolute transition-colors"
                  style={{
                    backgroundColor: activePreset.windowBgHex,
                    border: `1.5px solid ${
                      customTheme ? activePreset.accentHex : "rgba(255,255,255,0.2)"
                    }`,
                  }}
                >
                  <div
                    ref={windowRef}
                    className="flex flex-col w-full h-full rounded-[16px] overflow-hidden group"
                  >
                    <div
                      className="macos-window-header h-10 border-b border-white/10 flex items-center justify-between px-3 sm:px-4 cursor-move flex-shrink-0 touch-none transition-colors"
                      style={{ backgroundColor: activePreset.titleBarHex }}
                    >
                      <div className="flex items-center gap-2 flex-shrink-0">
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
                      <span
                        className="text-[11px] sm:text-xs font-medium tracking-wider text-center flex-1 pointer-events-none truncate px-2 min-w-0"
                        style={{
                          color: customTheme
                            ? activePreset.accentLightHex
                            : "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {customTheme ? `Photo Booth — ${activePreset.name}` : "Photo Booth"}
                      </span>
                      <div className="w-6 sm:w-10 flex-shrink-0"></div>
                    </div>

                    <div
                      className="relative flex-1 w-full h-full bg-black overflow-hidden flex items-center justify-center cursor-pointer"
                      onDoubleClick={() => setIsFullscreen(true)}
                    >
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                      />

                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/50 backdrop-blur-sm p-4 rounded-full">
                          <Maximize2 className="w-8 h-8 text-white/70" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Rnd>
              </div>
            )}

            {/* ── Floating Bottom Shutter & Filmstrip Control Deck ── */}
            <div className="absolute left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-6 bottom-3 sm:bottom-4 lg:bottom-6 bg-[#140e11]/90 backdrop-blur-md border border-white/20 rounded-[20px] px-3 sm:px-5 py-2 sm:py-3 shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex items-center gap-3 sm:gap-5 z-40 max-w-[calc(100vw-24px)] transition-all duration-300">
              <div className="flex items-center gap-2 overflow-x-auto max-w-[165px] sm:max-w-[320px] py-1 min-w-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {photos.length === 0 ? (
                  <span className="text-xs text-white/40 italic font-sans px-2 whitespace-nowrap">No snapshots</span>
                ) : (
                  photos.map((src, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedPhoto(src)}
                      className="relative group w-10 h-10 sm:w-12 sm:h-12 rounded-[8px] overflow-hidden border border-white/20 flex-shrink-0 shadow-md cursor-pointer hover:border-[#ca498c] transition-all"
                      title="Click to preview"
                    >
                      <img src={src} alt="Snapshot" className="w-full h-full object-cover" />

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="w-[1px] h-8 bg-white/20 flex-shrink-0"></div>

              <button
                onClick={handleCapture}
                aria-label="Take picture"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#ca498c] hover:bg-[#b83d7a] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-[0_0_25px_rgba(209,126,165,0.6)] cursor-pointer flex-shrink-0"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/80 flex items-center justify-center pointer-events-none">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </button>
            </div>

            {/* ── Lightbox Preview Modal ── */}
            <AnimatePresence>
              {selectedPhoto && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                  onClick={() => setSelectedPhoto(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#140e11] border border-white/20 rounded-[24px] p-4 sm:p-6 max-w-3xl w-full shadow-2xl flex flex-col gap-4 max-h-[90dvh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="font-serif text-base sm:text-lg text-white font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#ca498c]" /> Snapshot Preview
                      </h3>
                      <button
                        onClick={() => setSelectedPhoto(null)}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-hidden rounded-[16px] border border-white/10 bg-black flex items-center justify-center">
                      <img
                        src={selectedPhoto}
                        alt="Preview Composition"
                        className="max-h-[55vh] sm:max-h-[60vh] w-auto object-contain rounded-[12px]"
                      />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-2">
                      <button
                        onClick={() => {
                          const idx = photos.indexOf(selectedPhoto);
                          if (idx !== -1) handleDeletePhoto(idx);
                          setSelectedPhoto(null);
                        }}
                        className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-full text-xs text-red-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Photo
                      </button>

                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <button
                          onClick={() => setSelectedPhoto(null)}
                          className="px-4 sm:px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full text-xs text-white font-medium transition-colors cursor-pointer"
                        >
                          Close
                        </button>

                        <a
                          href={selectedPhoto}
                          download="fazzyu-creations-photobooth.png"
                          className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 bg-[#ca498c] hover:bg-[#b83d7a] rounded-full text-xs text-white font-medium flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" /> Download Photo
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Scan QR / Paste Code Modal ── */}
      <AnimatePresence>
        {isScannerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsScannerOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 18 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#140e11] border border-[#ca498c]/50 rounded-[24px] p-4 sm:p-6 max-w-md w-full shadow-[0_20px_60px_rgba(202,73,140,0.3)] flex flex-col gap-4 max-h-[92dvh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif text-base sm:text-lg text-white font-bold flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#ca498c]" /> Load Custom Photobooth
                </h3>
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Paste Alternative Code Input (No 2nd Device Needed) */}
              <div className="bg-black/40 border border-[#ca498c]/35 rounded-[16px] p-3.5 space-y-2.5 min-w-0">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#E8A0BE]">
                  <KeyRound className="w-3.5 h-3.5 text-[#ca498c] flex-shrink-0" /> Paste Photobooth Code
                </label>
                <div className="flex items-center gap-2 min-w-0">
                  <input
                    type="text"
                    value={pastedCode}
                    onChange={(e) => setPastedCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyPastedCode();
                      }
                    }}
                    placeholder="Paste code (e.g. FAZZYU-...)"
                    className="flex-1 min-w-0 h-10 bg-black/60 border border-white/20 rounded-[10px] px-3 text-xs font-mono text-white outline-none focus:border-[#ca498c]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPastedCode}
                    className="px-4 h-10 rounded-[10px] bg-[#ca498c] hover:bg-[#b83d7a] text-white text-xs font-semibold cursor-pointer transition-colors flex-shrink-0"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/40">
                <div className="h-[1px] flex-1 bg-white/10" />
                <span>or scan / upload QR</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              {/* Live Camera Viewfinder */}
              <div className="relative rounded-[16px] overflow-hidden border border-white/20 bg-black aspect-square max-h-[200px] sm:max-h-[220px] mx-auto w-full flex items-center justify-center">
                <video
                  ref={scannerVideoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute inset-6 border-2 border-[#ca498c] rounded-[16px] pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
                <span className="absolute bottom-2.5 px-3 py-1 rounded-full bg-black/70 text-[11px] text-[#E8A0BE]">
                  Scanning for QR code...
                </span>
              </div>

              {/* Upload QR Image Fallback */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-3 pt-1">
                <input
                  ref={qrFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleQrImageUpload(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => qrFileInputRef.current?.click()}
                  className="flex-1 min-w-0 py-2.5 px-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 text-[#ca498c] flex-shrink-0" /> Upload QR Image
                </button>
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(false)}
                  className="py-2.5 px-4 rounded-full bg-white/5 hover:bg-white/15 text-white/80 text-xs font-medium cursor-pointer transition-colors flex-shrink-0"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
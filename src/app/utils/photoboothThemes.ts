export type PhotoboothPreset = {
  id: string;
  name: string;
  description: string;
  previewGradient: string;
  glowInner: string;
  glowOuter: string;
  accentHex: string;
  accentLightHex: string;
  windowBgHex: string;
  titleBarHex: string;
  stickers: string[];
  defaultBadge: string;
};

export type PhotoboothQRPayload = {
  v: 1;
  app: "fazzyu-pb";
  presetId: string;
  title: string;
  subtitle?: string;
  autoStickers: boolean;
};

export const PHOTOBOOTH_PRESETS: PhotoboothPreset[] = [
  {
    id: "fazzyu-signature",
    name: "Yuri's Signature Rose",
    description: "Deep rose-plum glow with pink sparkles and floral badges",
    previewGradient: "radial-gradient(circle at 50% 50%, #ca498c 0%, #1E1518 100%)",
    glowInner: "rgba(212, 106, 147, 0.30)",
    glowOuter: "rgba(30, 21, 24, 1)",
    accentHex: "#ca498c",
    accentLightHex: "#E8A0BE",
    windowBgHex: "#140e11",
    titleBarHex: "#1e1418",
    stickers: ["🌸", "🎀", "✨", "💖"],
    defaultBadge: "Yuri's Craft 🌸",
  },
  {
    id: "rapunzel-dream",
    name: "Rapunzel Lantern Glow",
    description: "Royal lavender & golden lantern aura inspired by Tangled",
    previewGradient: "radial-gradient(circle at 50% 50%, #9333ea 0%, #1b1126 100%)",
    glowInner: "rgba(168, 85, 247, 0.32)",
    glowOuter: "rgba(24, 15, 36, 1)",
    accentHex: "#a855f7",
    accentLightHex: "#f3e8ff",
    windowBgHex: "#150e20",
    titleBarHex: "#211533",
    stickers: ["👑", "✨", "💜", "🌸"],
    defaultBadge: "Floating Lanterns ✨",
  },
  {
    id: "sunflower-sunshine",
    name: "Golden Sunflower",
    description: "Warm amber & honey-gold frame with cheerful butterflies",
    previewGradient: "radial-gradient(circle at 50% 50%, #d97706 0%, #1f1710 100%)",
    glowInner: "rgba(245, 158, 11, 0.30)",
    glowOuter: "rgba(28, 20, 13, 1)",
    accentHex: "#f59e0b",
    accentLightHex: "#fde68a",
    windowBgHex: "#18120c",
    titleBarHex: "#261c12",
    stickers: ["🌻", "💛", "🦋", "✨"],
    defaultBadge: "Golden Bloom 🌻",
  },
  {
    id: "pastel-tulip",
    name: "Pastel Tulip Garden",
    description: "Soft blush sakura pink with plushie & ribbon accents",
    previewGradient: "radial-gradient(circle at 50% 50%, #f472b6 0%, #24141d 100%)",
    glowInner: "rgba(244, 114, 182, 0.32)",
    glowOuter: "rgba(33, 18, 26, 1)",
    accentHex: "#f472b6",
    accentLightHex: "#fbcfe8",
    windowBgHex: "#1b1016",
    titleBarHex: "#291721",
    stickers: ["🌷", "🧸", "🎀", "💖"],
    defaultBadge: "Spring Tulips 🌷",
  },
  {
    id: "midnight-velvet",
    name: "Starlight Sapphire",
    description: "Deep midnight blue velvet with silver stars & butterflies",
    previewGradient: "radial-gradient(circle at 50% 50%, #2563eb 0%, #0f1629 100%)",
    glowInner: "rgba(59, 130, 246, 0.30)",
    glowOuter: "rgba(15, 22, 41, 1)",
    accentHex: "#3b82f6",
    accentLightHex: "#bfdbfe",
    windowBgHex: "#0d1324",
    titleBarHex: "#151f38",
    stickers: ["💙", "⭐", "🦋", "✨"],
    defaultBadge: "Starlight Edition ⭐",
  },
];

export function getPresetById(id: string): PhotoboothPreset {
  return PHOTOBOOTH_PRESETS.find((p) => p.id === id) ?? PHOTOBOOTH_PRESETS[0];
}

function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64url: string): string {
  let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) {
    b64 += "=";
  }
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Generates a compact, copy-pasteable share code (e.g. FAZZYU-eyJ...)
 */
export function encodePhotoboothCode(payload: PhotoboothQRPayload): string {
  const compact = [
    payload.presetId,
    payload.title,
    payload.subtitle ?? "",
    payload.autoStickers ? 1 : 0,
  ];
  return `FAZZYU-${toBase64Url(JSON.stringify(compact))}`;
}

export function encodePhotoboothQR(payload: PhotoboothQRPayload): string {
  return encodePhotoboothCode(payload);
}

/**
 * Decodes either a copy-pasted "FAZZYU-..." code or a legacy JSON QR payload
 */
export function decodePhotoboothQR(rawText: string): PhotoboothQRPayload | null {
  const trimmed = rawText.trim();
  if (!trimmed) return null;

  // 1. Decode compact FAZZYU-... pasteable code
  if (trimmed.toUpperCase().startsWith("FAZZYU-")) {
    try {
      const token = trimmed.slice(7).replace(/\s+/g, "");
      const decodedJson = fromBase64Url(token);
      const arr = JSON.parse(decodedJson);

      if (Array.isArray(arr) && arr.length >= 2 && typeof arr[0] === "string") {
        return {
          v: 1,
          app: "fazzyu-pb",
          presetId: arr[0],
          title: typeof arr[1] === "string" ? arr[1] : "",
          subtitle: typeof arr[2] === "string" ? arr[2] : "",
          autoStickers: Boolean(arr[3]),
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  // 2. Fallback: decode legacy JSON payload
  try {
    const parsed = JSON.parse(trimmed);
    if (
      parsed &&
      parsed.app === "fazzyu-pb" &&
      typeof parsed.presetId === "string"
    ) {
      return {
        v: 1,
        app: "fazzyu-pb",
        presetId: parsed.presetId,
        title: typeof parsed.title === "string" ? parsed.title : "",
        subtitle: typeof parsed.subtitle === "string" ? parsed.subtitle : "",
        autoStickers: Boolean(parsed.autoStickers),
      };
    }
    return null;
  } catch {
    return null;
  }
}
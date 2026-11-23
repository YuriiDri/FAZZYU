import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/app/context/AppDataContext";

const GUEST_STORAGE_KEY = "fazzyu_guest_highlights";

let currentUserId: string | null = null;
let currentIds: string[] = [];
let isInitialized = false;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function readGuestHighlights(): string[] {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function writeGuestHighlights(ids: string[]) {
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage quota errors
  }
}

async function syncHighlightsForUser(userId: string | null) {
  if (!userId) {
    currentIds = readGuestHighlights();
    notifyListeners();
    return;
  }

  const { data, error } = await supabase
    .from("customer_highlights")
    .select("product_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load user highlights:", error.message);
    return;
  }

  currentIds = (data ?? []).map((row) => String(row.product_id));
  notifyListeners();
}

function initHighlightAuthSync() {
  if (isInitialized) return;
  isInitialized = true;

  // Load initial session on app start
  supabase.auth.getSession().then(({ data }) => {
    currentUserId = data.session?.user?.id ?? null;
    syncHighlightsForUser(currentUserId);
  });

  // Automatically switch highlights when a customer logs in or logs out
  supabase.auth.onAuthStateChange((_event, session) => {
    const nextUserId = session?.user?.id ?? null;
    if (nextUserId !== currentUserId) {
      currentUserId = nextUserId;
      syncHighlightsForUser(currentUserId);
    }
  });
}

export function useHighlightedProducts() {
  const [highlightedIds, setHighlightedIds] = useState<string[]>(() => {
    if (!isInitialized) {
      currentIds = readGuestHighlights();
    }
    return currentIds;
  });

  useEffect(() => {
    initHighlightAuthSync();

    const update = () => setHighlightedIds([...currentIds]);
    listeners.add(update);
    update();

    return () => {
      listeners.delete(update);
    };
  }, []);

  const toggleHighlight = useCallback(async (id: string) => {
    const productId = String(id);
    const exists = currentIds.includes(productId);
    const previousIds = [...currentIds];
    const nextIds = exists
      ? currentIds.filter((item) => item !== productId)
      : [productId, ...currentIds];

    // Optimistic UI update
    currentIds = nextIds;
    notifyListeners();

    if (currentUserId) {
      if (exists) {
        const { error } = await supabase
          .from("customer_highlights")
          .delete()
          .eq("user_id", currentUserId)
          .eq("product_id", productId);

        if (error) {
          currentIds = previousIds;
          notifyListeners();
          toast.error("Failed to remove highlight from your account.");
        }
      } else {
        const { error } = await supabase
          .from("customer_highlights")
          .insert({ user_id: currentUserId, product_id: productId });

        if (error) {
          currentIds = previousIds;
          notifyListeners();
          toast.error("Failed to save highlight to your account.");
        }
      }
    } else {
      writeGuestHighlights(nextIds);
      if (!exists) {
        toast.info("Highlighted locally. Sign in to save this to your account!");
      }
    }
  }, []);

  const clearHighlights = useCallback(async () => {
    const previousIds = [...currentIds];

    currentIds = [];
    notifyListeners();

    if (currentUserId) {
      const { error } = await supabase
        .from("customer_highlights")
        .delete()
        .eq("user_id", currentUserId);

      if (error) {
        currentIds = previousIds;
        notifyListeners();
        toast.error("Failed to clear your highlights.");
        return;
      }

      toast.success("Cleared your highlighted bouquets.");
    } else {
      writeGuestHighlights([]);
    }
  }, []);

  const isHighlighted = useCallback(
    (id: string) => highlightedIds.includes(String(id)),
    [highlightedIds]
  );

  return {
    highlightedIds,
    isHighlighted,
    toggleHighlight,
    clearHighlights,
  };
}
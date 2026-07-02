"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ContentData } from "@/lib/types";
import { useToast } from "./Toast";

interface ContentContextValue {
  content: ContentData | null;
  loading: boolean;
  saving: boolean;
  refresh: () => Promise<void>;
  save: (data: ContentData) => Promise<boolean>;
  update: (partial: Partial<ContentData>) => Promise<boolean>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setContent(data);
    } catch {
      showToast("Failed to load content", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = async (data: ContentData) => {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) {
        showToast(result.error || "Save failed", "error");
        return false;
      }
      setContent(result.content || data);
      showToast("Saved successfully!");
      return true;
    } catch {
      showToast("Save failed", "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (partial: Partial<ContentData>) => {
    if (!content) return false;
    const updated = { ...content, ...partial };
    return save(updated);
  };

  return (
    <ContentContext.Provider value={{ content, loading, saving, refresh, save, update }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

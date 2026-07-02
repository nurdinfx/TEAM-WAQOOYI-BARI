"use client";

import { createContext, useContext } from "react";
import type { ContentData } from "@/lib/types";
import { getDefaultContent } from "@/lib/defaults";

const PublicContentContext = createContext<ContentData>(getDefaultContent());

export function PublicContentProvider({
  content,
  children,
}: {
  content: ContentData;
  children: React.ReactNode;
}) {
  return (
    <PublicContentContext.Provider value={content}>
      {children}
    </PublicContentContext.Provider>
  );
}

export function usePublicContent() {
  return useContext(PublicContentContext);
}

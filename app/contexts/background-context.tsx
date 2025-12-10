"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type BackgroundImage = "default" | "granola" | "sonder";

interface BackgroundContextType {
  activeImage: BackgroundImage;
  setActiveImage: (image: BackgroundImage) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined
);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [activeImage, setActiveImage] = useState<BackgroundImage>("default");

  return (
    <BackgroundContext.Provider value={{ activeImage, setActiveImage }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
}

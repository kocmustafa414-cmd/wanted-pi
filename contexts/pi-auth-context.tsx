"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface PiAuthContextType {
  isAuthenticated: boolean;
  authMessage: string;
  hasError: boolean;
  sdk: any | null;
  products: any[] | null;
  restoredPurchases: any[] | null;
  reinitialize: () => Promise<void>;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated] = useState(false);
  const [authMessage] = useState("Wanted hazır");
  const [hasError] = useState(false);
  const [sdk] = useState<any | null>(null);
  const [products] = useState<any[] | null>([]);
  const [restoredPurchases] = useState<any[] | null>([]);

  const reinitialize = async () => {
    console.log("Pi login manuel başlatılacak.");
  };

  const value: PiAuthContextType = {
    isAuthenticated,
    authMessage,
    hasError,
    sdk,
    products,
    restoredPurchases,
    reinitialize,
  };

  return (
    <PiAuthContext.Provider value={value}>
      {children}
    </PiAuthContext.Provider>
  );
}

export function usePiAuth() {
  const context = useContext(PiAuthContext);

  if (context === undefined) {
    throw new Error("usePiAuth must be used within a PiAuthProvider");
  }

  return context;
}

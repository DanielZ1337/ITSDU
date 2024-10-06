import React, { createContext, useContext, useState } from "react";

interface GlobalErrorBoundaryContextType {
  resetAllErrorBoundaries: () => void;
  key?: string;
}

const GlobalErrorBoundaryContext = createContext<GlobalErrorBoundaryContextType | null>(
  null,
);

export function useGlobalErrorBoundary(): GlobalErrorBoundaryContextType {
  const context = useContext(GlobalErrorBoundaryContext);
  if (!context) {
    throw new Error("useErrorBoundary must be used within an ErrorBoundaryProvider");
  }
  return context;
}

export function GlobalErrorBoundaryProvider({ children }: { children: React.ReactNode }) {
  const generateRandomKey = () => crypto.getRandomValues(new Uint32Array(1)).toString();

  const [resetKey, setResetKey] = useState<string>(generateRandomKey());

  const resetAllErrorBoundaries = () => {
    setResetKey(generateRandomKey());
  };

  const contextValue: GlobalErrorBoundaryContextType = {
    resetAllErrorBoundaries,
    key: resetKey,
  };

  return (
    <GlobalErrorBoundaryContext.Provider value={contextValue} key={resetKey}>
      {children}
    </GlobalErrorBoundaryContext.Provider>
  );
}

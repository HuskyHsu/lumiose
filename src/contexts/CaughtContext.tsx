import React, { createContext, useContext, useState, useEffect } from 'react';

interface CaughtContextType {
  caughtList: string[];
  isCaught: (link: string) => boolean;
  toggleCaught: (link: string) => void;
}

const CaughtContext = createContext<CaughtContextType | undefined>(undefined);

export function CaughtProvider({ children }: { children: React.ReactNode }) {
  const [caughtSet, setCaughtSet] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('lumiose_caught_list');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem('lumiose_caught_list', JSON.stringify(Array.from(caughtSet)));
  }, [caughtSet]);

  const isCaught = (link: string) => caughtSet.has(link);

  const toggleCaught = (link: string) => {
    setCaughtSet((prev) => {
      const next = new Set(prev);
      if (next.has(link)) {
        next.delete(link);
      } else {
        next.add(link);
      }
      return next;
    });
  };

  return (
    <CaughtContext.Provider value={{ caughtList: Array.from(caughtSet), isCaught, toggleCaught }}>
      {children}
    </CaughtContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCaught() {
  const context = useContext(CaughtContext);
  if (context === undefined) {
    throw new Error('useCaught must be used within a CaughtProvider');
  }
  return context;
}

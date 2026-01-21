import React, { createContext, useContext, useEffect, useState } from 'react';

import { fetchMoveList } from '@/services/pokemonService';
import type { MoveList } from '@/types/move';

interface MoveContextType {
  moveList: MoveList;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const MoveContext = createContext<MoveContextType | undefined>(undefined);

interface MoveProviderProps {
  children: React.ReactNode;
}

export function MoveProvider({ children }: MoveProviderProps) {
  const [moveList, setMoveList] = useState<MoveList>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMoveData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMoveList();
      setMoveList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load moves');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoveData();
  }, []);

  const refetch = async () => {
    await loadMoveData();
  };

  const value: MoveContextType = {
    moveList,
    loading,
    error,
    refetch,
  };

  return <MoveContext.Provider value={value}>{children}</MoveContext.Provider>;
}

export function useMoveContext() {
  const context = useContext(MoveContext);
  if (context === undefined) {
    throw new Error('useMoveContext must be used within a MoveProvider');
  }
  return context;
}

import React, { createContext, useContext, useEffect, useState } from 'react';

import { fetchPokemonData } from '@/services/pokemonService';
import type { PokemonList } from '@/types/pokemon';

interface PokemonContextType {
  pokemonList: PokemonList;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

interface PokemonProviderProps {
  children: React.ReactNode;
}

export function PokemonProvider({ children }: PokemonProviderProps) {
  const [pokemonList, setPokemonList] = useState<PokemonList>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPokemonData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPokemonData();
      setPokemonList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading the data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPokemonData();
  }, []);

  const refetch = async () => {
    await loadPokemonData();
  };

  const value: PokemonContextType = {
    pokemonList,
    loading,
    error,
    refetch,
  };

  return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>;
}

export function usePokemonContext() {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemonContext must be used within a PokemonProvider');
  }
  return context;
}

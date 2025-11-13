import { useEffect, useState } from 'react';

import { fetchPokemonData } from '@/services/pokemonService';
import type { PokemonList } from '@/types/pokemon';

interface UsePokemonDataReturn {
  pokemonList: PokemonList;
  loading: boolean;
  error: string | null;
}

export function usePokemonData(): UsePokemonDataReturn {
  const [pokemonList, setPokemonList] = useState<PokemonList>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    loadPokemonData();
  }, []);

  return { pokemonList, loading, error };
}

import { usePokemonContext } from '@/contexts/PokemonContext';
import type { PokemonList } from '@/types/pokemon';

interface UsePokemonDataReturn {
  pokemonList: PokemonList;
  loading: boolean;
  error: string | null;
}

export function usePokemonData(): UsePokemonDataReturn {
  const { pokemonList, loading, error } = usePokemonContext();
  return { pokemonList, loading, error };
}

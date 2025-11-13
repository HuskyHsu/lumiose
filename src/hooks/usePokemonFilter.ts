import type { PokemonList } from '@/types/pokemon';
import { useCallback, useMemo, useState } from 'react';

export function usePokemonFilter(pokemonList: PokemonList) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Memoize the type checking function to avoid recreating it on every render
  const typeMatches = useCallback((pokemonTypes: string[], filterTypes: string[]) => {
    return filterTypes.every((selectedType) => pokemonTypes.includes(selectedType));
  }, []);

  const filteredPokemonList = useMemo(() => {
    if (selectedTypes.length === 0) {
      return pokemonList;
    }

    // Optimized filtering: early return for better performance
    const result = [];
    for (const pokemon of pokemonList) {
      if (typeMatches(pokemon.type, selectedTypes)) {
        result.push(pokemon);
      }
    }
    return result;
  }, [pokemonList, selectedTypes, typeMatches]);

  // Memoize the setter to prevent unnecessary re-renders
  const memoizedSetSelectedTypes = useCallback((types: string[]) => {
    setSelectedTypes(types);
  }, []);

  return {
    selectedTypes,
    setSelectedTypes: memoizedSetSelectedTypes,
    filteredPokemonList,
  };
}

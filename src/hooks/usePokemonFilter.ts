import type { Pokemon, PokemonList } from '@/types/pokemon';
import { useCallback, useMemo, useState } from 'react';

export function usePokemonFilter(pokemonList: PokemonList) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isFinalFormOnly, setIsFinalFormOnly] = useState<boolean>(false);

  // Memoize the type checking function to avoid recreating it on every render
  const typeMatches = useCallback((pokemonTypes: string[], filterTypes: string[]) => {
    return filterTypes.every((selectedType) => pokemonTypes.includes(selectedType));
  }, []);

  // Memoize the keyword matching function
  const keywordMatches = useCallback((pokemon: Pokemon, keyword: string) => {
    if (!keyword.trim()) return true;

    const normalizedKeyword = keyword.toLowerCase().trim();

    // Search in names (zh, ja, en)
    const nameMatches =
      pokemon.name.zh.toLowerCase().includes(normalizedKeyword) ||
      pokemon.name.ja.toLowerCase().includes(normalizedKeyword) ||
      pokemon.name.en.toLowerCase().includes(normalizedKeyword);

    // Search in altForm if it exists
    const altFormMatches = pokemon.altForm?.toLowerCase().includes(normalizedKeyword) || false;

    // Search in lumioseId (convert to string for searching)
    const lumioseIdMatches = pokemon.lumioseId.toString().includes(normalizedKeyword);

    return nameMatches || altFormMatches || lumioseIdMatches;
  }, []);

  // Function to filter only final evolution forms
  const getFinalFormPokemon = useCallback((pokemonList: PokemonList) => {
    return pokemonList.filter((pokemon) => pokemon.latest);
  }, []);

  const filteredPokemonList = useMemo(() => {
    let result = pokemonList;

    // Apply final form filter first if enabled
    if (isFinalFormOnly) {
      result = getFinalFormPokemon(result);
    }

    // Apply keyword filter
    if (searchKeyword.trim()) {
      result = result.filter((pokemon) => keywordMatches(pokemon, searchKeyword));
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      result = result.filter((pokemon) => typeMatches(pokemon.type, selectedTypes));
    }

    return result;
  }, [
    pokemonList,
    selectedTypes,
    searchKeyword,
    isFinalFormOnly,
    typeMatches,
    keywordMatches,
    getFinalFormPokemon,
  ]);

  // Memoize the setters to prevent unnecessary re-renders
  const memoizedSetSelectedTypes = useCallback((types: string[]) => {
    setSelectedTypes(types);
  }, []);

  const memoizedSetSearchKeyword = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
  }, []);

  const toggleFinalFormOnly = useCallback(() => {
    setIsFinalFormOnly((prev) => !prev);
  }, []);

  return {
    selectedTypes,
    setSelectedTypes: memoizedSetSelectedTypes,
    searchKeyword,
    setSearchKeyword: memoizedSetSearchKeyword,
    isFinalFormOnly,
    toggleFinalFormOnly,
    filteredPokemonList,
  };
}

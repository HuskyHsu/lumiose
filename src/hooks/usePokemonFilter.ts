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
    // Group Pokemon by source (evolution chain)
    const sourceGroups = new Map<string, Pokemon[]>();

    pokemonList.forEach((pokemon) => {
      const source = pokemon.source;
      if (!sourceGroups.has(source)) {
        sourceGroups.set(source, []);
      }
      sourceGroups.get(source)!.push(pokemon);
    });

    // For each source group, find the Pokemon with highest pid
    const finalForms: Pokemon[] = [];

    sourceGroups.forEach((group) => {
      // Find the maximum pid in this group
      const maxPid = Math.max(...group.map((p) => p.pid));

      // Get all Pokemon with the maximum pid
      const maxPidPokemon = group.filter((p) => p.pid === maxPid);

      // Filter out MEGA forms (altForm starting with "MEGA")
      const nonMegaForms = maxPidPokemon.filter((p) => !p.altForm?.startsWith('MEGA'));

      if (nonMegaForms.length > 0) {
        // Add all non-MEGA forms with max pid
        finalForms.push(...nonMegaForms);
      } else {
        // If only MEGA forms exist, add all of them
        finalForms.push(...maxPidPokemon);
      }
    });

    return finalForms;
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

import type { Pokemon, PokemonList } from '@/types/pokemon';
import { useCallback, useMemo } from 'react';
import { useUrlParams } from './useUrlParams';

export function usePokemonFilter(pokemonList: PokemonList) {
  const { getArrayParam, getParam, getBooleanParam, setArrayParam, setParam, setBooleanParam } =
    useUrlParams();

  const selectedTypes = getArrayParam('types');
  const searchKeyword = getParam('search') || '';
  const isFinalFormOnly = getBooleanParam('finalForm', false);
  const selectedZone = getParam('zone') || '';
  const isAlphaZone = getBooleanParam('alphaZone', false);

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

  // Memoize the zone matching function
  const zoneMatches = useCallback((pokemon: Pokemon, zoneId: string, useAlphaZone: boolean) => {
    if (!zoneId.trim()) return true;

    const zoneNumber = parseInt(zoneId, 10);
    if (!useAlphaZone && isNaN(zoneNumber)) return true;

    if (useAlphaZone) {
      // Check alphaZone array
      return pokemon.alphaZone?.includes(zoneId) || false;
    } else {
      // Check regular zone array
      return pokemon.zone?.some((zone) => zone.id === zoneNumber) || false;
    }
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

    // Apply zone filter
    if (selectedZone.trim()) {
      result = result.filter((pokemon) => zoneMatches(pokemon, selectedZone, isAlphaZone));
    }

    return result;
  }, [
    pokemonList,
    selectedTypes,
    searchKeyword,
    selectedZone,
    isAlphaZone,
    isFinalFormOnly,
    typeMatches,
    keywordMatches,
    zoneMatches,
    getFinalFormPokemon,
  ]);

  // Memoize the setters to prevent unnecessary re-renders
  const memoizedSetSelectedTypes = useCallback(
    (types: string[]) => {
      setArrayParam('types', types);
    },
    [setArrayParam]
  );

  const memoizedSetSearchKeyword = useCallback(
    (keyword: string) => {
      setParam('search', keyword);
    },
    [setParam]
  );

  const memoizedSetSelectedZone = useCallback(
    (zone: string) => {
      setParam('zone', zone);
    },
    [setParam]
  );

  const toggleFinalFormOnly = useCallback(() => {
    setBooleanParam('finalForm', !isFinalFormOnly, false);
  }, [setBooleanParam, isFinalFormOnly]);

  const toggleAlphaZone = useCallback(() => {
    setBooleanParam('alphaZone', !isAlphaZone, false);
  }, [setBooleanParam, isAlphaZone]);

  return {
    selectedTypes,
    setSelectedTypes: memoizedSetSelectedTypes,
    searchKeyword,
    setSearchKeyword: memoizedSetSearchKeyword,
    selectedZone,
    setSelectedZone: memoizedSetSelectedZone,
    isFinalFormOnly,
    toggleFinalFormOnly,
    isAlphaZone,
    toggleAlphaZone,
    filteredPokemonList,
  };
}

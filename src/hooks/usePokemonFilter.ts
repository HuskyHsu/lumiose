import { EV_STATS } from '@/lib/constants/pokemon';
import type { Pokedex, Pokemon, PokemonList } from '@/types/pokemon';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUrlParams } from './useUrlParams';

export function usePokemonFilter(pokemonList: PokemonList) {
  const { getArrayParam, getParam, getBooleanParam, setArrayParam, setParam, setBooleanParam } =
    useUrlParams();

  // Get setSearchParams directly from useSearchParams for batch updates
  const [, setSearchParams] = useSearchParams();

  const selectedTypes = getArrayParam('types');
  const searchKeyword = getParam('search') || '';
  const isFinalFormOnly = getBooleanParam('finalForm', false);
  const selectedZone = getParam('zone') || '';
  const isAlphaZone = getBooleanParam('alphaZone', false);
  const selectedPokedex = (getParam('Pokedex') as Pokedex) || 'lumiose';
  const selectedEVStat = getParam('evStat') || '';
  const selectedDistortion = getParam('distortion') || '';

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

  // Memoize the pokedex matching function
  const pokedexMatches = useCallback((pokemon: Pokemon, pokedex: Pokedex) => {
    if (pokedex === 'lumiose') {
      return pokemon.lumioseId <= 232;
    } else if (pokedex === 'hyperspace') {
      return pokemon.hyperspaceId !== undefined;
    } else if (pokedex === 'national') {
      return true;
    }
    return true;
  }, []);

  // Memoize the distortion matching function
  const distortionMatches = useCallback((pokemon: Pokemon, distortionStr: string) => {
    if (!distortionStr.trim()) return true;

    const distortionNumber = parseInt(distortionStr, 10);
    if (isNaN(distortionNumber)) return true;

    return pokemon.distortions?.includes(distortionNumber) || false;
  }, []);

  // Memoize the EV matching function
  const evMatches = useCallback((pokemon: Pokemon, evStat: string) => {
    if (!evStat) return true;

    const index = EV_STATS.indexOf(evStat as (typeof EV_STATS)[number]);
    if (index === -1) return true;

    return pokemon.ev[index] > 0;
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

    // Apply Pokedex filter
    result = result.filter((pokemon) => pokedexMatches(pokemon, selectedPokedex));

    // Apply Distortion filter
    if (selectedDistortion.trim()) {
      result = result.filter((pokemon) => distortionMatches(pokemon, selectedDistortion));
    }

    // Apply EV filter
    if (selectedEVStat) {
      result = result.filter((pokemon) => evMatches(pokemon, selectedEVStat));
    }

    return result;
  }, [
    pokemonList,
    selectedTypes,
    searchKeyword,
    selectedZone,
    selectedPokedex,
    isAlphaZone,
    isFinalFormOnly,
    typeMatches,
    keywordMatches,
    zoneMatches,
    pokedexMatches,
    distortionMatches,
    selectedDistortion,
    evMatches,
    getFinalFormPokemon,
    selectedEVStat,
  ]);

  // Memoize the setters to prevent unnecessary re-renders
  const memoizedSetSelectedTypes = useCallback(
    (types: string[]) => {
      setArrayParam('types', types);
    },
    [setArrayParam],
  );

  const memoizedSetSearchKeyword = useCallback(
    (keyword: string) => {
      setParam('search', keyword);
    },
    [setParam],
  );

  const memoizedSetSelectedZone = useCallback(
    (zone: string) => {
      setParam('zone', zone);
    },
    [setParam],
  );

  const toggleFinalFormOnly = useCallback(() => {
    setBooleanParam('finalForm', !isFinalFormOnly, false);
  }, [setBooleanParam, isFinalFormOnly]);

  const toggleAlphaZone = useCallback(() => {
    setBooleanParam('alphaZone', !isAlphaZone, false);
  }, [setBooleanParam, isAlphaZone]);

  const memoizedSetSelectedPokedex = useCallback(
    (Pokedex: Pokedex) => {
      if (Pokedex === 'hyperspace' || Pokedex === 'national') {
        // Use a single setSearchParams call to update all parameters at once
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set('Pokedex', Pokedex);
          newParams.delete('zone');
          newParams.delete('alphaZone');
          return newParams;
        });
      } else {
        // Clear hyperspace specific params when switching back to lumiose
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set('Pokedex', 'lumiose');
          return newParams;
        });
      }
    },

    [setParam, setSearchParams],
  );

  const memoizedSetSelectedEVStat = useCallback(
    (evStat: string) => {
      setParam('evStat', evStat);
    },
    [setParam],
  );

  const memoizedSetSelectedDistortion = useCallback(
    (distortion: string) => {
      setParam('distortion', distortion);
    },
    [setParam],
  );

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
    selectedPokedex,
    setSelectedPokedex: memoizedSetSelectedPokedex,
    filteredPokemonList,
    selectedEVStat,
    setSelectedEVStat: memoizedSetSelectedEVStat,
    selectedDistortion,
    setSelectedDistortion: memoizedSetSelectedDistortion,
  };
}

import type { PokemonList } from '@/types/pokemon';
import { useMemo, useState } from 'react';

export function usePokemonFilter(pokemonList: PokemonList) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const filteredPokemonList = useMemo(() => {
    if (selectedTypes.length === 0) {
      // 沒有選擇任何屬性時，顯示全部
      return pokemonList;
    }

    // 篩選邏輯：Pokemon必須擁有所有選中的屬性才會被顯示
    return pokemonList.filter((pokemon) => {
      return selectedTypes.every((selectedType) => pokemon.type.includes(selectedType));
    });
  }, [pokemonList, selectedTypes]);

  return {
    selectedTypes,
    setSelectedTypes,
    filteredPokemonList,
  };
}

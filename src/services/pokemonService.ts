import type { PokemonList } from '@/types/pokemon';

const HOST = import.meta.env.BASE_URL;

export const fetchPokemonData = async (): Promise<PokemonList> => {
  const response = await fetch(`${HOST}/data/base_pm_list_101.json`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: PokemonList = await response.json();
  return data;
};

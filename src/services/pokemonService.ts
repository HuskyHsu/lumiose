import type { DetailedPokemon, PokemonList } from '@/types/pokemon';
import type { MoveList } from '@/types/move';

const HOST = import.meta.env.BASE_URL;

export const fetchPokemonData = async (): Promise<PokemonList> => {
  const response = await fetch(`${HOST}/data/base_pm_list_200.json`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: PokemonList = await response.json();
  return data;
};

export const fetchPokemonDetail = async (link: string): Promise<DetailedPokemon> => {
  const response = await fetch(`${HOST}/data/pm/${link}.json`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: DetailedPokemon = await response.json();
  return data;
};

export const fetchMoveData = async (
  moveId: number,
): Promise<import('@/types/pokemon').ExpandedMoveData> => {
  const response = await fetch(`${HOST}/data/move/${moveId}.json`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: import('@/types/pokemon').ExpandedMoveData = await response.json();
  return data;
};

export const fetchMoveList = async (): Promise<MoveList> => {
  const response = await fetch(`${HOST}/data/base_move_list_200.json`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: MoveList = await response.json();
  return data;
};

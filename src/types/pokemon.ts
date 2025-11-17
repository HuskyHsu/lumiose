// TypeScript types based on the JSON structure from public/data/base_pm_list_101.json

export interface PokemonName {
  zh: string;
  ja: string;
  en: string;
}

export interface Pokemon {
  pid: number;
  lumioseId: number;
  link: string;
  name: PokemonName;
  base: [number, number, number, number, number, number]; // HP, Attack, Defense, Sp.Attack, Sp.Defense, Speed
  ev: [number, number, number, number, number, number]; // EV yields in same order as base stats
  type: string[];
  source: string;
  latest: boolean;
  altForm?: string; // Optional alternative form name
}

export type PokemonList = Pokemon[];

// Detailed Pokemon types for the detail page
export interface PokemonMove {
  id: number;
  name: PokemonName;
  type: string;
  category: 'Physical' | 'Special' | 'Status';
  power: number;
  cooldown: number;
}

export interface LevelUpMove extends PokemonMove {
  level: number;
  plus: number;
}

export interface TMMove extends PokemonMove {
  tm: number;
}

export interface EvolutionNode {
  link: string;
  type: string[];
  name: PokemonName;
  altForm?: string;
  level?: number;
  method?: string;
  condition?: PokemonName;
  to?: EvolutionNode[];
}

export interface DetailedPokemon extends Pokemon {
  genderRatio: number;
  catchRate: number;
  expGroup: string;
  height: number;
  weight: number;
  alphaMove: PokemonMove;
  levelUpMoves: LevelUpMove[];
  tmMoves: TMMove[];
  evolutionTree: EvolutionNode;
}

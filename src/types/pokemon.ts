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

import type { PokemonName } from './pokemon';

export interface Move {
  id: number;
  name: PokemonName;  // { zh: string; ja: string; en: string }
  type: string;
  category: 'Physical' | 'Special' | 'Status';
  power: number;
  cooldown: number;
  tm?: number;
}

export type MoveList = Move[];

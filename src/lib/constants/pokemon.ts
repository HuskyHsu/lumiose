export const POKEMON_TYPES = [
  'Normal',
  'Fighting',
  'Flying',
  'Poison',
  'Ground',
  'Rock',
  'Bug',
  'Ghost',
  'Steel',
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Psychic',
  'Ice',
  'Dragon',
  'Dark',
  'Fairy',
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

export const EV_STATS = ['HP', '攻擊', '防禦', '特攻', '特防', '速度'] as const;
export type EVStat = (typeof EV_STATS)[number];

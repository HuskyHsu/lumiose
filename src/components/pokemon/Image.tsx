import { cn } from '@/lib/utils';
import type { Pokemon } from '@/types/pokemon';
import PokemonAltForm from './AltForm';
import PokemonNumber from './Number';

interface PokemonImageProps {
  pokemon: Pokemon;
  pokedexId: number;
  isShiny?: boolean;
}

function PokemonImage({ pokemon, pokedexId, isShiny = false }: PokemonImageProps) {
  const imagePath = isShiny
    ? `${import.meta.env.BASE_URL}images/pmIcon/${pokemon.link}s.png`
    : `${import.meta.env.BASE_URL}images/pmIcon/${pokemon.link}.png`;

  return (
    <div
      className={cn('w-24 h-24 relative bg-cover rounded-tr-xl rounded-bl-xl', 'bg-sky-900/70')}
      style={{
        backgroundImage: `url(${imagePath})`,
      }}
    >
      <PokemonNumber number={pokedexId} />
      {pokemon.altForm && <PokemonAltForm altForm={pokemon.altForm} />}
    </div>
  );
}

export default PokemonImage;

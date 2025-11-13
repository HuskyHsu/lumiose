import { FromClass, ToClass } from '@/lib/color';
import { cn } from '@/lib/utils';
import type { Pokemon } from '@/types/pokemon';
import PokemonImage from './Image';
import PokemonName from './Name';
import PokemonTypes from './Types';

interface PokemonCardProps {
  pokemon: Pokemon;
}

function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <div className='group cursor-pointer w-fit'>
      <div
        className={cn(
          'px-4 pt-4 pb-3 flex flex-col gap-3 items-center relative',
          'rounded-tr-3xl rounded-bl-3xl',
          'shadow-list-items',
          `bg-linear-to-tl to-pokemon-fighting`,
          FromClass[pokemon.type[0] as keyof typeof FromClass],
          ToClass[(pokemon.type[1] ? pokemon.type[1] : pokemon.type[0]) as keyof typeof ToClass],
          'transition-all duration-300 ease-in-out',
          'hover:shadow-xl hover:-translate-y-2 hover:bg-sky-200/60'
        )}
      >
        <PokemonImage pokemon={pokemon} />
        <PokemonName name={pokemon.name.zh} />
        <PokemonTypes types={pokemon.type} />
      </div>
    </div>
  );
}

export default PokemonCard;

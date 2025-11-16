import { FromClass, ToClass } from '@/lib/color';
import { cn } from '@/lib/utils';
import type { Pokemon } from '@/types/pokemon';
import { memo, useMemo } from 'react';
import PokemonImage from './Image';
import PokemonName from './Name';
import PokemonTypes from './Types';

interface PokemonCardProps {
  pokemon: Pokemon;
  isShiny?: boolean;
}

const PokemonCard = memo(function PokemonCard({ pokemon, isShiny = false }: PokemonCardProps) {
  // Memoize expensive color class calculations
  const colorClasses = useMemo(() => {
    const primaryType = pokemon.type[0];
    const secondaryType = pokemon.type[1] || pokemon.type[0];

    return cn(
      FromClass[primaryType as keyof typeof FromClass],
      ToClass[secondaryType as keyof typeof ToClass]
    );
  }, [pokemon.type]);

  return (
    <div className='group cursor-pointer w-fit'>
      <div
        className={cn(
          'px-2 md:px-4 pt-2 md:pt-4 pb-3 flex flex-col gap-3 items-center relative',
          'rounded-tr-2xl rounded-bl-2xl md:rounded-tr-3xl md:rounded-bl-3xl',
          'shadow-list-items',
          'bg-linear-to-tl to-pokemon-fighting',
          colorClasses,
          'transition-all duration-300 ease-in-out',
          'hover:shadow-xl hover:-translate-y-2 hover:bg-sky-200/60'
        )}
      >
        <PokemonImage pokemon={pokemon} isShiny={isShiny} />
        <PokemonName name={pokemon.name.zh} />
        <PokemonTypes types={pokemon.type} />
      </div>
    </div>
  );
});

export default PokemonCard;

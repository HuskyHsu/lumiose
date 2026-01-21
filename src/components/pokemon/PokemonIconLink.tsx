import { Link } from 'react-router-dom';

import { FromClass, ToClass } from '@/lib/color';
import { cn } from '@/lib/utils';
import type { MinimalPokemon } from '@/types/pokemon';

interface PokemonIconLinkProps {
  pokemon: MinimalPokemon;
  showLevel?: boolean;
  className?: string;
}

export function PokemonIconLink({
  pokemon,
  showLevel = false,
  className,
}: PokemonIconLinkProps) {
  const primaryType = pokemon.type[0];
  const secondaryType = pokemon.type[1] || pokemon.type[0];
  const bgClass = cn(
    FromClass[primaryType as keyof typeof FromClass],
    ToClass[secondaryType as keyof typeof ToClass],
  );

  const from =
    (pokemon.level || 0) > 1 ? `Lv.${pokemon.level}` : pokemon.level === 0 ? 'Evolve' : '—';

  return (
    <Link
      to={`/pokemon/${pokemon.link}`}
      className={cn(
        'group relative flex flex-col items-center justify-center p-8 w-10 h-10',
        'transition-all duration-300',
        'hover:scale-105 hover:z-20',
        className,
      )}
      title={pokemon.name.zh}
    >
      <div className='w-10 h-10 relative'>
        <div
          className={cn(
            'absolute top-6 -left-2 h-4 w-14 bg-linear-to-l rounded',
            bgClass,
          )}
        ></div>
        <img
          src={`${import.meta.env.BASE_URL}images/pmIcon/${pokemon.link}.png`}
          alt={pokemon.name.zh}
          className='w-full h-full object-contain filter drop-shadow-md relative z-10'
          loading='lazy'
        />
        {showLevel && pokemon.level !== undefined && (
          <span className='text-black absolute -bottom-6 left-1/2 -translate-x-1/2 text-[12px] whitespace-nowrap z-10'>
            {from}
          </span>
        )}
      </div>
    </Link>
  );
}

import { useCaught } from '@/contexts/CaughtContext';
import { trackCustomEvent, trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import type { Pokemon } from '@/types/pokemon';
import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface CompactCardProps {
  pokemon: Pokemon;
  pokedexId: number;
  isShiny?: boolean;
}

export const CompactCard = memo(function CompactCard({
  pokemon,
  pokedexId,
  isShiny = false,
}: CompactCardProps) {
  const location = useLocation();
  const { isCaught, toggleCaught } = useCaught();
  const caught = isCaught(pokemon.link);

  const imagePath = isShiny
    ? `${import.meta.env.BASE_URL}images/pmIcon/${pokemon.link}s.png`
    : `${import.meta.env.BASE_URL}images/pmIcon/${pokemon.link}.png`;

  const handleClick = () => {
    const currentUrl = location.pathname + location.search;
    sessionStorage.setItem('pokemonListReferrer', currentUrl);
    trackEvent('click', 'pokemon_compact_card', pokemon.name.en);
    trackCustomEvent('pokemon_compact_card_click', {
      pokemon_name: pokemon.name.en,
      pokemon_id: pokedexId,
      page_location: location.pathname,
    });
  };

  const handleToggleCaught = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCaught(pokemon.link);
    trackCustomEvent('pokemon_caught_toggle', {
      pokemon_name: pokemon.name.en,
      pokemon_id: pokedexId,
      is_caught: !caught,
      location: 'compact_card',
    });
  };

  return (
    <Link
      to={`/pokemon/${pokemon.link}`}
      className={cn(
        'group relative flex flex-col items-center justify-center p-1 sm:p-2 rounded-xl border bg-slate-50 border-slate-200/60 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-sky-50/50',
        caught && 'bg-emerald-50/40 border-emerald-200/70'
      )}
      onClick={handleClick}
    >
      {/* Caught toggle Poke Ball */}
      <button
        onClick={handleToggleCaught}
        className='absolute top-0.5 right-0.5 sm:top-1.5 sm:right-1.5 z-10 p-0.5 rounded-full hover:scale-110 active:scale-95 transition-all duration-150'
        title={caught ? 'Mark as uncaught' : 'Mark as caught'}
      >
        <img
          src={`${import.meta.env.BASE_URL}images/type/PokemonBall.png`}
          className={cn(
            'w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300',
            caught ? 'opacity-100 drop-shadow-sm scale-110' : 'opacity-25 grayscale hover:opacity-60'
          )}
        />
      </button>

      {/* Pokemon Image */}
      <div
        className='w-10 h-10 sm:w-14 sm:h-14 bg-contain bg-center bg-no-repeat bg-slate-200/40 rounded-lg group-hover:scale-105 transition-transform duration-300'
        style={{
          backgroundImage: `url(${imagePath})`,
        }}
      />

      {/* Pokemon ID / Name / Form info */}
      <div className='text-center mt-1 flex flex-col items-center gap-0.5 max-w-full px-0.5'>
        <span className='text-[8px] sm:text-[10px] text-slate-400 font-semibold tracking-wider'>
          #{String(pokedexId).padStart(3, '0')}
        </span>
        <span className='text-[9px] sm:text-[11px] text-slate-700 font-bold truncate max-w-full group-hover:text-blue-600 transition-colors duration-200'>
          {pokemon.name.zh}
        </span>
        {pokemon.altForm && (
          <span className='text-[7px] sm:text-[9px] px-0.5 sm:px-1 py-0.5 leading-none rounded bg-slate-200/70 text-slate-500 font-medium scale-90 truncate max-w-[120%]'>
            {pokemon.altForm}
          </span>
        )}
      </div>
    </Link>
  );
});

export default CompactCard;

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
  isSilhouette?: boolean;
  slotCoordinate?: { row: number; col: number };
}

export const CompactCard = memo(function CompactCard({
  pokemon,
  pokedexId,
  isShiny = false,
  isSilhouette = false,
  slotCoordinate,
}: CompactCardProps) {
  const location = useLocation();
  const { isCaught, toggleCaught, isCatchMode } = useCaught();
  const caught = isCaught(pokemon.link);

  const imagePath = isShiny
    ? `${import.meta.env.BASE_URL}images/pmIcon/${pokemon.link}s.png`
    : `${import.meta.env.BASE_URL}images/pmIcon/${pokemon.link}.png`;

  const handleClick = (e: React.MouseEvent) => {
    if (isSilhouette) {
      e.preventDefault();
      return;
    }

    if (isCatchMode) {
      e.preventDefault();
      toggleCaught(pokemon.link);
      trackCustomEvent('pokemon_caught_toggle', {
        pokemon_name: pokemon.name.en,
        pokemon_id: pokedexId,
        is_caught: !caught,
        location: 'compact_card_edit_mode',
      });
      return;
    }

    const currentUrl = location.pathname + location.search;
    sessionStorage.setItem('pokemonListReferrer', currentUrl);
    trackEvent('click', 'pokemon_compact_card', pokemon.name.en);
    trackCustomEvent('pokemon_compact_card_click', {
      pokemon_name: pokemon.name.en,
      pokemon_id: pokedexId,
      page_location: location.pathname,
    });
  };

  if (isSilhouette) {
    return (
      <div className='relative flex flex-col items-center justify-center p-1 sm:p-2 rounded-xl border border-dashed border-slate-300 bg-slate-100/50 min-h-[56px] sm:min-h-[80px]'>
        <div
          className='w-10 h-10 sm:w-14 sm:h-14 bg-contain bg-center bg-no-repeat opacity-30 grayscale brightness-0'
          style={{ backgroundImage: `url(${imagePath})` }}
        />
        {slotCoordinate && (
          <span className='absolute bottom-1 right-1 text-[9px] sm:text-[11px] font-medium text-slate-400'>
            R{slotCoordinate.row + 1} C{slotCoordinate.col + 1}
          </span>
        )}
      </div>
    );
  }

  return (
    <Link
      to={`/pokemon/${pokemon.link}`}
      className={cn(
        'group relative flex flex-col items-center justify-center p-1 sm:p-2 rounded-xl transition-all duration-300',
        caught
          ? 'bg-transparent border border-transparent opacity-50 grayscale hover:opacity-100 hover:grayscale-0 hover:bg-slate-50/50'
          : 'bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-slate-300 z-10'
      )}
      onClick={handleClick}
    >
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

import { trackCustomEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import type { Pokedex } from '@/types/pokemon';

interface PokedexToggleProps {
  selectedPokedex: Pokedex;
  onPokedexChange: (Pokedex: Pokedex) => void;
}

function PokedexToggle({ selectedPokedex, onPokedexChange }: PokedexToggleProps) {
  const handleToggle = (targetPokedex: Pokedex) => {
    // Track Pokedex toggle
    trackCustomEvent('Pokedex_toggle', {
      new_state: targetPokedex,
      previous_state: selectedPokedex,
    });

    onPokedexChange(targetPokedex);
  };

  return (
    <div className='mb-4 flex gap-2 items-center'>
      <div className='flex flex-col justify-center h-10'>
        <div className='relative inline-flex bg-slate-200 rounded-full p-1'>
          <button
            type='button'
            onClick={() => handleToggle('lumiose')}
            className={cn(
              'relative px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
              selectedPokedex === 'lumiose'
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900',
            )}
          >
            Lumiose
          </button>
          <button
            type='button'
            onClick={() => handleToggle('hyperspace')}
            className={cn(
              'relative px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2',
              selectedPokedex === 'hyperspace'
                ? 'bg-linear-to-r from-sky-700 to-purple-400 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900',
            )}
          >
            Hyperspace
          </button>
          <button
            type='button'
            onClick={() => handleToggle('national')}
            className={cn(
              'relative px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
              selectedPokedex === 'national'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900',
            )}
          >
            National
          </button>
        </div>
      </div>
    </div>
  );
}

export default PokedexToggle;
export type { Pokedex };

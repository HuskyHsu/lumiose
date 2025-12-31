import { EV_STATS } from '@/lib/constants/pokemon';
import type { Pokemon } from '@/types/pokemon';

interface PokemonEVsProps {
  ev: Pokemon['ev'];
}

export default function PokemonEVs({ ev }: PokemonEVsProps) {
  return (
    <div className='flex gap-1 text-xs font-bold text-slate-700 text-nowrap flex-wrap justify-center'>
      {EV_STATS.map((stat, index) => {
        const evValue = ev[index];
        if (evValue > 0) {
          return (
            <span key={stat} className='p-1 leading-none bg-white/70 rounded'>
              {stat}+{evValue}
            </span>
          );
        }
        return null;
      })}
    </div>
  );
}

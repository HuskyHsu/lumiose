import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { PokemonIconLink, PokemonTypes } from '@/components/pokemon';
import { TableCell, TableRow } from '@/components/ui/table';
import { TYPE_EFFECTIVENESS_CHART } from '@/lib/constants/typeEffectiveness';
import { cn } from '@/lib/utils';
import { getMoveEffectiveness } from '@/lib/utils/typeWeakness';
import { fetchMoveData } from '@/services/pokemonService';
import type { ExpandedMoveData, MinimalPokemon } from '@/types/pokemon';

interface MoveRowProps {
  moveId: number;
  colSpan: number;
  className?: string;
  children: React.ReactNode;
}

export default function MoveRow({ moveId, colSpan, className, children }: MoveRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState<ExpandedMoveData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleExpand = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    setIsExpanded(true);

    if (!data && !isLoading) {
      setIsLoading(true);
      setError(null);
      try {
        const json = await fetchMoveData(moveId);
        setData(json);
      } catch (err) {
        console.error(err);
        setError('Failed to load details');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderEffectiveness = (type: string) => {
    // Check if type is valid key of TYPE_EFFECTIVENESS_CHART
    if (!(type in TYPE_EFFECTIVENESS_CHART)) return null;

    const effectiveness = getMoveEffectiveness(type as keyof typeof TYPE_EFFECTIVENESS_CHART);
    const superEffective = effectiveness[2] || [];
    const notVeryEffective = effectiveness[0.5] || [];
    const noEffect = effectiveness[0] || [];

    return (
      <div className='mb-6 last:mb-0'>
        <h5 className='font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider pl-1'>
          Move Effectiveness
        </h5>
        <div className='flex flex-wrap gap-8 pl-1 text-muted-foreground'>
          {superEffective.length > 0 && (
            <div className='flex flex-col gap-2'>
              <span className='font-bold border-b border-green-200 pb-1'>2x</span>
              <div className='flex flex-wrap gap-2'>
                {superEffective.map((t) => (
                  <PokemonTypes key={t} types={[t]} className='text-[10px]' />
                ))}
              </div>
            </div>
          )}
          {notVeryEffective.length > 0 && (
            <div className='flex flex-col gap-2'>
              <span className='font-bold border-b border-orange-200 pb-1'>0.5x</span>
              <div className='flex flex-wrap gap-2'>
                {notVeryEffective.map((t) => (
                  <PokemonTypes key={t} types={[t]} className='text-[10px]' />
                ))}
              </div>
            </div>
          )}
          {noEffect.length > 0 && (
            <div className='flex flex-col gap-2'>
              <span className='font-bold border-b border-gray-200 pb-1'>0x</span>
              <div className='flex flex-wrap gap-2'>
                {noEffect.map((t) => (
                  <PokemonTypes key={t} types={[t]} className='text-[10px]' />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPokemonList = (list: MinimalPokemon[] | undefined, source: string) => {
    if (!list || list.length === 0) return null;

    return (
      <div className='mb-6 last:mb-0'>
        <h5 className='font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider pl-1'>
          {source} <span className='text-xs opacity-70'>({list.length})</span>
        </h5>
        <div className='flex flex-wrap gap-x-2 gap-y-4'>
          {list.map((pm, idx) => (
            <PokemonIconLink
              key={`${pm.link}-${idx}`}
              pokemon={pm}
              showLevel={true}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <TableRow
        className={cn(
          'cursor-pointer hover:bg-muted/50 transition-colors',
          isExpanded && 'bg-muted/50',
          className,
        )}
        onClick={toggleExpand}
      >
        {children}
      </TableRow>
      {isExpanded && (
        <TableRow className='bg-muted/30 hover:bg-muted/30'>
          <TableCell colSpan={colSpan} className='p-4'>
            {isLoading ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='w-6 h-6 animate-spin text-muted-foreground' />
              </div>
            ) : error ? (
              <div className='text-center py-4 text-red-500'>{error}</div>
            ) : data ? (
              <div className='text-left'>
                {renderEffectiveness(data.type)}
                {renderPokemonList(data.levelUpPm, 'Level Up')}
                {renderPokemonList(data.tmPm, 'TM Machine')}
                {renderPokemonList(data.alphaPm, 'Alpha Pokemon')}

                {!data.levelUpPm?.length && !data.tmPm?.length && !data.alphaPm?.length && (
                  <div className='text-center text-muted-foreground py-4'>
                    No other Pokemon can learn this move.
                  </div>
                )}
              </div>
            ) : null}
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

import { TableCell, TableRow } from '@/components/ui/table';
import { FromClass, ToClass } from '@/lib/color';
import { cn } from '@/lib/utils';
import { fetchMoveData } from '@/services/pokemonService';
import type { ExpandedMoveData, MinimalPokemon } from '@/types/pokemon';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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

  const renderPokemonList = (list: MinimalPokemon[] | undefined, source: string) => {
    if (!list || list.length === 0) return null;

    return (
      <div className='mb-6 last:mb-0'>
        <h5 className='font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider pl-1'>
          {source} <span className='text-xs opacity-70'>({list.length})</span>
        </h5>
        <div className='flex flex-wrap gap-x-2 gap-y-4'>
          {list.map((pm, idx) => {
            const primaryType = pm.type[0];
            const secondaryType = pm.type[1] || pm.type[0];
            const bgClass = cn(
              FromClass[primaryType as keyof typeof FromClass],
              ToClass[secondaryType as keyof typeof ToClass],
            );
            const from = (pm?.level || 0) > 1 ? `Lv.${pm.level}` : pm.level === 0 ? 'Evolve' : '—';

            return (
              <Link
                key={`${pm.link}-${idx}`}
                to={`/pokemon/${pm.link}`}
                className={cn(
                  'group  relative flex flex-col items-center justify-center p-8 w-10 h-10',
                  ' transition-all duration-300',
                  'hover:scale-105 hover:z-10',
                )}
                title={pm.name.zh}
              >
                <div className='w-10 h-10 relative'>
                  <div
                    className={cn(
                      'absolute top-6 -left-2 h-4 w-14 bg-linear-to-l rounded',
                      bgClass,
                    )}
                  ></div>
                  <img
                    src={`${import.meta.env.BASE_URL}images/pmIcon/${pm.link}.png`}
                    alt={pm.name.zh}
                    className='w-full h-full object-contain filter drop-shadow-md'
                    loading='lazy'
                  />
                  {pm.level !== undefined && (
                    <span className='text-black absolute -bottom-6 left-1/2 -translate-x-1/2 text-[12px]'>
                      {from}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
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

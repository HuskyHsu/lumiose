import { getEvolutionMethodTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { DetailedPokemon, EvolutionNode } from '@/types/pokemon';
import type { JSX } from 'react';

type Props = {
  pokemon: DetailedPokemon;
};

const rowSpanMap = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
  4: 'row-span-4',
  8: 'row-[span_8_/_span_8]',
};

type SubCardProps = { pm: EvolutionNode; className?: string };

function SubCard({ pm, className = '' }: SubCardProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <img
        className='h-18'
        src={`${import.meta.env.BASE_URL}images/pmIcon/${pm.link}.png`}
        alt={pm.name.zh}
      />
      <div className='flex items-center'>
        <p className={cn('flex text-sm')}>{pm.name.zh}</p>
        {pm.altForm && <p className='text-xs'>({pm.altForm})</p>}
      </div>
    </div>
  );
}

const Condition = ({ pm, className = '' }: { pm: EvolutionNode; className?: string }) => {
  const translatedMethod = getEvolutionMethodTranslation(pm.method);
  const level = pm.level ?? 0 > 0 ? 'lv' + pm.level : '';
  const condition = pm.condition?.zh ? '(' + pm.condition?.zh + ')' : '';

  return (
    <div className={cn('text-center text-sm flex flex-col', className)}>
      <span>{translatedMethod}</span>
      <span className={cn('text-xs')}>{level}</span>
      <span>{condition}</span>
      <span className='text-xl'>⇨</span>
    </div>
  );
};

export function Evolution({ pokemon }: Props) {
  // 1-1-1-1
  // 1-1-1-2
  // 1-1-2-2
  // 1-1-1
  // 1-1-2
  // 1-2-2
  // 1-1
  // 1-2
  // 1-3
  // 1-8

  // const isMobile = window.screen.width < 768;
  // mobile case:
  // if cols >= 3 => transpose grid

  if (pokemon.evolutionTree === undefined) {
    return;
  }

  // Check if we have 3 or 4 level evolution chains
  const isThree = pokemon.evolutionTree.to?.find((evolve) => evolve.to);
  const isFour = pokemon.evolutionTree.to?.find((evolve) =>
    evolve.to?.find((subEvolve) => subEvolve.to)
  );

  // Determine grid columns based on evolution depth
  let cols = 'grid-cols-3';
  if (isFour) {
    cols = 'grid-cols-3 md:grid-cols-7'; // 4 levels: pokemon + condition + pokemon + condition + pokemon + condition + pokemon
  } else if (isThree) {
    cols = 'grid-cols-3 md:grid-cols-5'; // 3 levels: pokemon + condition + pokemon + condition + pokemon
  }

  const rows = rowSpanMap[(pokemon.evolutionTree?.to?.length || 1) as keyof typeof rowSpanMap];

  let keyId = 0;

  const evolutionPath = pokemon.evolutionTree?.to?.reduce((acc, evolution, i) => {
    let rowElement = [] as JSX.Element[];

    const secRows = rowSpanMap[(evolution.to?.length || 1) as keyof typeof rowSpanMap];

    // Calculate the maximum width at the deepest level for proper row-span alignment
    let maxDeepestWidth = 1;
    if (evolution.to) {
      evolution.to.forEach((thirdLevel) => {
        if (thirdLevel.to) {
          maxDeepestWidth = Math.max(maxDeepestWidth, thirdLevel.to.length);
        }
      });
    }

    // For 4-level chains, if any branch at the 4th level has multiple evolutions,
    // all previous levels should use row-span-2 for alignment
    const fourthLevelRows = rowSpanMap[maxDeepestWidth as keyof typeof rowSpanMap];
    const shouldUseRowSpan2 = isFour && fourthLevelRows === 'row-span-2';

    let rowsClass = 'row-span-1';
    if (shouldUseRowSpan2) {
      rowsClass = 'row-span-2';
    } else {
      rowsClass = rows === 'row-span-1' && secRows === 'row-span-2' ? 'row-span-2' : 'row-span-1';
    }

    if (i === 0 && pokemon.evolutionTree) {
      let firstPokemonRowSpan = rows;
      if (shouldUseRowSpan2) {
        firstPokemonRowSpan = 'row-span-2';
      } else if (rows === 'row-span-1' && secRows === 'row-span-2') {
        firstPokemonRowSpan = 'row-span-2';
      }

      rowElement.push(
        <SubCard
          key={keyId}
          pm={pokemon.evolutionTree}
          className={cn('text-xs', firstPokemonRowSpan)}
        />
      );
    }

    rowElement = rowElement.concat([
      <Condition key={keyId + 1} pm={evolution} className={rowsClass} />,
      <SubCard key={keyId + 2} pm={evolution} className={cn('text-xs', rowsClass)} />,
    ]);

    acc = acc.concat(rowElement.slice(0));
    keyId += 3;
    if (evolution.to) {
      evolution.to.forEach((evolution_) => {
        // Third level pokemon should also use row-span-2 if 4th level has multiple branches
        const thirdLevelRowSpan = shouldUseRowSpan2 ? 'row-span-2' : 'row-span-1';

        acc = acc.concat([
          <Condition
            key={keyId}
            pm={evolution_}
            className={cn('hidden md:flex', thirdLevelRowSpan)}
          />,
          <SubCard
            key={keyId + 1}
            pm={evolution_}
            className={cn('hidden text-xs md:flex', thirdLevelRowSpan)}
          />,
        ]);
        keyId += 2;

        // Handle 4th level evolution
        if (evolution_.to) {
          evolution_.to.forEach((fourthEvolution) => {
            acc = acc.concat([
              <Condition key={keyId} pm={fourthEvolution} className={cn('hidden md:flex')} />,
              <SubCard
                key={keyId + 1}
                pm={fourthEvolution}
                className={cn('hidden text-xs md:flex')}
              />,
            ]);
            keyId += 2;
          });
        } else if (isFour) {
          // Add empty spaces for alignment when we have 4-level chain but this branch doesn't go to 4th level
          acc = acc.concat([
            <span key={keyId + 12345} className={cn('hidden text-xs md:flex')} />,
            <span key={keyId + 123456} className={cn('hidden text-xs md:flex')} />,
          ]);
          keyId += 2;
        }
      });
    } else if (isThree || isFour) {
      // Add empty spaces for alignment
      const emptySpaces = isFour ? 4 : 2;
      for (let i = 0; i < emptySpaces; i++) {
        acc = acc.concat([
          <span key={keyId + 12345 + i} className={cn('hidden text-xs md:flex')} />,
        ]);
      }
    }

    return acc;
  }, [] as JSX.Element[]);

  let hasHr = false;
  let hasHr4th = false;
  pokemon.evolutionTree?.to?.forEach((evolution) => {
    if (evolution.to) {
      if (hasHr === false) {
        evolutionPath?.push(<hr className='col-span-3 w-full md:hidden' key={999} />);
        hasHr = true;
      }

      evolution.to.forEach((evolution_, i, list) => {
        evolutionPath?.push(
          <SubCard
            key={keyId}
            pm={evolution}
            className={cn(
              'text-xs md:hidden',
              list.length > 1 ? (i === 0 ? 'row-span-2' : 'hidden') : ''
            )}
          />,
          <Condition key={keyId + 1} pm={evolution_} className='md:hidden' />,
          <SubCard key={keyId + 2} pm={evolution_} className={cn('text-xs md:hidden')} />
        );
        keyId += 3;

        // Handle 4th level evolution for mobile
        if (evolution_.to) {
          evolution_.to.forEach((fourthEvolution, j, fourthList) => {
            if (hasHr4th === false) {
              evolutionPath?.push(<hr className='col-span-3 w-full md:hidden' key={998} />);
              hasHr4th = true;
            }

            evolutionPath?.push(
              <SubCard
                key={keyId}
                pm={evolution_}
                className={cn(
                  'text-xs md:hidden',
                  fourthList.length > 1 ? (j === 0 ? 'row-span-2' : 'hidden') : ''
                )}
              />,
              <Condition key={keyId + 1} pm={fourthEvolution} className='md:hidden' />,
              <SubCard key={keyId + 2} pm={fourthEvolution} className={cn('text-xs md:hidden')} />
            );
            keyId += 3;
          });
        }
      });
    }
  });

  return (
    <div
      className={cn(
        'grid items-center justify-center gap-y-8 text-center',
        'justify-items-center',
        cols
      )}
    >
      {evolutionPath}
    </div>
  );
}

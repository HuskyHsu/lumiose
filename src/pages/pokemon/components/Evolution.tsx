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
    <div className={cn(className)}>
      <span className={cn()} />
      <img
        className='h-18'
        src={`${import.meta.env.BASE_URL}images/pmIcon/${pm.link}.png`}
        alt={pm.name.zh}
      />
      <span className={cn()}>
        {pm.name.zh}
        {pm.altForm ? <span className='text-xs'>({pm.altForm})</span> : ''}
      </span>
    </div>
  );
}

const Condition = ({ condition, className = '' }: { condition: string; className?: string }) => {
  return (
    <span className={cn('relative flex h-full w-full items-center text-right', className)}>
      <span
        className={cn(
          'absolute',
          'inset-x-0',
          'top-1/2 -translate-y-1/3',
          'text-xs',
          'flex justify-center text-center',
          'text-[12px] md:text-base'
        )}
      >
        {condition} ⇨
      </span>
    </span>
  );
};

const getConditionText = (evolution: EvolutionNode) => {
  return `${evolution.method}${evolution.level ?? 0 > 0 ? evolution.level : ''}${
    evolution.condition?.zh ? '(' + evolution.condition?.zh + ')' : ''
  }`;
};

const getEvolutionTreeMaxDepth = (evolutionTree: EvolutionNode): number => {
  // If no children, depth is 1 (current node)
  if (!evolutionTree.to || evolutionTree.to.length === 0) {
    return 1;
  }

  // Recursively calculate max depth of all children, then add current node depth
  const maxChildDepth = Math.max(
    ...evolutionTree.to.map((child) => getEvolutionTreeMaxDepth(child))
  );
  return 1 + maxChildDepth;
};

const getEvolutionTreeMaxWidth = (evolutionTree: EvolutionNode): number => {
  // Use BFS to count nodes at each level
  const queue: EvolutionNode[][] = [[evolutionTree]];
  let maxWidth = 1; // At least the root node

  while (queue.length > 0) {
    const currentLevel = queue.shift()!;
    const currentWidth = currentLevel.length;

    // Update max width if current level is wider
    maxWidth = Math.max(maxWidth, currentWidth);

    // Collect all children for the next level
    const nextLevel: EvolutionNode[] = [];
    currentLevel.forEach((node) => {
      if (node.to && node.to.length > 0) {
        nextLevel.push(...node.to);
      }
    });

    // Add next level to queue if it has nodes
    if (nextLevel.length > 0) {
      queue.push(nextLevel);
    }
  }

  return maxWidth;
};

export function Evolution({ pokemon }: Props) {
  // 1-1-1-1
  // 1-1-1-2
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

  // Calculate the maximum depth and width of the evolution tree
  const maxDepth = getEvolutionTreeMaxDepth(pokemon.evolutionTree);
  const maxWidth = getEvolutionTreeMaxWidth(pokemon.evolutionTree);
  console.log('Evolution tree max depth:', maxDepth);
  console.log('Evolution tree max width:', maxWidth);

  const isThree = pokemon.evolutionTree.to?.find((evolve) => evolve.to);
  const cols = isThree ? 'grid-cols-3 md:grid-cols-5' : 'grid-cols-3';
  const rows = rowSpanMap[(pokemon.evolutionTree?.to?.length || 1) as keyof typeof rowSpanMap];

  let keyId = 0;

  const evolutionPath = pokemon.evolutionTree?.to?.reduce((acc, evolution, i) => {
    let rowElement = [] as JSX.Element[];

    const secRows = rowSpanMap[(evolution.to?.length || 1) as keyof typeof rowSpanMap];

    const rowsClass =
      rows === 'row-span-1' && secRows === 'row-span-2' ? 'row-span-2' : 'row-span-1';

    if (i === 0 && pokemon.evolutionTree) {
      rowElement.push(
        <SubCard
          key={keyId}
          pm={pokemon.evolutionTree}
          className={cn(
            'text-xs',
            rows === 'row-span-1' && secRows === 'row-span-2' ? 'row-span-2' : rows
          )}
        />
      );
    }

    rowElement = rowElement.concat([
      <Condition key={keyId + 1} condition={getConditionText(evolution)} className={rowsClass} />,
      <SubCard key={keyId + 2} pm={evolution} className={cn('text-xs', rowsClass)} />,
    ]);

    acc = acc.concat(rowElement.slice(0));
    keyId += 3;
    if (evolution.to) {
      evolution.to.forEach((evolution_) => {
        acc = acc.concat([
          <Condition
            key={keyId}
            condition={getConditionText(evolution_)}
            className={cn('hidden md:block')}
          />,
          <SubCard key={keyId + 1} pm={evolution_} className={cn('hidden text-xs md:block')} />,
        ]);
        keyId += 2;
      });
    } else if (isThree) {
      acc = acc.concat([
        <span key={keyId + 12345} className={cn('hidden text-xs md:block')} />,
        <span key={keyId + 123456} className={cn('hidden text-xs md:block')} />,
      ]);
    }

    return acc;
  }, [] as JSX.Element[]);

  let hasHr = false;
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
          <Condition
            key={keyId + 1}
            condition={getConditionText(evolution_)}
            className='md:hidden'
          />,
          <SubCard key={keyId + 2} pm={evolution_} className={cn('text-xs md:hidden')} />
        );
        keyId += 3;
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

import { PokemonTypes } from '@/components/pokemon';
import { WEAKNESS_MULTIPLIERS } from '@/lib/constants/typeEffectiveness';
import { calculateTypeWeaknesses, filterTypesByEffectiveness } from '@/lib/utils/typeWeakness';
import type { TypeRateProps, TypeWeaknessProps, WeaknessDisplayProps } from '@/types/pokemon';

function TypeRate({ targetRate, types }: TypeRateProps) {
  const typeWeaknesses = calculateTypeWeaknesses(types);
  const matchingTypes = filterTypesByEffectiveness(typeWeaknesses, targetRate);

  if (matchingTypes.length === 0) {
    return <></>;
  }

  return (
    <div className='space-y-2 py-2'>
      <h6 className='font-bold text-gray-500'>{targetRate}x</h6>
      <div className='flex flex-wrap gap-2'>
        {matchingTypes.map(({ type }) => (
          <PokemonTypes types={[type]} key={type} />
        ))}
      </div>
    </div>
  );
}

function Weakness({ types }: WeaknessDisplayProps) {
  return (
    <>
      <div className='grid grid-cols-2 gap-x-2 md:flex md:justify-around'>
        {WEAKNESS_MULTIPLIERS.map((rate) => (
          <TypeRate targetRate={rate} types={types} key={rate} />
        ))}
      </div>
    </>
  );
}

export function TypeWeakness({ pokemon }: TypeWeaknessProps) {
  return (
    <>
      <span className='text-sm text-gray-500'>Weakness Type:</span>
      <Weakness types={pokemon.type} />
    </>
  );
}

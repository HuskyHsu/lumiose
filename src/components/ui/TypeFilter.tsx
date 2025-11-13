import { useState } from 'react';

const POKEMON_TYPES = [
  'Normal',
  'Fighting',
  'Flying',
  'Poison',
  'Ground',
  'Rock',
  'Bug',
  'Ghost',
  'Steel',
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Psychic',
  'Ice',
  'Dragon',
  'Dark',
  'Fairy',
] as const;

type PokemonType = (typeof POKEMON_TYPES)[number];

interface TypeFilterProps {
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
}

export function TypeFilter({ selectedTypes, onTypeChange }: TypeFilterProps) {
  const [isAllSelected, setIsAllSelected] = useState(true);

  const handleTypeClick = (type: PokemonType) => {
    if (isAllSelected) {
      setIsAllSelected(false);
      onTypeChange([type]);
    } else {
      if (selectedTypes.includes(type)) {
        const newTypes = selectedTypes.filter((t) => t !== type);
        if (newTypes.length === 0) {
          setIsAllSelected(true);
          onTypeChange([]);
        } else {
          onTypeChange(newTypes);
        }
      } else {
        onTypeChange([...selectedTypes, type]);
      }
    }
  };

  return (
    <div className='mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold text-slate-700'>Type Filter</h2>
      </div>

      <div className='flex gap-2'>
        {POKEMON_TYPES.map((type) => {
          const isSelected = isAllSelected || selectedTypes.includes(type);
          const shouldFade =
            !isAllSelected && selectedTypes.length > 0 && !selectedTypes.includes(type);

          return (
            <button key={type}>
              <img
                src={`${import.meta.env.BASE_URL}/images/type/${type}.png`}
                alt={type}
                onClick={() => handleTypeClick(type)}
                className={`
                flex flex-col w-8 h-8 mb-1 items-center rounded-lg transition-all duration-100
                ${
                  isSelected
                    ? 'border-blue-400 bg-blue-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${shouldFade ? 'opacity-40' : 'opacity-100'}
                hover:scale-105 active:scale-95
              `}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

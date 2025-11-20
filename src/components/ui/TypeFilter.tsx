import { POKEMON_TYPES, type PokemonType } from '@/lib/constants/pokemon';

interface TypeFilterProps {
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
}

export function TypeFilter({ selectedTypes, onTypeChange }: TypeFilterProps) {
  // Determine if all types are selected based on the selectedTypes prop
  const isAllSelected = selectedTypes.length === 0;

  const handleTypeClick = (type: PokemonType) => {
    if (isAllSelected) {
      // If all types are selected (none specifically chosen), select only this type
      onTypeChange([type]);
    } else {
      if (selectedTypes.includes(type)) {
        // If this type is already selected, remove it
        const newTypes = selectedTypes.filter((t) => t !== type);
        onTypeChange(newTypes);
      } else {
        // If this type is not selected, add it to the selection
        onTypeChange([...selectedTypes, type]);
      }
    }
  };

  return (
    <div className='mb-4'>
      <h2 className='text-lg font-semibold text-slate-700 mb-4'>Type Filter</h2>
      <div className='grid grid-cols-9 md:grid-cols-18 lg:grid-cols-22 gap-2'>
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

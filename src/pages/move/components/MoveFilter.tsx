import { PokemonTypes } from '@/components/pokemon';
import { cn } from '@/lib/utils';

interface MoveFilterProps {
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  isTM: boolean;
  onTMChange: (isTM: boolean) => void;
}

export default function MoveFilter({
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  isTM,
  onTMChange,
}: MoveFilterProps) {
  // All 18 Pokemon types
  const allTypes = [
    'Normal',
    'Fire',
    'Water',
    'Electric',
    'Grass',
    'Ice',
    'Fighting',
    'Poison',
    'Ground',
    'Flying',
    'Psychic',
    'Bug',
    'Rock',
    'Ghost',
    'Dragon',
    'Dark',
    'Steel',
    'Fairy',
  ];

  const categories = ['Physical', 'Special', 'Status'];

  const toggleType = (type: string) => {
    onTypeChange(selectedType === type ? null : type);
  };

  const toggleCategory = (category: string) => {
    onCategoryChange(selectedCategory === category ? null : category);
  };

  return (
    <div className='mb-6 space-y-4'>
      <h2 className='text-lg font-semibold text-slate-700 mb-2 flex items-center'>
        <img src={`${import.meta.env.BASE_URL}images/type/Move.png`} className='w-6 h-6 mr-2' />
        Type Filter
      </h2>
      <div className='flex flex-wrap gap-2 items-center'>
        {allTypes.map((type) => {
          const isSelected = selectedType === type;
          const shouldFade = selectedType !== null && !isSelected;

          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={cn(
                'flex items-center justify-center rounded-lg transition-all duration-100',
                shouldFade ? 'opacity-30' : 'opacity-100',
                'hover:scale-110 active:scale-90',
              )}
              title={type}
            >
              <PokemonTypes types={[type]} className='w-8 h-8' />
            </button>
          );
        })}
      </div>
      <h2 className='text-lg font-semibold text-slate-700 mb-2 flex items-center'>
        <img src={`${import.meta.env.BASE_URL}images/type/Move.png`} className='w-6 h-6 mr-2' />
        Category Filter
      </h2>
      <div className='flex flex-wrap gap-2 items-center'>
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          const shouldFade = selectedCategory !== null && !isSelected;

          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={cn(
                'flex items-center justify-center rounded-lg transition-all duration-100',
                'border-gray-200 bg-white hover:border-gray-300 border',
                shouldFade ? 'opacity-30' : 'opacity-100',
                'hover:scale-110 active:scale-90',
              )}
              title={category}
            >
              <PokemonTypes types={[category]} className='w-8 h-8' />
            </button>
          );
        })}
      </div>

      <div className='flex gap-2 items-center mt-4'>
        <div className='flex flex-col justify-center h-10'>
          <button
            type='button'
            onClick={() => onTMChange(!isTM)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
              isTM ? 'bg-green-600' : 'bg-slate-300',
            )}
            role='switch'
            aria-checked={isTM}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
                isTM ? 'translate-x-6' : 'translate-x-1',
              )}
            />
          </button>
        </div>
        <span className='font-semibold text-slate-700'>TM</span>
      </div>
    </div>
  );
}

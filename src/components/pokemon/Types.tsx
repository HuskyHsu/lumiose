import { cn } from '@/lib/utils';

interface PokemonTypesProps {
  types: string[];
}

function PokemonTypes({ types }: PokemonTypesProps) {
  return (
    <div className={cn('flex gap-2')}>
      {types.map((type, index) => (
        <img
          key={index}
          src={`${import.meta.env.BASE_URL}images/type/${type}.png`}
          alt={type}
          className='w-5 h-5'
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      ))}
    </div>
  );
}

export default PokemonTypes;

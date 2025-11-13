import { cn } from '@/lib/utils';

interface PokemonNameProps {
  name: string;
}

function PokemonName({ name }: PokemonNameProps) {
  return (
    <span
      className={cn(
        'rounded-tr-xl rounded-bl-xl px-3 text-center w-full h-8 flex items-center justify-center',
        name.length > 4 ? 'text-md' : 'text-lg',
        'bg-white'
      )}
    >
      {name}
    </span>
  );
}

export default PokemonName;

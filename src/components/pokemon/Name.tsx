import { cn } from '@/lib/utils';

interface PokemonNameProps {
  name: string;
}

function PokemonName({ name }: PokemonNameProps) {
  return (
    <span
      className={cn('text-lg rounded-tr-xl rounded-bl-xl px-3 pb-1 text-center w-full', 'bg-white')}
    >
      {name}
    </span>
  );
}

export default PokemonName;

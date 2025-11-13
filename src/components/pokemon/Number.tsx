import { cn } from '@/lib/utils';

interface PokemonNumberProps {
  number: number;
}

function PokemonNumber({ number }: PokemonNumberProps) {
  return (
    <span
      className={cn(
        'absolute -left-6 -top-8',
        'group-hover:text-yellow-400 group-hover:-translate-y-1 group-hover:-translate-x-1',
        'text-white font-bold text-4xl drop-shadow-lg',
        'transition-all duration-300'
      )}
      style={{
        textShadow: '2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.5)',
      }}
    >
      {number.toString().padStart(3, '0')}
    </span>
  );
}

export default PokemonNumber;

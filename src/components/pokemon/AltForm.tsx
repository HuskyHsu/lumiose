import { cn } from '@/lib/utils';

interface PokemonAltFormProps {
  altForm: string;
}

function PokemonAltForm({ altForm }: PokemonAltFormProps) {
  return (
    <span
      className={cn(
        'absolute -right-2 -bottom-1',
        'text-white group-hover:text-yellow-400 group-hover:translate-x-4',
        'font-bold text-md drop-shadow-lg',
        'transition-all duration-300'
      )}
      style={{
        textShadow: '2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.5)',
      }}
    >
      {altForm}
    </span>
  );
}

export default PokemonAltForm;

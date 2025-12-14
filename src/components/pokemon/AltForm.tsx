import { cn } from '@/lib/utils';

interface PokemonAltFormProps {
  altForm: string;
}

function PokemonAltForm({ altForm }: PokemonAltFormProps) {
  let textSizeClass = 'text-md';
  if (altForm.length > 8) {
    textSizeClass = 'text-sm';
  }

  return (
    <span
      className={cn(
        'absolute -right-2 -bottom-1',
        'text-white group-hover:text-yellow-400 group-hover:translate-x-4',
        'font-bold drop-shadow-lg',
        textSizeClass,
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

import { Card, CardContent } from '@/components/ui/card';
import { FromClass, ToClass } from '@/lib/color';
import { cn } from '@/lib/utils';
import type { DetailedPokemon } from '@/types/pokemon';

interface PokemonHeaderProps {
  pokemon: DetailedPokemon;
}

export default function PokemonHeader({ pokemon }: PokemonHeaderProps) {
  const primaryType = pokemon.type[0];
  const secondaryType = pokemon.type[1] || pokemon.type[0];

  const colorClasses = cn(
    FromClass[primaryType as keyof typeof FromClass],
    ToClass[secondaryType as keyof typeof ToClass]
  );

  return (
    <Card className={cn('overflow-hidden', colorClasses)}>
      <CardContent className='p-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-4xl font-bold mb-2'>{pokemon.name.zh}</h1>
            <p className='text-xl text-white/80'>
              {pokemon.name.en} / {pokemon.name.ja}
            </p>
            <div className='flex gap-2 mt-4'>
              {pokemon.type.map((type) => (
                <span key={type} className='px-3 py-1 rounded-full bg-white/20 text-sm font-medium'>
                  {type}
                </span>
              ))}
            </div>
          </div>
          <div className='text-righ'>
            <div className='text-3xl font-bold'>#{pokemon.pid.toString().padStart(3, '0')}</div>
            <div className='text-sm opacity-80'>Lumiose ID: {pokemon.lumioseId}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

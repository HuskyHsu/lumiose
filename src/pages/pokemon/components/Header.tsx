import { PokemonTypes } from '@/components/pokemon';
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
            <p className='text-xl'>
              {pokemon.name.ja} / {pokemon.name.en}
            </p>
            <div className='flex gap-2 mt-4'>
              <PokemonTypes types={pokemon.type} />
            </div>
          </div>
          <div className='text-righ flex'>
            <img
              src={`${import.meta.env.BASE_URL}images/pmIcon/${pokemon.link}.png`}
              alt={pokemon.name.zh}
            />
            <img
              src={`${import.meta.env.BASE_URL}images/pmIcon/${pokemon.link}s.png`}
              alt={pokemon.name.zh}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

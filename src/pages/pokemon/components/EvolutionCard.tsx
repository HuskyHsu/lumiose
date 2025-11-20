import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DetailedPokemon } from '@/types/pokemon';
import { Evolution } from './Evolution';

interface EvolutionCardProps {
  pokemon: DetailedPokemon;
  onPokemonChange: (newLink: string) => Promise<void>;
}

export default function EvolutionCard({ pokemon, onPokemonChange }: EvolutionCardProps) {
  return (
    <Card className='lg:col-span-2'>
      <CardHeader>
        <CardTitle>Evolution Chain</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex justify-center'>
          <Evolution pokemon={pokemon} onPokemonChange={onPokemonChange} />
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DetailedPokemon } from '@/types/pokemon';
import { RadarChart } from './RadarChart';
import { Statistic } from './Statistic';

interface StatsCardProps {
  pokemon: DetailedPokemon;
}

export default function StatsCard({ pokemon }: StatsCardProps) {
  // const statNames = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];
  // const maxStat = Math.max(...pokemon.base);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Base Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <CardTitle className='text-sm mb-4'>Individual Values & Base points</CardTitle>
        <div className='flex justify-center'>
          <div className=''>
            <div className='w-4/5 md:w-2/3 mx-auto'>
              <RadarChart stats={pokemon.base} EVs={pokemon.ev} />
            </div>
            <Statistic pokemon={pokemon} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

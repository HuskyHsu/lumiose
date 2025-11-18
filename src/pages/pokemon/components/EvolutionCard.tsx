import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DetailedPokemon } from '@/types/pokemon';

interface EvolutionCardProps {
  pokemon: DetailedPokemon;
}

export default function EvolutionCard({ pokemon }: EvolutionCardProps) {
  const renderEvolutionNode = (node: DetailedPokemon['evolutionTree'], level = 0) => {
    return (
      <div key={node.link} className='flex flex-col items-center'>
        <div className='bg-gray-100 p-3 rounded-lg text-center min-w-[120px]'>
          <div className='font-medium text-sm'>{node.name.zh}</div>
          <div className='text-xs text-gray-600'>{node.name.en}</div>
          {node.altForm && (
            <div className='text-xs text-purple-600 font-medium'>{node.altForm}</div>
          )}
        </div>

        {node.to && node.to.length > 0 && (
          <div className='mt-2 flex flex-col items-center'>
            {node.to.map((evolution) => (
              <div key={evolution.link} className='flex flex-col items-center'>
                <div className='text-xs text-gray-500 my-1 text-center'>
                  {evolution.method === 'LevelUp' && `Lv.${evolution.level}`}
                  {evolution.method === 'MegaEvolution' && evolution.condition?.en}
                </div>
                <div className='w-px h-4 bg-gray-300' />
                {renderEvolutionNode(evolution, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className='lg:col-span-2'>
      <CardHeader>
        <CardTitle>Evolution Chain</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex justify-center overflow-x-auto'>
          {renderEvolutionNode(pokemon.evolutionTree)}
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { FromClass, ToClass } from '@/lib/color';
import { cn } from '@/lib/utils';
import { fetchPokemonDetail } from '@/services/pokemonService';
import type { DetailedPokemon } from '@/types/pokemon';
import { ArrowLeft, Ruler, Weight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function PokemonDetail() {
  const { link } = useParams<{ link: string }>();
  const [pokemon, setPokemon] = useState<DetailedPokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!link) {
      setError('Pokemon ID not provided');
      setLoading(false);
      return;
    }

    const loadPokemonDetail = async () => {
      try {
        setLoading(true);
        const data = await fetchPokemonDetail(link);
        setPokemon(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Pokemon details');
      } finally {
        setLoading(false);
      }
    };

    loadPokemonDetail();
  }, [link]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!pokemon) {
    return <ErrorMessage message='Pokemon not found' />;
  }

  return (
    <div className='space-y-6'>
      <BackButton />
      <PokemonHeader pokemon={pokemon} />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <BasicInfo pokemon={pokemon} />
        <StatsCard pokemon={pokemon} />
        <MovesCard pokemon={pokemon} />
        <EvolutionCard pokemon={pokemon} />
      </div>
    </div>
  );
}

function BackButton() {
  return (
    <Link
      to='/'
      className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors'
    >
      <ArrowLeft size={20} />
      Back to Pokedex
    </Link>
  );
}

function PokemonHeader({ pokemon }: { pokemon: DetailedPokemon }) {
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

function BasicInfo({ pokemon }: { pokemon: DetailedPokemon }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex items-center gap-2'>
            <Ruler className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Height:</span>
            <span className='font-medium'>{pokemon.height}m</span>
          </div>
          <div className='flex items-center gap-2'>
            <Weight className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Weight:</span>
            <span className='font-medium'>{pokemon.weight}kg</span>
          </div>
        </div>
        <div className='space-y-2'>
          <div className='flex justify-between'>
            <span className='text-sm text-gray-500'>Catch Rate:</span>
            <span className='font-medium'>{pokemon.catchRate}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-gray-500'>Gender Ratio:</span>
            <span className='font-medium'>{pokemon.genderRatio}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-gray-500'>Experience Group:</span>
            <span className='font-medium'>{pokemon.expGroup}</span>
          </div>
        </div>

        {pokemon.alphaMove && (
          <div className='pt-4 border-t'>
            <h4 className='font-semibold mb-2'>Alpha Move</h4>
            <div className='bg-gray-50 p-3 rounded-md'>
              <div className='flex justify-between items-center mb-1'>
                <span className='font-medium'>{pokemon.alphaMove.name.zh}</span>
                <span className='text-sm px-2 py-1 rounded bg-gray-200'>
                  {pokemon.alphaMove.type}
                </span>
              </div>
              <div className='text-sm text-gray-600'>
                {pokemon.alphaMove.name.en} • Power: {pokemon.alphaMove.power} • Cooldown:{' '}
                {pokemon.alphaMove.cooldown}s
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatsCard({ pokemon }: { pokemon: DetailedPokemon }) {
  const statNames = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];
  const maxStat = Math.max(...pokemon.base);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Base Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {pokemon.base.map((stat, index) => (
            <div key={index} className='flex items-center gap-4'>
              <div className='w-16 text-sm font-medium text-gray-600'>{statNames[index]}</div>
              <div className='w-12 text-right font-bold'>{stat}</div>
              <div className='flex-1 bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                  style={{ width: `${(stat / maxStat) * 100}%` }}
                />
              </div>
            </div>
          ))}
          <div className='pt-2 border-t'>
            <div className='flex justify-between font-semibold'>
              <span>Total:</span>
              <span>{pokemon.base.reduce((sum, stat) => sum + stat, 0)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MovesCard({ pokemon }: { pokemon: DetailedPokemon }) {
  return (
    <Card className='lg:col-span-2'>
      <CardHeader>
        <CardTitle>Moves</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div>
            <h4 className='font-semibold mb-3'>Level Up Moves</h4>
            <div className='space-y-2 max-h-64 overflow-y-auto'>
              {pokemon.levelUpMoves.map((move, index) => (
                <div key={index} className='bg-gray-50 p-2 rounded text-sm'>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium'>{move.name.zh}</span>
                    <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                      Lv.{move.level}
                    </span>
                  </div>
                  <div className='text-xs text-gray-600 mt-1'>
                    {move.name.en} • {move.type} • Power: {move.power} • CD: {move.cooldown}s
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className='font-semibold mb-3'>TM Moves</h4>
            <div className='space-y-2 max-h-64 overflow-y-auto'>
              {pokemon.tmMoves.map((move, index) => (
                <div key={index} className='bg-gray-50 p-2 rounded text-sm'>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium'>{move.name.zh}</span>
                    <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded'>
                      TM{move.tm.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className='text-xs text-gray-600 mt-1'>
                    {move.name.en} • {move.type} • Power: {move.power} • CD: {move.cooldown}s
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EvolutionCard({ pokemon }: { pokemon: DetailedPokemon }) {
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

export default PokemonDetail;

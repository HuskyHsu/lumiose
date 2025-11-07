import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchPokemonData } from '@/services/pokemonService';
import type { PokemonList } from '@/types/pokemon';

function Home() {
  const [pokemonList, setPokemonList] = useState<PokemonList>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPokemonData = async () => {
      try {
        setLoading(true);
        const data = await fetchPokemonData();
        setPokemonList(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入資料時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    loadPokemonData();
  }, []);

  if (loading) {
    return (
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold'>PokeDex</h1>
        <div className='flex justify-center items-center h-64'>
          <p className='text-lg'>載入中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold'>PokeDex</h1>
        <div className='flex justify-center items-center h-64'>
          <p className='text-lg text-red-500'>錯誤: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold'>PokeDex</h1>

      <p className='mb-4'>總共載入了 {pokemonList.length} 隻寶可夢</p>
      <div className='grid  grid-cols-4 gap-2'>
        {pokemonList.map((pokemon) => (
          <Card key={pokemon.link}>
            <CardHeader>
              <CardTitle>
                #{pokemon.lumioseId} {pokemon.name.zh}
                {pokemon.altForm && <span className='text-xs'>{pokemon.altForm}</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center space-y-2'>
                <div className='w-16 h-16 relative'>
                  <img
                    src={`${import.meta.env.BASE_URL}images/pmIcon/${pokemon.link}.png`}
                    alt={pokemon.name.zh}
                    className='w-full h-full object-contain'
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className='flex gap-2'>
                  {pokemon.type.map((type) => {
                    return (
                      <img
                        src={`${import.meta.env.BASE_URL}images/type/${type}.png`}
                        alt={type}
                        className='w-5 h-5'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Home;

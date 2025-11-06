import { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
              </CardTitle>
              {pokemon.altForm && <CardDescription>{pokemon.altForm}</CardDescription>}
            </CardHeader>
            <CardContent>
              <p>{pokemon.type.join(', ')}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Home;

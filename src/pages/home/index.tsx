import { useEffect, useState } from 'react';

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
      <div className='flex gap-2 flex-wrap text-slate-800'>
        {pokemonList.map((pokemon) => {
          return (
            <div key={pokemon.link}>
              <div className='bg-sky-100/70 p-2 flex flex-col items-center'>
                <div
                  className='w-16 h-16 relative bg-cover rounded-tr-xl rounded-bl-xl bg-sky-900/70'
                  style={{
                    backgroundImage: `url(${import.meta.env.BASE_URL}images/pmIcon/${
                      pokemon.link
                    }.png)`,
                  }}
                ></div>
                <span>#{pokemon.lumioseId}</span>
                <span>{pokemon.name.zh}</span>
                {pokemon.altForm && <span className='text-xs'>{pokemon.altForm}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;

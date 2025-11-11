import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
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
      <div className='flex gap-3 flex-wrap justify-around text-slate-800'>
        {pokemonList.map((pokemon) => {
          return (
            <div key={pokemon.link} className='group cursor-pointer'>
              <div
                className={cn(
                  'p-2 flex flex-col gap-1 items-center relative',
                  'rounded-tr-3xl rounded-bl-3xl bg-sky-200/80',
                  'transition-all duration-300 ease-in-out',
                  'hover:shadow-xl hover:-translate-y-2 hover:bg-sky-200/60'
                )}
              >
                <div
                  className={cn(
                    'w-24 h-24 relative bg-cover rounded-tr-xl rounded-bl-xl',
                    'bg-sky-900/70 drop-shadow-md/50'
                  )}
                  style={{
                    backgroundImage: `url(${import.meta.env.BASE_URL}images/pmIcon/${
                      pokemon.link
                    }.png)`,
                  }}
                >
                  <span
                    className={cn(
                      'absolute -left-2 -top-4',
                      'text-white group-hover:text-yellow-400',
                      'font-bold text-4xl drop-shadow-lg transition-colors duration-300'
                    )}
                    style={{
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.5)',
                    }}
                  >
                    {pokemon.lumioseId.toString().padStart(3, '0')}
                  </span>
                  {pokemon.altForm && (
                    <span
                      className={cn(
                        'absolute -right-1 -bottom-1',
                        'text-white group-hover:text-yellow-400',
                        'font-bold text-lg drop-shadow-lg transition-colors duration-300'
                      )}
                      style={{
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.5)',
                      }}
                    >
                      {pokemon.altForm}
                    </span>
                  )}
                </div>

                <span className=' mt-2'>{pokemon.name.zh}</span>
                {/* {pokemon.altForm && (
                  <span className='text-xs -mt-2 text-gray-500'>{pokemon.altForm}</span>
                )} */}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { fetchPokemonData } from '@/services/pokemonService';
import type { Pokemon } from '@/types/pokemon';

interface PokemonNavigationProps {
  currentPokemonLink: string;
  onPokemonChange: (newLink: string) => Promise<void>;
}

function PokemonNavigation({ currentPokemonLink, onPokemonChange }: PokemonNavigationProps) {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const loadPokemonList = async () => {
      try {
        const data = await fetchPokemonData();
        setPokemonList(data);

        // Find current Pokemon index
        const index = data.findIndex((pokemon) => pokemon.link === currentPokemonLink);
        setCurrentIndex(index);
      } catch (error) {
        console.error('Failed to load Pokemon list:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPokemonList();
  }, [currentPokemonLink]);

  // Check screen size for responsive navigation
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint in Tailwind
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (loading || currentIndex === -1) {
    return null;
  }

  // Get navigation Pokemon - responsive count based on screen size
  const getNavigationPokemon = () => {
    const navPokemon: Pokemon[] = [];
    const totalPokemon = pokemonList.length;
    const sideCount = isMobile ? 2 : 3; // Mobile: 2 on each side, Desktop: 3 on each side

    for (let i = -sideCount; i <= sideCount; i++) {
      let index = currentIndex + i;

      // Handle circular navigation
      if (index < 0) {
        index = totalPokemon + index;
      } else if (index >= totalPokemon) {
        index = index - totalPokemon;
      }

      navPokemon.push(pokemonList[index]);
    }

    return navPokemon;
  };

  const navigationPokemon = getNavigationPokemon();
  const totalPokemon = pokemonList.length;

  // Get previous and next Pokemon for arrow navigation
  const getPreviousPokemon = () => {
    const prevIndex = currentIndex - 1 < 0 ? totalPokemon - 1 : currentIndex - 1;
    return pokemonList[prevIndex];
  };

  const getNextPokemon = () => {
    const nextIndex = currentIndex + 1 >= totalPokemon ? 0 : currentIndex + 1;
    return pokemonList[nextIndex];
  };

  const previousPokemon = getPreviousPokemon();
  const nextPokemon = getNextPokemon();

  const handlePokemonNavigation = (pokemonLink: string) => {
    onPokemonChange(pokemonLink);
  };

  return (
    <div className='flex items-center justify-center gap-4 py-4 bg-linear-to-r from-purple-100 to-blue-100 rounded-lg shadow-sm'>
      {/* Previous Arrow */}
      <button
        onClick={() => handlePokemonNavigation(previousPokemon.link)}
        className='flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 hover:bg-gray-50'
        title={`前往 ${previousPokemon.name.zh}`}
      >
        <ChevronLeft className='w-5 h-5 text-gray-600' />
      </button>

      {/* Pokemon Navigation List */}
      <div className={`flex items-center gap-2`}>
        {navigationPokemon.map((pokemon, index) => {
          const sideCount = isMobile ? 2 : 3;
          const isCurrent = index === sideCount; // Middle item is current (mobile: index 2, desktop: index 3)
          const pokemonNumber = pokemon.lumioseId.toString().padStart(3, '0');

          return (
            <button
              key={pokemon.link}
              onClick={() => handlePokemonNavigation(pokemon.link)}
              className={`flex flex-col items-center p-1 md:p-2 rounded-lg ${
                isCurrent
                  ? 'bg-yellow-200 shadow-md scale-110 border-2 border-yellow-400'
                  : 'bg-white hover:bg-gray-50 shadow-sm hover:shadow-md hover:scale-105'
              }`}
              title={pokemon.name.zh}
            >
              {/* Pokemon Icon */}
              <div
                className={`${
                  isMobile ? 'w-10 h-10' : 'w-12 h-12'
                } flex items-center justify-center`}
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/pmIcon/${pokemon.link}.png`}
                  alt={pokemon.name.zh}
                  className='w-full h-full object-contain'
                  onError={(e) => {
                    // Fallback to a placeholder or hide image
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Pokemon Name */}
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-center mt-1`}>
                <div className='text-gray-500'>#{pokemonNumber}</div>
                <div className={`font-medium ${isCurrent ? 'text-yellow-800' : 'text-gray-700'}`}>
                  {pokemon.name.zh}
                  {pokemon.altForm && (
                    <span className='font-light text-[10px]'>({pokemon.altForm})</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Next Arrow */}
      <button
        onClick={() => handlePokemonNavigation(nextPokemon.link)}
        className='flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 hover:bg-gray-50'
        title={`前往 ${nextPokemon.name.zh}`}
      >
        <ChevronRight className='w-5 h-5 text-gray-600' />
      </button>
    </div>
  );
}

export default PokemonNavigation;

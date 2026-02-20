import { trackCustomEvent, trackEvent } from '@/lib/analytics';
import { FromClass, ToClass } from '@/lib/color';
import { cn } from '@/lib/utils';
import type { Pokedex, Pokemon } from '@/types/pokemon';
import { Haze, Moon, Sun } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PokemonEVs from './EVs';
import PokemonImage from './Image';
import PokemonName from './Name';
import PokemonTypes from './Types';

interface PokemonCardProps {
  pokemon: Pokemon;
  isShiny?: boolean;
  isShowEV?: boolean;
  selectedZone?: string | null;
  isAlphaZone?: boolean;
  selectedPokedex: Pokedex;
}

// Weather emoji mapping
const weatherEmojis = {
  day: <Sun className='stroke-yellow-400 fill-yellow-300' />,
  night: <Moon className='stroke-white fill-gray-400' />,
  sunny: <Haze className='stroke-yellow-400 fill-yellow-300' />,
} as const;

// Weather combination display logic
const getWeatherDisplay = (weatherConditions: string[]) => {
  if (weatherConditions.length > 1) {
    const hasDay = weatherConditions.includes('day');
    const hasSunny = weatherConditions.includes('sunny');

    if (hasSunny && hasDay) {
      return [{ emoji: weatherEmojis.sunny, title: 'Sunny Day', key: 'sunny-day' }];
    }

    return weatherConditions.map((weather) => ({
      emoji: weatherEmojis[weather as keyof typeof weatherEmojis] || '❓',
      title: weather,
      key: weather,
    }));
  }

  return weatherConditions.map((weather) => ({
    emoji: weatherEmojis[weather as keyof typeof weatherEmojis] || '❓',
    title: weather,
    key: weather,
  }));
};

const PokemonCard = memo(function PokemonCard({
  pokemon,
  isShiny = false,
  isShowEV = false,
  selectedZone,
  isAlphaZone = false,
  selectedPokedex,
}: PokemonCardProps) {
  const location = useLocation();

  // Memoize expensive color class calculations
  const colorClasses = useMemo(() => {
    const primaryType = pokemon.type[0];
    const secondaryType = pokemon.type[1] || pokemon.type[0];

    return cn(
      FromClass[primaryType as keyof typeof FromClass],
      ToClass[secondaryType as keyof typeof ToClass],
    );
  }, [pokemon.type]);

  // Get weather info for the selected zone
  const weatherInfo = useMemo(() => {
    if (!selectedZone || !pokemon.zone) return null;

    const zoneId = parseInt(selectedZone, 10);
    const zoneData = pokemon.zone.find((zone) => zone.id === zoneId);

    if (!zoneData) return null;

    const specialWeather = zoneData.weather.filter((weather) => weather !== 'any');
    return specialWeather.length > 0 ? specialWeather : null;
  }, [selectedZone, pokemon.zone]);

  const handleClick = () => {
    // Store current URL (including search params) for the back button
    const currentUrl = location.pathname + location.search;
    sessionStorage.setItem('pokemonListReferrer', currentUrl);

    // Track Pokemon card click
    trackEvent('click', 'pokemon_card', pokemon.name.en);

    // Track custom event with more details
    trackCustomEvent('pokemon_card_click', {
      pokemon_name: pokemon.name.en,
      pokemon_id: pokemon.lumioseId,
      pokemon_type_primary: pokemon.type[0],
      pokemon_type_secondary: pokemon.type[1] || null,
      page_location: location.pathname,
    });
  };

  const pokedexId =
    selectedPokedex === 'national'
      ? pokemon.pid
      : selectedPokedex === 'lumiose'
        ? pokemon.lumioseId
        : pokemon.hyperspaceId || pokemon.pid;

  return (
    <Link
      to={`/pokemon/${pokemon.link}`}
      className='group cursor-pointer w-fit'
      onClick={handleClick}
    >
      <div
        className={cn(
          'px-2 md:px-4 pt-2 md:pt-4 pb-3 flex flex-col gap-3 items-center relative',
          'rounded-tr-2xl rounded-bl-2xl md:rounded-tr-3xl md:rounded-bl-3xl',
          'shadow-list-items',
          'bg-linear-to-tl to-pokemon-fighting',
          colorClasses,
          'transition-all duration-300 ease-in-out',
          'hover:shadow-xl hover:-translate-y-2 hover:bg-sky-200/60',
        )}
      >
        <PokemonImage pokemon={pokemon} pokedexId={pokedexId} isShiny={isShiny} />
        {/* Weather indicator or Alpha indicator */}
        {selectedZone && (
          <div className='absolute top-1 right-1 flex gap-1'>
            {isAlphaZone ? (
              // Show Alpha indicator when using Alpha Zone filter
              <div className='flex items-center'>
                <PokemonTypes types={['Alpha']} className='w-10 h-10' />
              </div>
            ) : (
              // Show weather info when using normal zone filter
              weatherInfo &&
              getWeatherDisplay(weatherInfo).map((weatherDisplay) => (
                <span
                  key={weatherDisplay.key}
                  className={cn(
                    'rounded-full w-10 h-10 flex items-center justify-center',
                    weatherDisplay.title.includes('day') || weatherDisplay.title.includes('Sunny')
                      ? 'bg-sky-600'
                      : 'bg-blue-900',
                  )}
                  title={`Available during ${weatherDisplay.title}`}
                >
                  {weatherDisplay.emoji}
                </span>
              ))
            )}
          </div>
        )}
        <PokemonName name={pokemon.name.zh} />
        <PokemonTypes types={pokemon.type} />
        {isShowEV && <PokemonEVs ev={pokemon.ev} />}
      </div>
    </Link>
  );
});

export default PokemonCard;

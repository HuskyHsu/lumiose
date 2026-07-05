import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

import { useCaught } from '@/contexts/CaughtContext';
import { trackCustomEvent, trackPageView } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { fetchPokemonDetail } from '@/services/pokemonService';
import type { DetailedPokemon } from '@/types/pokemon';

import {
  BackButton,
  BasicInfo,
  EvolutionCard,
  MovesCard,
  PokemonNavigation,
  StatsCard,
} from './components';
import QuickNavigation from './components/QuickNavigation';

function PokemonDetail() {
  const { link } = useParams<{ link: string }>();
  const location = useLocation();
  const previousLocationRef = useRef<string | null>(null);
  const [currentLink, setCurrentLink] = useState<string>(link || '');
  const [pokemon, setPokemon] = useState<DetailedPokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isCaught, toggleCaught } = useCaught();
  const caught = pokemon ? isCaught(pokemon.link) : false;

  const loadPokemonDetail = async (pokemonLink: string) => {
    try {
      setLoading(true);
      const data = await fetchPokemonDetail(pokemonLink);
      setPokemon(data);
      setError(null);

      // Track Pokemon detail page view
      if (data) {
        // Set page title with Chinese and English names
        const pageTitle = `${data.name.zh} ${data.name.en} - Pokédex`;
        document.title = pageTitle;

        trackPageView(`/pokemon/${pokemonLink}`, pageTitle);

        // Track custom event for Pokemon detail view
        trackCustomEvent('pokemon_detail_view', {
          pokemon_name: data.name.en,
          pokemon_id: data.lumioseId,
          pokemon_type_primary: data.type[0],
          pokemon_type_secondary: data.type[1] || null,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Pokemon details');
    } finally {
      setLoading(false);
    }
  };

  const handlePokemonChange = async (newLink: string) => {
    if (newLink === currentLink) return;

    // Track Pokemon navigation
    trackCustomEvent('pokemon_navigation', {
      from_pokemon: currentLink,
      to_pokemon: newLink,
      navigation_type: 'pokemon_detail_navigation',
    });

    // Update URL without triggering route change
    window.history.replaceState(null, '', `${import.meta.env.BASE_URL}#/pokemon/${newLink}`);

    // Update current link state
    setCurrentLink(newLink);

    // Load new Pokemon data
    await loadPokemonDetail(newLink);
  };

  useEffect(() => {
    if (!link) {
      setError('Pokemon ID not provided');
      setLoading(false);
      return;
    }

    // Check if we should scroll to top
    const currentPath = location.pathname;
    const previousPath = previousLocationRef.current;

    // Scroll to top if:
    // 1. Coming from home page (previous path was '/' or '/home')
    // 2. Or if there's no previous path (direct navigation/refresh)
    // 3. But NOT if navigating within the same Pokemon detail page
    const shouldScrollToTop =
      !previousPath || // First load or refresh
      previousPath === '/' ||
      previousPath.startsWith('/home') || // Coming from home
      (!previousPath.startsWith('/pokemon/') && !currentPath.includes(previousPath)); // Coming from other pages

    if (shouldScrollToTop && previousPath !== currentPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update previous path reference
    previousLocationRef.current = currentPath;

    setCurrentLink(link);
    loadPokemonDetail(link);
  }, [link, location.pathname]);

  if (loading && pokemon === null) {
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
      <div className='flex items-center justify-between gap-4 flex-wrap'>
        <BackButton />
        <button
          onClick={() => {
            if (pokemon) {
              toggleCaught(pokemon.link);
              trackCustomEvent('pokemon_caught_toggle', {
                pokemon_name: pokemon.name.en,
                pokemon_id: pokemon.lumioseId,
                is_caught: !caught,
                location: 'detail_page',
              });
            }
          }}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer',
            caught
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 shadow-emerald-100'
              : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
          )}
        >
          <img
            src={`${import.meta.env.BASE_URL}images/type/PokemonBall.png`}
            className={cn('w-5 h-5 transition-transform duration-300', caught ? 'rotate-360' : 'grayscale opacity-60')}
          />
          <span>{caught ? 'Caught' : 'Mark as Caught'}</span>
        </button>
      </div>
      <PokemonNavigation currentPokemonLink={currentLink} onPokemonChange={handlePokemonChange} />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div id='basic-info'>
          <BasicInfo pokemon={pokemon} loading={loading} />
        </div>
        <div id='stats'>
          <StatsCard pokemon={pokemon} />
        </div>
        <div id='moves' className='col-span-1 md:col-span-2'>
          <MovesCard pokemon={pokemon} />
        </div>
        {pokemon.evolutionTree && (
          <div id='evolution' className='col-span-1 md:col-span-2'>
            <EvolutionCard pokemon={pokemon} onPokemonChange={handlePokemonChange} />
          </div>
        )}
      </div>
      <QuickNavigation hasEvolution={!!pokemon.evolutionTree} />
    </div>
  );
}

export default PokemonDetail;

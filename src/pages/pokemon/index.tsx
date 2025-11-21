import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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

function PokemonDetail() {
  const { link } = useParams<{ link: string }>();
  const location = useLocation();
  const previousLocationRef = useRef<string | null>(null);
  const [currentLink, setCurrentLink] = useState<string>(link || '');
  const [pokemon, setPokemon] = useState<DetailedPokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPokemonDetail = async (pokemonLink: string) => {
    try {
      setLoading(true);
      const data = await fetchPokemonDetail(pokemonLink);
      setPokemon(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Pokemon details');
    } finally {
      setLoading(false);
    }
  };

  const handlePokemonChange = async (newLink: string) => {
    if (newLink === currentLink) return;

    // Update URL without triggering route change
    window.history.replaceState(null, '', `/pokemon/${newLink}`);

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
      <BackButton />
      <PokemonNavigation currentPokemonLink={currentLink} onPokemonChange={handlePokemonChange} />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <BasicInfo pokemon={pokemon} />
        <StatsCard pokemon={pokemon} />
        <MovesCard pokemon={pokemon} />
        {pokemon.evolutionTree && (
          <EvolutionCard pokemon={pokemon} onPokemonChange={handlePokemonChange} />
        )}
      </div>
    </div>
  );
}

export default PokemonDetail;

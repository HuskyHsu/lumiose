import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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

    setCurrentLink(link);
    loadPokemonDetail(link);
  }, [link]);

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

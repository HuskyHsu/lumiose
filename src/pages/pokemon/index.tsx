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
  PokemonHeader,
  PokemonNavigation,
  StatsCard,
} from './components';

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
      <PokemonNavigation currentPokemonLink={link!} />
      <PokemonHeader pokemon={pokemon} />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <BasicInfo pokemon={pokemon} />
        <StatsCard pokemon={pokemon} />
        <MovesCard pokemon={pokemon} />
        {pokemon.evolutionTree && <EvolutionCard pokemon={pokemon} />}
      </div>
    </div>
  );
}

export default PokemonDetail;

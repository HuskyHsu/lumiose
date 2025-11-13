import { PokemonCard } from '@/components/pokemon';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { usePokemonData } from '@/hooks/usePokemonData';
import type { PokemonList } from '@/types/pokemon';

function Home() {
  const { pokemonList, loading, error } = usePokemonData();

  return (
    <div className='space-y-6'>
      <PageHeader />
      <PageContent loading={loading} error={error} pokemonList={pokemonList} />
    </div>
  );
}

function PageHeader() {
  return <h1 className='text-3xl font-bold'>PokeDex</h1>;
}

interface PageContentProps {
  loading: boolean;
  error: string | null;
  pokemonList: PokemonList;
}

function PageContent({ loading, error, pokemonList }: PageContentProps) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return <PokemonGrid pokemonList={pokemonList} />;
}

interface PokemonGridProps {
  pokemonList: PokemonList;
}

function PokemonGrid({ pokemonList }: PokemonGridProps) {
  return (
    <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 justify-items-center gap-x-3 gap-y-8 text-slate-800'>
      {pokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.link} pokemon={pokemon} />
      ))}
    </div>
  );
}

export default Home;

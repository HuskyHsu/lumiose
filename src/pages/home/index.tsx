import { PokemonCard } from '@/components/pokemon';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SearchFilter } from '@/components/ui/SearchFilter';
import { TypeFilter } from '@/components/ui/TypeFilter';
import { usePokemonData } from '@/hooks/usePokemonData';
import { usePokemonFilter } from '@/hooks/usePokemonFilter';
import type { PokemonList } from '@/types/pokemon';
import { memo } from 'react';

function Home() {
  const { pokemonList, loading, error } = usePokemonData();
  const { selectedTypes, setSelectedTypes, searchKeyword, setSearchKeyword, filteredPokemonList } =
    usePokemonFilter(pokemonList);

  return (
    <div className='space-y-6'>
      <PageHeader />
      <SearchFilter searchKeyword={searchKeyword} onSearchChange={setSearchKeyword} />
      <TypeFilter selectedTypes={selectedTypes} onTypeChange={setSelectedTypes} />
      <PageContent loading={loading} error={error} pokemonList={filteredPokemonList} />
    </div>
  );
}

function PageHeader() {
  return <h1 className='text-3xl font-bold'>Lumiose PokeDex</h1>;
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

const PokemonGrid = memo(function PokemonGrid({ pokemonList }: PokemonGridProps) {
  return (
    <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 justify-items-center gap-x-3 gap-y-8 text-slate-800 transition-all duration-200 ease-in-out'>
      {pokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.link} pokemon={pokemon} />
      ))}
    </div>
  );
});

export default Home;

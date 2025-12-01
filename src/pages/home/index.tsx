import { PokemonCard } from '@/components/pokemon';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ShareButton } from '@/components/ui/share-button';
import { usePokemonData } from '@/hooks/usePokemonData';
import { usePokemonFilter } from '@/hooks/usePokemonFilter';
import { useShinyToggle } from '@/hooks/useShinyToggle';
import type { PokemonList } from '@/types/pokemon';
import { memo } from 'react';
import {
  FinalFormToggle,
  PWAInstallButton,
  SearchFilter,
  ShinyToggle,
  TypeFilter,
  ZoneFilter,
} from './components';

function Home() {
  const { pokemonList, loading, error } = usePokemonData();
  const {
    selectedTypes,
    setSelectedTypes,
    searchKeyword,
    setSearchKeyword,
    selectedZone,
    setSelectedZone,
    isFinalFormOnly,
    toggleFinalFormOnly,
    isAlphaZone,
    toggleAlphaZone,
    filteredPokemonList,
  } = usePokemonFilter(pokemonList);
  const { isShiny, toggleShiny } = useShinyToggle();

  return (
    <div className='space-y-6'>
      <PageHeader />
      <PWAInstallButton />
      {/* <PWAStatus /> */}
      <SearchFilter searchKeyword={searchKeyword} onSearchChange={setSearchKeyword} />
      <TypeFilter selectedTypes={selectedTypes} onTypeChange={setSelectedTypes} />
      <ZoneFilter
        selectedZone={selectedZone}
        onZoneChange={setSelectedZone}
        isAlphaZone={isAlphaZone}
        onAlphaZoneToggle={toggleAlphaZone}
      />
      <div className='flex gap-4'>
        <ShinyToggle isShiny={isShiny} onToggle={toggleShiny} />
        <FinalFormToggle isFinalFormOnly={isFinalFormOnly} onToggle={toggleFinalFormOnly} />
      </div>
      <PageContent
        loading={loading}
        error={error}
        pokemonList={filteredPokemonList}
        isShiny={isShiny}
        selectedZone={selectedZone}
        isAlphaZone={isAlphaZone}
      />
    </div>
  );
}

function PageHeader() {
  return (
    <h1 className='flex items-end gap-2 text-3xl font-bold'>
      <img src={`${import.meta.env.BASE_URL}images/appIcon/mega_symbol.svg`} className='w-8 h-8' />
      Lumiose Pokédex
      <ShareButton title='Lumiose Pokédex' />
    </h1>
  );
}

interface PageContentProps {
  loading: boolean;
  error: string | null;
  pokemonList: PokemonList;
  isShiny: boolean;
  selectedZone: string;
  isAlphaZone: boolean;
}

function PageContent({
  loading,
  error,
  pokemonList,
  isShiny,
  selectedZone,
  isAlphaZone,
}: PageContentProps) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <PokemonGrid
      pokemonList={pokemonList}
      isShiny={isShiny}
      selectedZone={selectedZone}
      isAlphaZone={isAlphaZone}
    />
  );
}

interface PokemonGridProps {
  pokemonList: PokemonList;
  isShiny: boolean;
  selectedZone: string;
  isAlphaZone: boolean;
}

const PokemonGrid = memo(function PokemonGrid({
  pokemonList,
  isShiny,
  selectedZone,
  isAlphaZone,
}: PokemonGridProps) {
  return (
    <div className='grid grid-cols-3 sm:grid-cols-4 mt-4 md:grid-cols-5 lg:grid-cols-7 justify-items-center gap-x-3 gap-y-8 text-slate-800 transition-all duration-200 ease-in-out'>
      {pokemonList.map((pokemon) => (
        <PokemonCard
          key={pokemon.link}
          pokemon={pokemon}
          isShiny={isShiny}
          selectedZone={selectedZone}
          isAlphaZone={isAlphaZone}
        />
      ))}
    </div>
  );
});

export default Home;

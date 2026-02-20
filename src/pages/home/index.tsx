import { PokemonCard } from '@/components/pokemon';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ShareButton } from '@/components/ui/share-button';
import { useEVToggle } from '@/hooks/useEVToggle';
import { usePokemonData } from '@/hooks/usePokemonData';
import { usePokemonFilter } from '@/hooks/usePokemonFilter';
import { useShinyToggle } from '@/hooks/useShinyToggle';
import PageViewToggle from '@/pages/move/components/PageViewToggle';
import type { Pokedex, PokemonList } from '@/types/pokemon';
import { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DistortionFilter,
  EVFilter,
  EVToggle,
  FinalFormToggle,
  PokedexToggle,
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
    selectedPokedex,
    setSelectedPokedex,
    filteredPokemonList,
    selectedEVStat,
    setSelectedEVStat,
    selectedDistortion,
    setSelectedDistortion,
  } = usePokemonFilter(pokemonList);
  const { isShiny, toggleShiny } = useShinyToggle();
  const { isShowEV, toggleEV } = useEVToggle();

  useEffect(() => {
    document.title = 'Lumiose Pokédex App';
  }, []);

  return (
    <div className='space-y-6'>
      <PageHeader />
      <PWAInstallButton />
      <PageViewToggle />
      <PokedexToggle selectedPokedex={selectedPokedex} onPokedexChange={setSelectedPokedex} />
      <SearchFilter searchKeyword={searchKeyword} onSearchChange={setSearchKeyword} />
      <TypeFilter selectedTypes={selectedTypes} onTypeChange={setSelectedTypes} />
      {selectedPokedex === 'lumiose' && (
        <ZoneFilter
          selectedZone={selectedZone}
          onZoneChange={setSelectedZone}
          isAlphaZone={isAlphaZone}
          onAlphaZoneToggle={toggleAlphaZone}
        />
      )}
      <DistortionFilter
        selectedDistortion={selectedDistortion}
        onDistortionChange={setSelectedDistortion}
      />
      <div className='flex gap-4 mb-2'>
        <ShinyToggle isShiny={isShiny} onToggle={toggleShiny} />
        <FinalFormToggle isFinalFormOnly={isFinalFormOnly} onToggle={toggleFinalFormOnly} />
        <EVToggle isShowEV={isShowEV} onToggle={toggleEV} />
      </div>
      {isShowEV && <EVFilter selectedEVStat={selectedEVStat} onSelectEVStat={setSelectedEVStat} />}
      <PageContent
        loading={loading}
        error={error}
        pokemonList={filteredPokemonList}
        isShiny={isShiny}
        isShowEV={isShowEV}
        selectedZone={selectedZone}
        isAlphaZone={isAlphaZone}
        selectedPokedex={selectedPokedex}
      />
    </div>
  );
}

function PageHeader() {
  return (
    <h1 className='flex items-end gap-2 text-3xl font-bold'>
      <img src={`${import.meta.env.BASE_URL}images/appIcon/mega_symbol.svg`} className='w-8 h-8' />
      <Link to={`/`}>Lumiose Pokédex</Link>
      <ShareButton title='Lumiose Pokédex' />
    </h1>
  );
}

interface PageContentProps {
  loading: boolean;
  error: string | null;
  pokemonList: PokemonList;
  isShiny: boolean;
  isShowEV: boolean;
  selectedZone: string;
  isAlphaZone: boolean;
  selectedPokedex: Pokedex;
}

function PageContent({
  loading,
  error,
  pokemonList,
  isShiny,
  isShowEV,
  selectedZone,
  isAlphaZone,
  selectedPokedex,
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
      isShowEV={isShowEV}
      selectedZone={selectedZone}
      isAlphaZone={isAlphaZone}
      selectedPokedex={selectedPokedex}
    />
  );
}

interface PokemonGridProps {
  pokemonList: PokemonList;
  isShiny: boolean;
  isShowEV: boolean;
  selectedZone: string;
  isAlphaZone: boolean;
  selectedPokedex: Pokedex;
}

const PokemonGrid = memo(function PokemonGrid({
  pokemonList,
  isShiny,
  isShowEV,
  selectedZone,
  isAlphaZone,
  selectedPokedex,
}: PokemonGridProps) {
  return (
    <div className='grid grid-cols-3 sm:grid-cols-4 mt-4 md:grid-cols-5 lg:grid-cols-7 justify-items-center gap-x-3 gap-y-8 text-slate-800 transition-all duration-200 ease-in-out'>
      {pokemonList
        .sort((a, b) => {
          if (selectedPokedex === 'national') {
            return a.pid - b.pid;
          } else {
            return a.lumioseId - b.lumioseId;
          }
        })
        .map((pokemon) => (
          <PokemonCard
            key={pokemon.link}
            pokemon={pokemon}
            isShiny={isShiny}
            isShowEV={isShowEV}
            selectedZone={selectedZone}
            isAlphaZone={isAlphaZone}
            selectedPokedex={selectedPokedex}
          />
        ))}
    </div>
  );
});

export default Home;

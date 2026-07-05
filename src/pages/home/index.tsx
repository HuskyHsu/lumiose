import { CompactCard, PokemonCard } from '@/components/pokemon';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ShareButton } from '@/components/ui/share-button';
import { useEVToggle } from '@/hooks/useEVToggle';
import { usePokemonData } from '@/hooks/usePokemonData';
import { usePokemonFilter } from '@/hooks/usePokemonFilter';
import { useShinyToggle } from '@/hooks/useShinyToggle';
import { useUrlParams } from '@/hooks/useUrlParams';
import PageViewToggle from '@/pages/move/components/PageViewToggle';
import type { Pokedex, PokemonList, Pokemon } from '@/types/pokemon';
import { memo, useEffect, useMemo } from 'react';
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
  LayoutToggle,
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
  const { getParam, setParam } = useUrlParams();
  const layout = (getParam('layout') as 'grid' | 'minimalist') || 'grid';

  const handleLayoutChange = (newLayout: 'grid' | 'minimalist') => {
    setParam('layout', newLayout === 'grid' ? null : newLayout);
  };

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
      <div className='flex justify-between items-center gap-4 mb-2 flex-wrap'>
        <div className='flex gap-4'>
          <ShinyToggle isShiny={isShiny} onToggle={toggleShiny} />
          <FinalFormToggle isFinalFormOnly={isFinalFormOnly} onToggle={toggleFinalFormOnly} />
          <EVToggle isShowEV={isShowEV} onToggle={toggleEV} />
        </div>
        <LayoutToggle layout={layout} onLayoutChange={handleLayoutChange} />
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
        layout={layout}
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
  layout: 'grid' | 'minimalist';
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
  layout,
}: PageContentProps) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (layout === 'minimalist') {
    return (
      <PokemonMinimalistList
        pokemonList={pokemonList}
        isShiny={isShiny}
        selectedPokedex={selectedPokedex}
      />
    );
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

const getPokedexId = (pokemon: Pokemon, selectedPokedex: Pokedex) => {
  return selectedPokedex === 'national'
    ? pokemon.pid
    : selectedPokedex === 'lumiose'
      ? pokemon.lumioseId
      : pokemon.hyperspaceId || pokemon.pid;
};

interface Group {
  startId: number;
  endId: number;
  pokemon: Pokemon[];
}

interface PokemonMinimalistListProps {
  pokemonList: PokemonList;
  isShiny: boolean;
  selectedPokedex: Pokedex;
}

const PokemonMinimalistList = memo(function PokemonMinimalistList({
  pokemonList,
  isShiny,
  selectedPokedex,
}: PokemonMinimalistListProps) {
  const sortedPokemon = useMemo(() => {
    return [...pokemonList].sort((a, b) => {
      const idA = getPokedexId(a, selectedPokedex);
      const idB = getPokedexId(b, selectedPokedex);
      return idA - idB;
    });
  }, [pokemonList, selectedPokedex]);

  const groups = useMemo(() => {
    const list: Group[] = [];
    let currentGroupPokemon: Pokemon[] = [];
    let currentGroupUniqueIds = new Set<number>();

    for (const pokemon of sortedPokemon) {
      const id = getPokedexId(pokemon, selectedPokedex);

      if (currentGroupUniqueIds.size >= 20 && !currentGroupUniqueIds.has(id)) {
        const sortedIds = Array.from(currentGroupUniqueIds).sort((a, b) => a - b);
        list.push({
          startId: sortedIds[0],
          endId: sortedIds[sortedIds.length - 1],
          pokemon: currentGroupPokemon,
        });
        currentGroupPokemon = [];
        currentGroupUniqueIds = new Set<number>();
      }

      currentGroupPokemon.push(pokemon);
      currentGroupUniqueIds.add(id);
    }

    if (currentGroupPokemon.length > 0) {
      const sortedIds = Array.from(currentGroupUniqueIds).sort((a, b) => a - b);
      list.push({
        startId: sortedIds[0],
        endId: sortedIds[sortedIds.length - 1],
        pokemon: currentGroupPokemon,
      });
    }
    return list;
  }, [sortedPokemon, selectedPokedex]);

  if (groups.length === 0) {
    return (
      <div className='text-center py-12 text-slate-500 font-semibold bg-white rounded-2xl border border-slate-100 shadow-xs mt-4'>
        No Pokémon found matching the filters.
      </div>
    );
  }

  return (
    <div className='space-y-6 mt-4'>
      {groups.map((group, index) => (
        <div key={index} className='bg-slate-50/50 rounded-2xl p-4 md:p-6 border border-slate-200/60 shadow-xs'>
          <div className='flex items-center gap-2 mb-4 pb-2 border-b border-slate-200/60'>
            <span className='w-2 h-2 rounded-full bg-emerald-500' />
            <h3 className='text-md font-bold text-slate-800 tracking-wide'>
              No. {group.startId} - {group.endId}
            </h3>
            <span className='text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-200/50 text-slate-500 ml-1'>
              {group.pokemon.length} Pokémon
            </span>
          </div>

          <div className='grid grid-cols-6 justify-items-stretch gap-1.5 sm:gap-3'>
            {group.pokemon.map((pokemon) => {
              const id = getPokedexId(pokemon, selectedPokedex);
              return (
                <CompactCard
                  key={pokemon.link}
                  pokemon={pokemon}
                  pokedexId={id}
                  isShiny={isShiny}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
});

export default Home;

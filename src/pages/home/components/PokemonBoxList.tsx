import { CompactCard } from '@/components/pokemon';
import type { Pokedex, Pokemon, PokemonList } from '@/types/pokemon';
import { Package } from 'lucide-react';
import { memo, useMemo } from 'react';

const getPokedexId = (pokemon: Pokemon, selectedPokedex: Pokedex): number => {
  if (selectedPokedex === 'national') {
    return pokemon.pid;
  } else if (selectedPokedex === 'hyperspace') {
    return pokemon.hyperspaceId as number;
  } else {
    return pokemon.lumioseId as number;
  }
};

// Define keywords to exclude specific forms (e.g. temporary forms like MEGA) from the minimalist layout.
// You can manually adjust this array to filter out other forms.
const MINIMALIST_EXCLUDE_FORMS = ['mega', '覺悟', '舞步', '卡帶', '解放', '原始', '現形', '%'];

interface Group {
  boxIndex: number;
  startId: number;
  endId: number;
  slots: (Pokemon | null)[];
}

interface PokemonBoxListProps {
  pokemonList: PokemonList;
  filteredPokemonList: PokemonList;
  isShiny: boolean;
  selectedPokedex: Pokedex;
}

export const PokemonBoxList = memo(function PokemonBoxList({
  pokemonList,
  filteredPokemonList,
  isShiny,
  selectedPokedex,
}: PokemonBoxListProps) {
  const filteredLinks = useMemo(() => {
    return new Set(filteredPokemonList.map((p) => p.link));
  }, [filteredPokemonList]);

  const groups = useMemo(() => {
    const list: Group[] = [];
    const boxMap = new Map<number, Pokemon[]>();
    let maxBoxIndex = -1;

    // Filter and sort the full list to determine absolute box positions
    const sortedPokemon = [...pokemonList]
      .filter((pokemon) => {
        if (!pokemon.altForm) return true;
        const altFormLower = pokemon.altForm.toLowerCase();
        return !MINIMALIST_EXCLUDE_FORMS.some((keyword) =>
          altFormLower.includes(keyword.toLowerCase()),
        );
      })
      .sort((a, b) => {
        const idA = getPokedexId(a, selectedPokedex);
        const idB = getPokedexId(b, selectedPokedex);
        return idA - idB;
      });

    for (const pokemon of sortedPokemon) {
      const id = getPokedexId(pokemon, selectedPokedex);
      // Group by 20 Pokedex IDs
      const boxIndex = Math.floor((id - 1) / 20);

      if (!boxMap.has(boxIndex)) {
        boxMap.set(boxIndex, []);
      }
      boxMap.get(boxIndex)!.push(pokemon);
      if (boxIndex > maxBoxIndex) {
        maxBoxIndex = boxIndex;
      }
    }

    for (let i = 0; i <= maxBoxIndex; i++) {
      const pokemonsInBox = boxMap.get(i) || [];
      const slots: (Pokemon | null)[] = Array(30).fill(null);

      pokemonsInBox.forEach((pokemon, index) => {
        if (index < 30) {
          slots[index] = pokemon;
        }
        // If > 30, it overflows and we just drop them for now (since we assume 30 is max)
      });

      list.push({
        boxIndex: i,
        startId: i * 20 + 1,
        endId: i * 20 + 20,
        slots,
      });
    }

    return list;
  }, [pokemonList, selectedPokedex]);

  if (groups.length === 0) {
    return (
      <div className='text-center py-12 text-slate-500 font-semibold bg-white rounded-2xl border border-slate-100 shadow-xs mt-4'>
        No Pokémon found matching the filters.
      </div>
    );
  }

  return (
    <div className='space-y-6 mt-4'>
      {groups.map((group) => (
        <div
          key={group.boxIndex}
          className='bg-slate-50/50 rounded-2xl p-4 md:p-6 border border-slate-200/60 shadow-xs'
        >
          <div className='flex items-center gap-2 mb-4 pb-2 border-b border-slate-200/60'>
            <Package className='w-4 h-4 text-emerald-500' />
            <h3 className='text-md font-bold text-slate-800 tracking-wide'>
              Box {group.boxIndex + 1} (No. {group.startId} - {group.endId})
            </h3>
          </div>

          <div className='grid grid-cols-6 grid-rows-5 justify-items-stretch gap-1.5 sm:gap-3'>
            {group.slots.map((pokemon, slotIndex) => {
              const row = Math.floor(slotIndex / 6);
              const col = slotIndex % 6;
              const coordinate = { row, col };

              if (!pokemon) {
                return (
                  <div
                    key={`empty-${slotIndex}`}
                    className='flex flex-col items-center justify-center p-1 sm:p-2 rounded-xl border border-dashed border-slate-300 bg-slate-100/50 min-h-[56px] sm:min-h-[80px]'
                  >
                    <span className='text-[9px] sm:text-[11px] font-medium text-slate-400'>
                      R{row + 1} C{col + 1}
                    </span>
                  </div>
                );
              }

              const id = getPokedexId(pokemon, selectedPokedex);
              const isVisible = filteredLinks.has(pokemon.link);

              return (
                <CompactCard
                  key={pokemon.link}
                  pokemon={pokemon}
                  pokedexId={id}
                  isShiny={isShiny}
                  isSilhouette={!isVisible}
                  slotCoordinate={coordinate}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
});

export default PokemonBoxList;

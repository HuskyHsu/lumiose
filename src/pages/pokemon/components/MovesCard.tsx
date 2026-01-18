import { PokemonTypes } from '@/components/pokemon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { DetailedPokemon } from '@/types/pokemon';
import { useState } from 'react';
import MoveRow from './MoveRow';

interface MovesCardProps {
  pokemon: DetailedPokemon;
}

export default function MovesCard({ pokemon }: MovesCardProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allMoves = [
    ...(pokemon.alphaMove ? [pokemon.alphaMove] : []),
    ...pokemon.levelUpMoves,
    ...pokemon.tmMoves,
  ];

  const uniqueTypes = Array.from(new Set(allMoves.map((m) => m.type))).sort();
  const categories = ['Physical', 'Special', 'Status'];

  const filterMove = (
    move:
      | DetailedPokemon['levelUpMoves'][0]
      | DetailedPokemon['tmMoves'][0]
      | DetailedPokemon['alphaMove'],
  ) => {
    if (!move) return false;
    const typeMatch = selectedType === null || move.type === selectedType;
    const categoryMatch = selectedCategory === null || move.category === selectedCategory;
    return typeMatch && categoryMatch;
  };

  const toggleType = (type: string) => {
    setSelectedType((prev) => (prev === type ? null : type));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  return (
    <Card className='lg:col-span-2'>
      <CardHeader>
        <CardTitle>Moves</CardTitle>
      </CardHeader>
      <CardContent className='px-0 md:px-6'>
        <div className='mb-6 -mt-4 space-y-4 px-6 md:px-0'>
          <p className='text-sm font-semibold'>Type:</p>
          <div className='flex flex-wrap gap-2 items-center'>
            {uniqueTypes.map((type) => {
              const isSelected = selectedType === type;
              const shouldFade = selectedType !== null && !isSelected;

              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={cn(
                    'flex items-center justify-center rounded-lg transition-all duration-100',
                    shouldFade ? 'opacity-30' : 'opacity-100',
                    'hover:scale-110 active:scale-90',
                  )}
                  title={type}
                >
                  <PokemonTypes types={[type]} className='w-8 h-8' />
                </button>
              );
            })}
          </div>
          <p className='text-sm font-semibold'>Category:</p>
          <div className='flex flex-wrap gap-2 items-center'>
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              const shouldFade = selectedCategory !== null && !isSelected;

              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    'flex items-center justify-center rounded-lg transition-all duration-100',
                    'border-gray-200 bg-white hover:border-gray-300 border',
                    shouldFade ? 'opacity-30' : 'opacity-100',
                    'hover:scale-110 active:scale-90',
                  )}
                  title={category}
                >
                  <PokemonTypes types={[category]} className='w-8 h-8' />
                </button>
              );
            })}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 text-center'>
          <div>
            <h4 className='font-semibold mb-3'>Level Up Moves</h4>
            <Table>
              <TableHeader>
                <TableRow className=''>
                  <TableHead className='w-2/12'>
                    Lv<span className='text-xs font-light italic'>+plus</span>
                  </TableHead>
                  <TableHead className='w-1/12'>TM</TableHead>
                  <TableHead className='w-3/12'>Name</TableHead>
                  <TableHead className='w-1/12'>Type</TableHead>
                  <TableHead className='w-1/12'>Cat.</TableHead>
                  <TableHead className='w-2/12'>Att.</TableHead>
                  <TableHead className='w-2/12'>CD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pokemon.alphaMove && filterMove(pokemon.alphaMove) && (
                  <MoveRow moveId={pokemon.alphaMove.id} colSpan={7}>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={['Alpha']} />
                      </div>
                    </TableCell>
                    <TableCell>
                      {pokemon.tmMoves
                        .find((tm) => tm.id === pokemon.alphaMove?.id)
                        ?.tm.toString()
                        .padStart(3, '0')}
                    </TableCell>
                    <TableCell>
                      {
                        <a
                          href={`https://wiki.52poke.com/zh-hant/${pokemon.alphaMove.name.zh}（招式）`}
                          target='_blank'
                          rel='noreferrer'
                          className='inline text-blue-800 underline'
                        >
                          {pokemon.alphaMove.name.zh}
                        </a>
                      }
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[pokemon.alphaMove.type]} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[pokemon.alphaMove.category]} />
                      </div>
                    </TableCell>
                    <TableCell>
                      {pokemon.alphaMove.power <= 0 ? '—' : pokemon.alphaMove.power}
                    </TableCell>
                    <TableCell>{pokemon.alphaMove.cooldown}</TableCell>
                  </MoveRow>
                )}

                {pokemon.levelUpMoves.filter(filterMove).map((move) => {
                  const from = move.level > 1 ? move.level : move.level === 0 ? 'Evolve' : '—';
                  const subInfo = `+${move.plus}`;
                  const TM = pokemon.tmMoves.find((tm) => tm.id === move.id);

                  return (
                    <MoveRow key={move.id} moveId={move.id} colSpan={7}>
                      <TableCell className='flex gap-0 justify-center items-end'>
                        {from}
                        <span className='text-xs font-light italic'>{subInfo}</span>
                      </TableCell>
                      <TableCell>{TM?.tm.toString().padStart(3, '0')}</TableCell>
                      <TableCell>
                        <a
                          href={`https://wiki.52poke.com/zh-hant/${move.name.zh}（招式）`}
                          target='_blank'
                          rel='noreferrer'
                          className='inline text-blue-800 underline'
                        >
                          {move.name.zh}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className='flex justify-center'>
                          <PokemonTypes types={[move.type]} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex justify-center'>
                          <PokemonTypes types={[move.category]} />
                        </div>
                      </TableCell>
                      <TableCell>{move.power <= 0 ? '—' : move.power}</TableCell>
                      <TableCell>{move.cooldown}</TableCell>
                    </MoveRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div>
            <h4 className='font-semibold mb-3'>TM Moves</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-2/12'>TM</TableHead>
                  <TableHead className='w-3/12'>Name</TableHead>
                  <TableHead className='w-1/12'>Type</TableHead>
                  <TableHead className='w-2/12'>Cat.</TableHead>
                  <TableHead className='w-2/12'>Att.</TableHead>
                  <TableHead className='w-2/12'>CD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pokemon.tmMoves.filter(filterMove).map((move) => (
                  <MoveRow key={move.id} moveId={move.id} colSpan={6}>
                    <TableCell>{move.tm.toString().padStart(3, '0')}</TableCell>
                    <TableCell>
                      <a
                        href={`https://wiki.52poke.com/zh-hant/${move.name.zh}（招式）`}
                        target='_blank'
                        rel='noreferrer'
                        className='inline text-blue-800 underline'
                      >
                        {move.name.zh}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.type]} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <PokemonTypes types={[move.category]} />
                      </div>
                    </TableCell>
                    <TableCell>{move.power <= 0 ? '—' : move.power}</TableCell>
                    <TableCell>{move.cooldown}</TableCell>
                  </MoveRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

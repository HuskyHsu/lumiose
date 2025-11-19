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
import type { DetailedPokemon } from '@/types/pokemon';

interface MovesCardProps {
  pokemon: DetailedPokemon;
}

export default function MovesCard({ pokemon }: MovesCardProps) {
  return (
    <Card className='lg:col-span-2'>
      <CardHeader>
        <CardTitle>Moves</CardTitle>
      </CardHeader>
      <CardContent className='px-0 md:px-6'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 text-center'>
          <div>
            <h4 className='font-semibold mb-3'>Level Up Moves</h4>
            <Table>
              <TableHeader>
                <TableRow className=''>
                  <TableHead className='w-2/12'>
                    Lv<span className='text-xs font-light italic'> +plus</span>
                  </TableHead>
                  <TableHead className='w-3/12'>Name</TableHead>
                  <TableHead className='w-1/12'>Type</TableHead>
                  <TableHead className='w-2/12'>Cat.</TableHead>
                  <TableHead className='w-2/12'>Att.</TableHead>
                  <TableHead className='w-2/12'>CD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className='bg-red-100'>
                  <TableCell>
                    <div className='flex justify-center'>
                      <PokemonTypes types={['Alpha']} />
                    </div>
                  </TableCell>
                  <TableCell>{pokemon.alphaMove.name.zh}</TableCell>
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
                </TableRow>
                {pokemon.levelUpMoves.map((move) => (
                  <TableRow key={move.id}>
                    <TableCell>
                      {move.level > 1 ? move.level : move.level === 0 ? 'Evolve' : '—'}
                      <span className='text-xs font-light italic'> +{move.plus}</span>
                    </TableCell>
                    <TableCell>{move.name.zh}</TableCell>
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
                  </TableRow>
                ))}
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
                {pokemon.tmMoves.map((move) => (
                  <TableRow key={move.id}>
                    <TableCell>{move.tm.toString().padStart(3, '0')}</TableCell>
                    <TableCell>{move.name.zh}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

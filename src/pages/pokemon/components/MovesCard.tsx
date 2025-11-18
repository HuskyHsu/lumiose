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
      <CardContent>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div>
            <h4 className='font-semibold mb-3'>Level Up Moves</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Plus</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>category</TableHead>
                  <TableHead>power</TableHead>
                  <TableHead>cooldown</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pokemon.levelUpMoves.map((move) => (
                  <TableRow key={move.id}>
                    <TableCell>{move.level}</TableCell>
                    <TableCell>{move.plus}</TableCell>
                    <TableCell>{move.name.zh}</TableCell>
                    <TableCell>
                      <PokemonTypes types={[move.type]} />
                    </TableCell>
                    <TableCell>{move.category}</TableCell>
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
                  <TableHead>TM</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>category</TableHead>
                  <TableHead>power</TableHead>
                  <TableHead>cooldown</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pokemon.tmMoves.map((move) => (
                  <TableRow key={move.id}>
                    <TableCell>{move.tm}</TableCell>
                    <TableCell>{move.name.zh}</TableCell>
                    <TableCell>
                      {' '}
                      <PokemonTypes types={[move.type]} />
                    </TableCell>
                    <TableCell>{move.category}</TableCell>
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

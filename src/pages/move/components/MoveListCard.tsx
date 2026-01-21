import { PokemonTypes } from '@/components/pokemon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import MoveRow from '@/pages/pokemon/components/MoveRow';
import type { MoveList } from '@/types/move';

interface MoveListCardProps {
  moveList: MoveList;
  selectedMoveIds: number[];
  onToggleMove: (moveId: number) => void;
}

export default function MoveListCard({
  moveList,
  selectedMoveIds,
  onToggleMove,
}: MoveListCardProps) {
  const isSelectionFull = selectedMoveIds.length >= 6;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Move List ({moveList.length} moves)</CardTitle>
      </CardHeader>
      <CardContent className='px-0 md:px-6'>
        <div className='text-center'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50px]'>Select</TableHead>
                <TableHead className='w-2/12'>TM</TableHead>
                <TableHead className='w-3/12'>Name</TableHead>
                <TableHead className='w-1/12'>Type</TableHead>
                <TableHead className='w-2/12'>Cat.</TableHead>
                <TableHead className='w-2/12'>Att.</TableHead>
                <TableHead className='w-2/12'>CD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moveList.map((move) => {
                const isSelected = selectedMoveIds.includes(move.id);
                return (
                  <MoveRow key={move.id} moveId={move.id} colSpan={7}>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className='flex justify-center'>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => onToggleMove(move.id)}
                          disabled={!isSelected && isSelectionFull}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{move.tm ? move.tm.toString().padStart(3, '0') : '—'}</TableCell>
                    <TableCell>
                      <a
                        href={`https://wiki.52poke.com/zh-hant/${move.name.zh}（招式）`}
                        target='_blank'
                        rel='noreferrer'
                        className='inline text-blue-800 underline'
                        onClick={(e) => e.stopPropagation()}
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
      </CardContent>
    </Card>
  );
}

import { PokemonIconLink, PokemonTypes } from '@/components/pokemon';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { fetchMoveData } from '@/services/pokemonService';
import type { ExpandedMoveData, MinimalPokemon } from '@/types/pokemon';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MoveIntersectionResultProps {
  selectedMoveIds: number[];
  onRemoveMove: (moveId: number) => void;
}

export default function MoveIntersectionResult({
  selectedMoveIds,
  onRemoveMove,
}: MoveIntersectionResultProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultPokemon, setResultPokemon] = useState<MinimalPokemon[]>([]);
  const [selectedMoveDetails, setSelectedMoveDetails] = useState<ExpandedMoveData[]>([]);

  useEffect(() => {
    const fetchAndCalculateIntersection = async () => {
      if (selectedMoveIds.length === 0) {
        setResultPokemon([]);
        setSelectedMoveDetails([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch details for all selected moves
        const moveDetailsPromises = selectedMoveIds.map((id) => fetchMoveData(id));
        const moveDetails = await Promise.all(moveDetailsPromises);
        setSelectedMoveDetails(moveDetails);

        // Calculate intersection
        // Get all pokemon that learn the first move
        let intersection: MinimalPokemon[] = getAllLearningPokemon(moveDetails[0]);

        // Intersect with subsequent moves
        for (let i = 1; i < moveDetails.length; i++) {
          const nextMovePokemon = getAllLearningPokemon(moveDetails[i]);
          const nextMoveConfig = new Set(nextMovePokemon.map((p) => p.link));
          intersection = intersection.filter((p) => nextMoveConfig.has(p.link));
        }

        setResultPokemon(intersection);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to calculate intersection');
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateIntersection();
  }, [selectedMoveIds]);

  const getAllLearningPokemon = (moveData: ExpandedMoveData): MinimalPokemon[] => {
    const allPokemon: MinimalPokemon[] = [];
    if (moveData.levelUpPm) allPokemon.push(...moveData.levelUpPm);
    if (moveData.tmPm) allPokemon.push(...moveData.tmPm);
    if (moveData.alphaPm) allPokemon.push(...moveData.alphaPm);

    // Remove duplicates based on link
    const uniquePokemon = new Map<string, MinimalPokemon>();
    allPokemon.forEach((p) => {
      if (!uniquePokemon.has(p.link)) {
        uniquePokemon.set(p.link, p);
      }
    });

    return Array.from(uniquePokemon.values());
  };

  if (selectedMoveIds.length < 2) {
    return null;
  }

  return (
    <div className='mt-8 flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Move Intersection ({selectedMoveIds.length} selected)</h2>
      </div>

      <div className='flex flex-wrap gap-2'>
        {selectedMoveDetails.map((move) => (
          <div
            key={move.id}
            className='flex items-center rounded-full border bg-white pl-3 pr-1 py-1 shadow-sm dark:bg-gray-800'
          >
            <span className='mr-2 font-medium'>{move.name.zh}</span>
            <PokemonTypes types={[move.type]} />
            <button
               className="ml-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
               onClick={() => onRemoveMove(move.id)}
            >
                <X className="h-3 w-3 text-gray-500" />
            </button>
          </div>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div>
          <h3 className='mb-4 font-semibold'>
            Pokemon learning ALL these moves ({resultPokemon.length}):
          </h3>
          {resultPokemon.length === 0 ? (
            <p className='text-muted-foreground italic'>
              No Pokemon found matching these criteria.
            </p>
          ) : (
            <div className='rounded-md border bg-white p-4 -mx-4 md:mx-0 dark:bg-gray-900'>
              <div className='flex flex-wrap gap-x-2 gap-y-4'>
                {resultPokemon.map((pm, idx) => (
                  <PokemonIconLink key={`${pm.link}-${idx}`} pokemon={pm} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

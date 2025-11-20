import { PokemonTypes } from '@/components/pokemon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DetailedPokemon } from '@/types/pokemon';
import type { JSX } from 'react';
import { TypeWeakness } from './TypeWeakness';

interface BasicInfoProps {
  pokemon: DetailedPokemon;
}

type ContentProps = { pokemon: DetailedPokemon };

const genderRatioMap = {
  0: [100, 0],
  31: [87.5, 12.5],
  63: [75, 25],
  127: [50, 50],
  191: [25, 75],
  225: [12.5, 87.5],
  254: [0, 100],
  255: [0, 0],
};

type Render = {
  title: string;
  Content: ({ pokemon }: ContentProps) => JSX.Element;
};

export default function BasicInfo({ pokemon }: BasicInfoProps) {
  const renderData: Render[] = [
    {
      title: 'Name(zh)',
      Content: ({ pokemon }: ContentProps) => <>{pokemon.name.zh}</>,
    },
    {
      title: 'Name(en)',
      Content: ({ pokemon }: ContentProps) => <>{pokemon.name.en}</>,
    },
    {
      title: 'Name(jp)',
      Content: ({ pokemon }: ContentProps) => <>{pokemon.name.ja}</>,
    },
    {
      title: 'Types',
      Content: ({ pokemon }: ContentProps) => <PokemonTypes types={pokemon.type} />,
    },
    {
      title: 'Gender Ratio',
      Content: ({ pokemon }: ContentProps) => (
        <span className='flex gap-4 whitespace-nowrap'>
          <span>♂：{genderRatioMap[pokemon.genderRatio as keyof typeof genderRatioMap][0]}%</span>
          <span>♀：{genderRatioMap[pokemon.genderRatio as keyof typeof genderRatioMap][1]}%</span>
        </span>
      ),
    },
    {
      title: 'Height',
      Content: ({ pokemon }: ContentProps) => <>{pokemon.height}m</>,
    },
    {
      title: 'Weight',
      Content: ({ pokemon }: ContentProps) => <>{pokemon.weight}kg</>,
    },
    {
      title: 'Catch Rate',
      Content: ({ pokemon }: ContentProps) => <>{pokemon.catchRate}</>,
    },
    {
      title: 'Experience Group',
      Content: ({ pokemon }: ContentProps) => <>{pokemon.expGroup}</>,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex justify-around'>
          <img
            src={`${import.meta.env.BASE_URL}images/pmIcon/${pokemon.link}.png`}
            alt={pokemon.name.zh}
          />
          <img
            src={`${import.meta.env.BASE_URL}images/pmIcon/${pokemon.link}s.png`}
            alt={pokemon.name.zh}
          />
        </div>
        <div className='space-y-2'>
          {renderData.map((data, index) => (
            <div className='flex justify-between' key={index}>
              <span className='text-sm text-gray-500'>{data.title}:</span>
              <span className='font-medium'>
                <data.Content pokemon={pokemon} />
              </span>
            </div>
          ))}
          <TypeWeakness pokemon={pokemon} />
        </div>
      </CardContent>
    </Card>
  );
}

import { PokemonTypes } from '@/components/pokemon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/Loading';
import { ShareButton } from '@/components/ui/share-button';
import type { DetailedPokemon } from '@/types/pokemon';
import type { JSX } from 'react';
import { TypeWeakness } from './TypeWeakness';

interface BasicInfoProps {
  pokemon: DetailedPokemon;
  loading: boolean;
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

export default function BasicInfo({ pokemon, loading = false }: BasicInfoProps) {
  const renderData: Render[] = [
    {
      title: 'National ID',
      Content: ({ pokemon }: ContentProps) => <>#{pokemon.pid.toString().padStart(4, '0')}</>,
    },
    {
      title: 'Local ID',
      Content: ({ pokemon }: ContentProps) => {
        const id = (pokemon.lumioseId <= 232 ? pokemon.lumioseId : pokemon.lumioseId - 232)
          .toString()
          .padStart(3, '0');

        return (
          <>
            {pokemon.lumioseId <= 232 ? 'Lumiose' : 'Hyperspace'}#{id}
          </>
        );
      },
    },
    {
      title: 'Name(zh)',
      Content: ({ pokemon }: ContentProps) => (
        <a
          href={`https://wiki.52poke.com/zh-hant/${pokemon.name.zh}`}
          target='_blank'
          rel='noreferrer'
          className='inline text-blue-800 underline'
        >
          {pokemon.name.zh}
        </a>
      ),
    },
    {
      title: 'Name(en)',
      Content: ({ pokemon }: ContentProps) => (
        <a
          href={`https://www.serebii.net/pokedex-sv/${pokemon.name.en.toLocaleLowerCase()}/`}
          target='_blank'
          rel='noreferrer'
          className='inline text-blue-800 underline'
        >
          {pokemon.name.en}
        </a>
      ),
    },
    {
      title: 'Name(jp)',
      Content: ({ pokemon }: ContentProps) => <>{pokemon.name.ja}</>,
    },
    ...(pokemon.altForm !== undefined
      ? [
          {
            title: 'altForm',
            Content: ({ pokemon }: ContentProps) => <>{pokemon.altForm}</>,
          },
        ]
      : []),
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
      title: 'Catch Rate(0~255)',
      Content: ({ pokemon }: ContentProps) => <>{pokemon.catchRate}</>,
    },
    {
      title: 'Experience Group',
      Content: ({ pokemon }: ContentProps) => <>{pokemon.expGroup}</>,
    },
    ...(pokemon.zone !== undefined
      ? [
          {
            title: 'Wild Zone',
            Content: ({ pokemon }: ContentProps) => (
              <>
                {pokemon.zone
                  ?.map(
                    (zone) =>
                      `${zone.id}${zone.weather[0] === 'any' ? '' : `(${zone.weather.join(', ')})`}`
                  )
                  .join('; ')}
              </>
            ),
          },
        ]
      : []),
    ...(pokemon.alphaZone !== undefined
      ? [
          {
            title: 'Wild Zone(alpha)',
            Content: ({ pokemon }: ContentProps) => <>{pokemon.alphaZone?.join('; ')}</>,
          },
        ]
      : []),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Basic Information
          <ShareButton
            title={`${pokemon.name.zh}${pokemon.altForm ? '(' + pokemon.altForm + ')' : ''}`}
            className='w-6 h-6'
          />
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex justify-around'>
          {loading ? (
            <>
              <Loading size='h-[160px]' />
              <Loading size='h-[160px]' />
            </>
          ) : (
            <>
              <img
                src={`${import.meta.env.BASE_URL}images/pmIcon/${pokemon.link}.png`}
                alt={pokemon.name.zh}
              />
              <img
                src={`${import.meta.env.BASE_URL}images/pmIcon/${pokemon.link}s.png`}
                alt={pokemon.name.zh}
              />
            </>
          )}
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

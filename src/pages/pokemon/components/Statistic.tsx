import { cn } from '@/lib/utils';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { useState } from 'react';

import type { BasePoint, DetailedPokemon } from '@/types/pokemon';

type Props = {
  pokemon: DetailedPokemon;
};

function calStatistic(
  species: number,
  individual: number,
  base: number,
  lv: number,
  isHp = false,
  nature?: string
) {
  if (isHp) {
    return Math.floor((Math.floor(species * 2 + individual + base / 4) * lv) / 100 + 10 + lv);
  }
  const value = (Math.floor(species * 2 + individual + base / 4) * lv) / 100 + 5;
  if (nature === undefined) {
    return Math.floor(value);
  }
  return nature === 'up' ? Math.floor(value * 1.1) : Math.floor(value * 0.9);
}

function updateBase(prev: BasePoint, key: string, value: number): BasePoint {
  if (Number.isNaN(value)) {
    value = 0;
  }

  if (value < 0) {
    value = 0;
  }

  if (value > 252) {
    value = 252;
  }

  const preTotal = prev.Hp + prev.Atk + prev.Def + prev.SpA + prev.SpD + prev.Spe;

  if (preTotal - prev[key as keyof typeof prev] + value > 510) {
    value = 510 - preTotal + prev[key as keyof typeof prev];
  }

  const newBase = {
    ...prev,
    [key as keyof typeof prev]: value,
  };

  return {
    ...newBase,
    Total: newBase.Hp + newBase.Atk + newBase.Def + newBase.SpA + newBase.SpD + newBase.Spe,
  };
}

function updateIndividual(prev: BasePoint, key: string, value: number): BasePoint {
  if (Number.isNaN(value)) {
    value = 0;
  }

  if (value < 0) {
    value = 0;
  }

  if (value > 31) {
    value = 31;
  }

  const newBase = {
    ...prev,
    [key as keyof typeof prev]: value,
  };

  return newBase;
}

function updateNature(prev: BasePoint, key: string, value: number): BasePoint {
  // Create a new object instead of mutating the previous one
  const newNature = { ...prev };

  for (const curKey in newNature) {
    if (curKey === key) {
      newNature[curKey as keyof typeof newNature] =
        newNature[curKey as keyof typeof newNature] === value ? 0 : value;
    } else {
      if (value > 0 && newNature[curKey as keyof typeof newNature] > 0) {
        newNature[curKey as keyof typeof newNature] = 0;
      } else if (value < 0 && newNature[curKey as keyof typeof newNature] < 0) {
        newNature[curKey as keyof typeof newNature] = 0;
      }
    }
  }

  return newNature;
}

export function Statistic({ pokemon }: Props) {
  const [lv, setLv] = useState(100);
  const [customBase, setCustomBase] = useState<BasePoint>({
    Hp: 0,
    Atk: 0,
    Def: 0,
    SpA: 0,
    SpD: 0,
    Spe: 0,
    Total: 0,
  });

  const [customIndividual, setcustomIndividual] = useState<BasePoint>({
    Hp: 31,
    Atk: 31,
    Def: 31,
    SpA: 31,
    SpD: 31,
    Spe: 31,
    Total: 0,
  });

  const [nature, setNature] = useState<BasePoint>({
    Hp: 0,
    Atk: 0,
    Def: 0,
    SpA: 0,
    SpD: 0,
    Spe: 0,
    Total: 0,
  });

  const cases = [
    { name: '最高', individual: 31, base: 252, nature: 'up' },
    { name: '最低', individual: 0, base: 0, nature: 'down' },
  ];

  return (
    <>
      <div className='space-y-3'>
        <p>能力值</p>
        <label className='block font-medium'>Lv： {lv}</label>
        <input
          type='range'
          value={lv}
          min='1'
          max='100'
          step='1'
          className='h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-green-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none'
          onChange={(e) => setLv(parseInt(e.target.value))}
        />
        <table className='w-full table-fixed text-center text-sm'>
          <thead className='bg-gray-100 text-xs'>
            <tr className='bg-custom-gold/50'>
              <th scope='col' className='whitespace-nowrap py-1'>
                case
              </th>
              {['HP', 'Attack', 'Defense', 'Sp.Atk', 'Sp.Def', 'Speed'].map((type) => (
                <th scope='col' className='whitespace-nowrap py-1' key={type}>
                  {type}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[cases[0]].map((c) => (
              <tr
                className={cn('border-b text-center', 'hover:bg-gray-100 hover:text-gray-900')}
                key={c.name}
              >
                <td className='py-1'>{c.name}</td>
                {pokemon.base.map((stat, i) => (
                  <td className='py-1' key={i}>
                    {calStatistic(stat, c.individual, c.base, lv, i === 0, c.nature)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className={cn('border-b text-center', 'bg-gray-200')}>
              <td className='py-1'>自訂</td>
              {['Hp', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'].map((key, i) => {
                return (
                  <td className='py-1' key={key}>
                    {calStatistic(
                      pokemon.base[i],
                      customIndividual[key as keyof typeof customIndividual],
                      customBase[key as keyof typeof customBase],
                      lv,
                      i === 0,
                      nature[key as keyof typeof nature] === 0
                        ? undefined
                        : nature[key as keyof typeof nature] > 0
                        ? 'up'
                        : 'down'
                    )}
                  </td>
                );
              })}
            </tr>
            {[cases[1]].map((c) => (
              <tr
                className={cn('border-b text-center', 'hover:bg-gray-100 hover:text-gray-900')}
                key={c.name}
              >
                <td className='py-1'>{c.name}</td>
                {pokemon.base.map((stat, i) => (
                  <td className='py-1' key={i}>
                    {calStatistic(stat, c.individual, c.base, lv, i === 0, c.nature)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <label className='block font-medium'>自訂參數</label>
          <table className='w-full table-fixed text-center text-sm'>
            <thead className='bg-gray-100 text-xs'>
              <tr className='bg-custom-gold/50'>
                <th scope='col' className='whitespace-nowrap py-1'>
                  {}
                </th>
                {['HP', 'Attack', 'Defense', 'Sp.Atk', 'Sp.Def', 'Speed'].map((type) => (
                  <th scope='col' className='whitespace-nowrap py-1' key={type}>
                    {type}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className={cn('border-b text-center')}>
                <td className=''>個體值</td>
              </tr>
              <tr className={cn('border-b text-center')}>
                <td>
                  {
                    ['Hp', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'].filter((key) => {
                      return customIndividual[key as keyof typeof customIndividual] === 31;
                    }).length
                  }
                  v
                </td>
                {['Hp', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'].map((key) => {
                  return (
                    <td key={key}>
                      <input
                        className={cn(
                          'block w-full rounded border border-gray-300',
                          'bg-gray-50 px-2.5 py-0.5 text-sm text-gray-900',
                          'text-center'
                        )}
                        value={customIndividual[key as keyof typeof customIndividual] ?? ''}
                        onChange={(e) => {
                          setcustomIndividual((prev) => {
                            return updateIndividual(prev, key, Number(e.target.value));
                          });
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
              <tr className={cn('border-b text-center')}>
                <td className=''>努力值</td>
              </tr>
              <tr className={cn('border-b text-center')}>
                <td>{customBase.Total}</td>
                {['Hp', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'].map((key) => {
                  return (
                    <td key={key}>
                      <input
                        className={cn(
                          'block w-full rounded border border-gray-300',
                          'bg-gray-50 px-2.5 py-0.5 text-sm text-gray-900',
                          'text-center'
                        )}
                        value={customBase[key as keyof typeof customBase] ?? ''}
                        onChange={(e) => {
                          setCustomBase((prev) => {
                            return updateBase(prev, key, Number(e.target.value));
                          });
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
              <tr className={cn('border-b text-center')}></tr>
              <tr className={cn('border-b text-center')}>
                <td className=''>性格 ⇧</td>
                <td />
                {['Atk', 'Def', 'SpA', 'SpD', 'Spe'].map((key) => {
                  const isPositive = nature[key as keyof typeof nature] > 0;
                  return (
                    <td key={key} className=''>
                      <button
                        type='button'
                        className={cn(
                          'w-full rounded border border-gray-300 px-2.5 py-0.5 text-sm',
                          'transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-offset-1',
                          isPositive
                            ? 'bg-red-500 border-red-500 text-white focus:ring-grredeen-300'
                            : 'bg-gray-50 border-gray-300 hover:border-red-400 focus:ring-red-300',
                          'text-center font-medium',
                          'flex items-center justify-center'
                        )}
                        onClick={() => {
                          setNature((prev) => {
                            return updateNature(prev, key, 1);
                          });
                        }}
                      >
                        {isPositive ? <ArrowBigUp className='fill-white stroke-none h-5' /> : '-'}
                      </button>
                    </td>
                  );
                })}
              </tr>
              <tr className={cn('border-b text-center')}>
                <td className=''>性格 ⇩</td>
                <td />
                {['Atk', 'Def', 'SpA', 'SpD', 'Spe'].map((key) => {
                  const isNegative = nature[key as keyof typeof nature] < 0;
                  return (
                    <td key={key} className=''>
                      <button
                        type='button'
                        className={cn(
                          'w-full rounded border border-gray-300 px-2.5 py-0.5 text-sm',
                          'transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-offset-1',
                          isNegative
                            ? 'bg-blue-500 border-blue-500 text-white focus:ring-blue-300'
                            : 'bg-gray-50 border-gray-300 hover:border-blue-400 focus:ring-blue-300',
                          'text-center font-medium',

                          'flex items-center justify-center'
                        )}
                        onClick={() => {
                          setNature((prev) => {
                            return updateNature(prev, key, -1);
                          });
                        }}
                      >
                        {isNegative ? <ArrowBigDown className='fill-white stroke-none h-5' /> : '-'}
                      </button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

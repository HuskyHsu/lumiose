import {
  TYPE_EFFECTIVENESS_CHART,
  type EffectivenessMultiplier,
  type PokemonType,
} from '../constants/typeEffectiveness';

/**
 * Represents a type with its effectiveness multiplier
 */
export interface TypeEffectiveness {
  type: string;
  rate: EffectivenessMultiplier;
}

/**
 * Calculate the effectiveness of all attacking types against a Pokemon with given defensive types
 * @param defensiveTypes - Array of the defending Pokemon's types
 * @returns Array of type effectiveness objects
 */
export function calculateTypeWeaknesses(defensiveTypes: string[]): TypeEffectiveness[] {
  return Object.keys(TYPE_EFFECTIVENESS_CHART).map((attackingType) => {
    const effectiveness = defensiveTypes.reduce((multiplier: number, defensiveType) => {
      const typeChart = TYPE_EFFECTIVENESS_CHART[attackingType as PokemonType];
      const typeEffectiveness = typeChart?.[defensiveType as PokemonType] ?? 1;
      return multiplier * typeEffectiveness;
    }, 1);

    return {
      type: attackingType,
      rate: effectiveness as EffectivenessMultiplier,
    };
  });
}

/**
 * Filter type weaknesses by a specific effectiveness multiplier
 * @param typeWeaknesses - Array of type effectiveness objects
 * @param targetMultiplier - The multiplier to filter by
 * @returns Array of types that match the target multiplier
 */
export function filterTypesByEffectiveness(
  typeWeaknesses: TypeEffectiveness[],
  targetMultiplier: EffectivenessMultiplier
): TypeEffectiveness[] {
  return typeWeaknesses.filter(({ rate }) => rate === targetMultiplier);
}

/**
 * Get types that are weak against the given defensive types (multiplier > 1)
 * @param defensiveTypes - Array of the defending Pokemon's types
 * @returns Array of type effectiveness objects for weaknesses
 */
export function getWeaknesses(defensiveTypes: string[]): TypeEffectiveness[] {
  const allEffectiveness = calculateTypeWeaknesses(defensiveTypes);
  return allEffectiveness.filter(({ rate }) => rate > 1);
}

/**
 * Get types that are resistant against the given defensive types (multiplier < 1)
 * @param defensiveTypes - Array of the defending Pokemon's types
 * @returns Array of type effectiveness objects for resistances
 */
export function getResistances(defensiveTypes: string[]): TypeEffectiveness[] {
  const allEffectiveness = calculateTypeWeaknesses(defensiveTypes);
  return allEffectiveness.filter(({ rate }) => rate < 1);
}

/**
 * Get types that have no effect against the given defensive types (multiplier = 0)
 * @param defensiveTypes - Array of the defending Pokemon's types
 * @returns Array of type effectiveness objects for immunities
 */
export function getImmunities(defensiveTypes: string[]): TypeEffectiveness[] {
  const allEffectiveness = calculateTypeWeaknesses(defensiveTypes);
  return allEffectiveness.filter(({ rate }) => rate === 0);
}

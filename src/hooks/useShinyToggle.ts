import { useCallback } from 'react';
import { useUrlParams } from './useUrlParams';

export function useShinyToggle() {
  const { getBooleanParam, setBooleanParam } = useUrlParams();

  const isShiny = getBooleanParam('shiny', false);

  const toggleShiny = useCallback(() => {
    setBooleanParam('shiny', !isShiny, false);
  }, [setBooleanParam, isShiny]);

  const setShiny = useCallback(
    (shiny: boolean) => {
      setBooleanParam('shiny', shiny, false);
    },
    [setBooleanParam]
  );

  return {
    isShiny,
    toggleShiny,
    setShiny,
  };
}

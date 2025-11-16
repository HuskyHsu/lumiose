import { useCallback, useState } from 'react';

export function useShinyToggle() {
  const [isShiny, setIsShiny] = useState<boolean>(false);

  const toggleShiny = useCallback(() => {
    setIsShiny((prev) => !prev);
  }, []);

  const setShiny = useCallback((shiny: boolean) => {
    setIsShiny(shiny);
  }, []);

  return {
    isShiny,
    toggleShiny,
    setShiny,
  };
}

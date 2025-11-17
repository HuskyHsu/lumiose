import { useCallback, useState } from 'react';

export function useFinalFormToggle() {
  const [isFinalFormOnly, setIsFinalFormOnly] = useState<boolean>(false);

  const toggleFinalForm = useCallback(() => {
    setIsFinalFormOnly((prev) => !prev);
  }, []);

  return {
    isFinalFormOnly,
    toggleFinalForm,
  };
}

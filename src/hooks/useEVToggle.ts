import { useCallback } from 'react';
import { useUrlParams } from './useUrlParams';

export function useEVToggle() {
  const { getBooleanParam, setBooleanParam } = useUrlParams();

  const isShowEV = getBooleanParam('ev', false);

  const toggleEV = useCallback(() => {
    setBooleanParam('ev', !isShowEV, false);
  }, [setBooleanParam, isShowEV]);

  const setShowEV = useCallback(
    (show: boolean) => {
      setBooleanParam('ev', show, false);
    },
    [setBooleanParam]
  );

  return {
    isShowEV,
    toggleEV,
    setShowEV,
  };
}

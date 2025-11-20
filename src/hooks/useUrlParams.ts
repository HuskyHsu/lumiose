import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  const getArrayParam = useCallback(
    (key: string): string[] => {
      const value = searchParams.get(key);
      return value ? value.split(',').filter(Boolean) : [];
    },
    [searchParams]
  );

  const getBooleanParam = useCallback(
    (key: string, defaultValue: boolean = false): boolean => {
      const value = searchParams.get(key);
      return value ? value === 'true' : defaultValue;
    },
    [searchParams]
  );

  const setParam = useCallback(
    (key: string, value: string | null) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (value === null || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  const setArrayParam = useCallback(
    (key: string, values: string[]) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (values.length === 0) {
          newParams.delete(key);
        } else {
          newParams.set(key, values.join(','));
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  const setBooleanParam = useCallback(
    (key: string, value: boolean, defaultValue: boolean = false) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (value === defaultValue) {
          newParams.delete(key);
        } else {
          newParams.set(key, value.toString());
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  return {
    getParam,
    getArrayParam,
    getBooleanParam,
    setParam,
    setArrayParam,
    setBooleanParam,
  };
}

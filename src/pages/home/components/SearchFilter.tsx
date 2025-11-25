import { trackCustomEvent } from '@/lib/analytics';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SearchFilterProps {
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
}

export function SearchFilter({ searchKeyword, onSearchChange }: SearchFilterProps) {
  const searchTimeoutRef = useRef<number | undefined>(undefined);
  const analyticsTimeoutRef = useRef<number | undefined>(undefined);
  const [inputValue, setInputValue] = useState(searchKeyword);
  const [isComposing, setIsComposing] = useState(false);

  // Update input value when searchKeyword prop changes (e.g., when cleared externally)
  useEffect(() => {
    setInputValue(searchKeyword);
  }, [searchKeyword]);

  const debouncedSearch = useCallback(
    (value: string) => {
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Debounce the actual search functionality
      searchTimeoutRef.current = setTimeout(() => {
        onSearchChange(value);
      }, 300);
    },
    [onSearchChange]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);

      // Don't trigger search during IME composition
      if (!isComposing) {
        debouncedSearch(value);
      }

      // Clear previous analytics timeout
      if (analyticsTimeoutRef.current) {
        clearTimeout(analyticsTimeoutRef.current);
      }

      // Track search after user stops typing for 1 second
      if (value.trim()) {
        analyticsTimeoutRef.current = setTimeout(() => {
          trackCustomEvent('pokemon_search', {
            search_term: value.trim(),
            search_length: value.trim().length,
          });
        }, 1000);
      }
    },
    [debouncedSearch, isComposing]
  );

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(
    (event: React.CompositionEvent<HTMLInputElement>) => {
      setIsComposing(false);
      const value = event.currentTarget.value;
      setInputValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleClearSearch = useCallback(() => {
    // Clear timeouts when clearing search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (analyticsTimeoutRef.current) {
      clearTimeout(analyticsTimeoutRef.current);
    }

    setInputValue('');
    onSearchChange('');

    // Track search clear action
    trackCustomEvent('pokemon_search_clear', {
      previous_search_term: searchKeyword,
    });
  }, [onSearchChange, searchKeyword]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (analyticsTimeoutRef.current) {
        clearTimeout(analyticsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className='mb-4'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='flex items-center text-lg font-semibold text-slate-700'>
          <img src={`${import.meta.env.BASE_URL}images/type/PokemonBall.png`} className='w-8 h-8' />
          Search Keywords
        </h2>
      </div>

      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <svg
            className='w-5 h-5 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder='Search by name, or ID...'
          className='
            w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200 outline-none
            bg-white text-slate-700 placeholder-gray-400
          '
        />
        {inputValue && (
          <button
            onClick={handleClearSearch}
            className='
              absolute inset-y-0 right-0 pr-3 flex items-center
              text-gray-400 hover:text-gray-600 transition-colors duration-200
            '
            aria-label='Clear search'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

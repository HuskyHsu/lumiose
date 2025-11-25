import { trackCustomEvent } from '@/lib/analytics';
import { useCallback, useEffect, useRef } from 'react';

interface SearchFilterProps {
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
}

export function SearchFilter({ searchKeyword, onSearchChange }: SearchFilterProps) {
  const searchTimeoutRef = useRef<number | undefined>(undefined);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      onSearchChange(value);

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Track search after user stops typing for 1 second
      if (value.trim()) {
        searchTimeoutRef.current = setTimeout(() => {
          trackCustomEvent('pokemon_search', {
            search_term: value.trim(),
            search_length: value.trim().length,
          });
        }, 1000);
      }
    },
    [onSearchChange]
  );

  const handleClearSearch = useCallback(() => {
    // Clear timeout when clearing search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    onSearchChange('');

    // Track search clear action
    trackCustomEvent('pokemon_search_clear', {
      previous_search_term: searchKeyword,
    });
  }, [onSearchChange, searchKeyword]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className='mb-4'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='flex items-center text-lg font-semibold text-slate-700'>
          <img
            src={`${import.meta.env.BASE_URL}images/type/PokemonBall.png`}
            className='w-10 h-10'
          />
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
          value={searchKeyword}
          onChange={handleInputChange}
          placeholder='Search by name, or ID...'
          className='
            w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200 outline-none
            bg-white text-slate-700 placeholder-gray-400
          '
        />
        {searchKeyword && (
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

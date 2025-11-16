import { cn } from '@/lib/utils';

interface ShinyToggleProps {
  isShiny: boolean;
  onToggle: () => void;
}

function ShinyToggle({ isShiny, onToggle }: ShinyToggleProps) {
  return (
    <div className='mb-4'>
      <h2 className='text-lg font-semibold text-slate-700 mb-4'>Shiny</h2>
      <div className='flex flex-col justify-center h-10'>
        <button
          type='button'
          onClick={onToggle}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
            isShiny ? 'bg-green-600' : 'bg-slate-300'
          )}
          role='switch'
          aria-checked={isShiny}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
              isShiny ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>
    </div>
  );
}

export default ShinyToggle;

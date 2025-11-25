import { trackCustomEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface ShinyToggleProps {
  isShiny: boolean;
  onToggle: () => void;
}

function ShinyToggle({ isShiny, onToggle }: ShinyToggleProps) {
  const handleToggle = () => {
    // Track shiny toggle
    trackCustomEvent('shiny_toggle', {
      new_state: !isShiny,
      previous_state: isShiny,
    });

    onToggle();
  };

  return (
    <div className='mb-4 flex gap-2 items-center'>
      <div className='flex flex-col justify-center h-10'>
        <button
          type='button'
          onClick={handleToggle}
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
      <span>Shiny</span>
    </div>
  );
}

export default ShinyToggle;

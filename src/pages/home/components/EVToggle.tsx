import { trackCustomEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface EVToggleProps {
  isShowEV: boolean;
  onToggle: () => void;
}

function EVToggle({ isShowEV, onToggle }: EVToggleProps) {
  const handleToggle = () => {
    // Track EV toggle
    trackCustomEvent('ev_toggle', {
      new_state: !isShowEV,
      previous_state: isShowEV,
    });

    onToggle();
  };

  return (
    <div className='flex gap-2 items-center'>
      <div className='flex flex-col justify-center h-10'>
        <button
          type='button'
          onClick={handleToggle}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
            isShowEV ? 'bg-green-600' : 'bg-slate-300'
          )}
          role='switch'
          aria-checked={isShowEV}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
              isShowEV ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>
      <span>Base Point</span>
    </div>
  );
}

export default EVToggle;

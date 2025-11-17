import { cn } from '@/lib/utils';

interface FinalFormToggleProps {
  isFinalFormOnly: boolean;
  onToggle: () => void;
}

function FinalFormToggle({ isFinalFormOnly, onToggle }: FinalFormToggleProps) {
  return (
    <div className='mb-4 flex gap-2 items-center'>
      <div className='flex flex-col justify-center h-10'>
        <button
          type='button'
          onClick={onToggle}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
            isFinalFormOnly ? 'bg-green-600' : 'bg-slate-300'
          )}
          role='switch'
          aria-checked={isFinalFormOnly}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
              isFinalFormOnly ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>
      <span>Final</span>
    </div>
  );
}

export default FinalFormToggle;

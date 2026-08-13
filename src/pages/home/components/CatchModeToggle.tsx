import { useCaught } from '@/contexts/CaughtContext';
import { trackCustomEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info } from 'lucide-react';

export default function CatchModeToggle() {
  const { isCatchMode, toggleCatchMode } = useCaught();

  const handleToggle = (toCatchMode: boolean) => {
    if (isCatchMode === toCatchMode) return;
    trackCustomEvent('catch_mode_toggle', {
      new_state: toCatchMode,
    });
    toggleCatchMode();
  };

  return (
    <div className='flex items-center gap-2'>
      <span className='text-sm font-semibold text-slate-500'>Tap Action:</span>
      <div className='inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 shadow-inner'>
        <button
          type='button'
          onClick={() => handleToggle(false)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ease-out',
            !isCatchMode
              ? 'bg-white text-slate-800 shadow-sm scale-[1.02]'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
          )}
          title="View Details Mode"
        >
          <Info className='w-4 h-4' />
          <span>Details</span>
        </button>
        <button
          type='button'
          onClick={() => handleToggle(true)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ease-out',
            isCatchMode
              ? 'bg-emerald-500 text-white shadow-sm scale-[1.02]'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
          )}
          title="Mark Caught Mode"
        >
          <CheckCircle2 className='w-4 h-4' />
          <span>Catch</span>
        </button>
      </div>
    </div>
  );
}

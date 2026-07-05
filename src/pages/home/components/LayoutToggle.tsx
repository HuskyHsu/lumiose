import { trackCustomEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { LayoutGrid, List } from 'lucide-react';

interface LayoutToggleProps {
  layout: 'grid' | 'minimalist';
  onLayoutChange: (layout: 'grid' | 'minimalist') => void;
}

export default function LayoutToggle({ layout, onLayoutChange }: LayoutToggleProps) {
  const handleToggle = (newLayout: 'grid' | 'minimalist') => {
    if (newLayout === layout) return;
    trackCustomEvent('layout_toggle', {
      new_layout: newLayout,
      previous_layout: layout,
    });
    onLayoutChange(newLayout);
  };

  return (
    <div className='flex items-center gap-2'>
      <span className='text-sm font-semibold text-slate-500'>Layout:</span>
      <div className='inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 shadow-inner'>
        <button
          type='button'
          onClick={() => handleToggle('grid')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ease-out',
            layout === 'grid'
              ? 'bg-white text-slate-800 shadow-sm scale-[1.02]'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
          )}
          title="Grid view"
        >
          <LayoutGrid className='w-4 h-4' />
          <span>Grid</span>
        </button>
        <button
          type='button'
          onClick={() => handleToggle('minimalist')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ease-out',
            layout === 'minimalist'
              ? 'bg-white text-slate-800 shadow-sm scale-[1.02]'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
          )}
          title="Minimalist view"
        >
          <List className='w-4 h-4' />
          <span>Minimalist</span>
        </button>
      </div>
    </div>
  );
}

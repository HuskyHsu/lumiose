import { trackCustomEvent } from '@/lib/analytics';
import { EV_STATS } from '@/lib/constants/pokemon';
import { cn } from '@/lib/utils';

interface EVFilterProps {
  selectedEVStat: string;
  onSelectEVStat: (stat: string) => void;
}

const EVFilter = ({ selectedEVStat, onSelectEVStat }: EVFilterProps) => {
  const handleStatClick = (stat: string) => {
    const newStat = selectedEVStat === stat ? '' : stat;
    onSelectEVStat(newStat);

    if (newStat) {
      trackCustomEvent('ev_filter_select', { stat: newStat });
    }
  };

  return (
    <div className='flex gap-2 mb-8 flex-wrap justify-center md:justify-start animate-fade-in'>
      {EV_STATS.map((stat) => (
        <button
          key={stat}
          type='button'
          onClick={() => handleStatClick(stat)}
          className={cn(
            'px-3 py-1 text-sm font-medium rounded-full transition-all duration-200',
            'border shadow-xs hover:shadow-md active:scale-95',
            selectedEVStat === stat
              ? 'bg-green-600 text-white border-green-600 ring-2 ring-green-200'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          )}
        >
          {stat}
        </button>
      ))}
    </div>
  );
};

export default EVFilter;

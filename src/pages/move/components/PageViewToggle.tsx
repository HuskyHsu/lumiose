import { useLocation, useNavigate } from 'react-router-dom';
import { trackCustomEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export default function PageViewToggle() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentView = location.pathname.includes('moves') ? 'moves' : 'pokemon';

  const handleToggle = (view: 'pokemon' | 'moves') => {
    if (view === currentView) return;

    trackCustomEvent('Page_view_toggle', {
      new_view: view,
      previous_view: currentView,
    });

    navigate(view === 'moves' ? '/moves' : '/');
  };

  return (
    <div className='mb-4 flex gap-2 items-center'>
      <div className='flex flex-col justify-center h-10'>
        <div className='relative inline-flex bg-slate-200 rounded-full p-1'>
          <button
            type='button'
            onClick={() => handleToggle('pokemon')}
            className={cn(
              'relative px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              currentView === 'pokemon'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Pokemon
          </button>
          <button
            type='button'
            onClick={() => handleToggle('moves')}
            className={cn(
              'relative px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
              currentView === 'moves'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Moves
          </button>
        </div>
      </div>
    </div>
  );
}

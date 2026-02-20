import { trackCustomEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';

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
    <div className='mb-6 -mx-2 sm:mx-0'>
      <div className='flex p-1.5 bg-slate-100/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-inner'>
        <button
          type='button'
          onClick={() => handleToggle('pokemon')}
          className={cn(
            'relative flex-1 flex items-center justify-center gap-2 py-2 text-[15px] font-bold rounded-xl transition-all duration-300 ease-out',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
            currentView === 'pokemon'
              ? 'bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/50 scale-[1.02]'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/60 active:scale-95',
          )}
        >
          <img src={`${import.meta.env.BASE_URL}images/type/PokemonBall.png`} className='w-8 h-8' />
          Pokémon
        </button>
        <button
          type='button'
          onClick={() => handleToggle('moves')}
          className={cn(
            'relative flex-1 flex items-center justify-center gap-2 py-2 text-[15px] font-bold rounded-xl transition-all duration-300 ease-out',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
            currentView === 'moves'
              ? 'bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/50 scale-[1.02]'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/60 active:scale-95',
          )}
        >
          <img src={`${import.meta.env.BASE_URL}images/type/Move.png`} className='w-6 h-6' />
          Moves
        </button>
      </div>
    </div>
  );
}

import { trackCustomEvent } from '@/lib/analytics';

interface DistortionFilterProps {
  selectedDistortion: string;
  onDistortionChange: (distortion: string) => void;
}

export function DistortionFilter({
  selectedDistortion,
  onDistortionChange,
}: DistortionFilterProps) {
  const levels = ['1', '2', '3', '4', '5'];

  const handleDistortionClick = (levelStr: string) => {
    let newDistortion: string;
    let action: string;

    if (selectedDistortion === levelStr) {
      newDistortion = '';
      action = 'distortion_filter_deselect';
    } else {
      newDistortion = levelStr;
      action = 'distortion_filter_select';
    }

    trackCustomEvent(action, {
      distortion: levelStr,
      previous_distortion: selectedDistortion,
    });

    onDistortionChange(newDistortion);
  };

  return (
    <div className='mb-4'>
      <h2 className='text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2'>
        <img src={`${import.meta.env.BASE_URL}images/type/PokemonBall.png`} className='w-8 h-8' />
        Hyperspace Distortions
      </h2>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-wrap gap-2 ml-1'>
          {levels.map((level) => {
            const isSelected = selectedDistortion === level;

            return (
              <button
                key={level}
                onClick={() => handleDistortionClick(level)}
                className={`
                  w-auto px-4 h-8 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1
                  ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400'
                      : 'bg-purple-500/30 text-slate-700 hover:bg-slate-200 hover:shadow-sm'
                  }
                  hover:scale-105 active:scale-95
                `}
                title={`${level} Star Raids`}
              >
                {level} ★ {level === '5' ? '' : '⬆'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

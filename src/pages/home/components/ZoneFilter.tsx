import { PokemonTypes } from '@/components/pokemon';
import { trackCustomEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface ZoneFilterProps {
  selectedZone: string;
  onZoneChange: (zone: string) => void;
  isAlphaZone: boolean;
  onAlphaZoneToggle: () => void;
}

export function ZoneFilter({
  selectedZone,
  onZoneChange,
  isAlphaZone,
  onAlphaZoneToggle,
}: ZoneFilterProps) {
  const otherZones = ['浦藍區', '瓊黃區', '蓉粉區', '榴紅區', '翡綠區', '弗拉達利研究所'];
  const zones = Array.from({ length: 20 }, (_, i) => `${i + 1}`);

  const handleZoneClick = (zoneStr: string) => {
    let newZone: string;
    let action: string;

    if (selectedZone === zoneStr) {
      // If this zone is already selected, deselect it (show all zones)
      newZone = '';
      action = 'zone_filter_deselect';
    } else {
      // Select this zone
      newZone = zoneStr;
      action = 'zone_filter_select';
    }

    // Track zone filter usage
    trackCustomEvent(action, {
      zone: zoneStr,
      previous_zone: selectedZone,
    });

    onZoneChange(newZone);
  };

  return (
    <div className='mb-4'>
      <h2 className='text-lg font-semibold text-slate-700 mb-4 flex items-center'>
        <img src={`${import.meta.env.BASE_URL}images/type/PokemonBall.png`} className='w-8 h-8' />
        Wild Zones
      </h2>
      <div className='flex flex-col gap-3'>
        {/* Alpha Zone Toggle */}
        <div className='mb-1 flex gap-2 items-center'>
          <div className='flex flex-col justify-center h-6'>
            <button
              type='button'
              onClick={onAlphaZoneToggle}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out',
                'focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2',
                isAlphaZone ? 'bg-red-800' : 'bg-slate-300'
              )}
              role='switch'
              aria-checked={isAlphaZone}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
                  isAlphaZone ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
          <PokemonTypes types={['Alpha']} className='w-6 h-6' />
        </div>

        {/* Zone grid */}
        <div className='grid grid-cols-10 lg:grid-cols-20 gap-2 justify-items-center'>
          {zones.map((zone) => {
            const zoneStr = zone.toString();
            const isSelected = selectedZone === zoneStr;

            return (
              <button
                key={zone}
                onClick={() => handleZoneClick(zone)}
                className={`
                  w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center
                  ${
                    isSelected
                      ? 'bg-green-600 text-white shadow-md ring-2 ring-green-400'
                      : 'bg-green-500/30 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                  }
                  hover:scale-110 active:scale-95
                `}
                title={`Zone ${zone}`}
              >
                {zone}
              </button>
            );
          })}
        </div>
        {isAlphaZone && (
          <div className='flex flex-wrap gap-2 md:ml-2'>
            {otherZones.map((zone) => {
              const isSelected = selectedZone === zone;

              return (
                <button
                  key={zone}
                  onClick={() => handleZoneClick(zone)}
                  className={`
                    w-auto px-3 h-8 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center
                    ${
                      isSelected
                        ? 'bg-green-600 text-white shadow-md ring-2 ring-green-400'
                        : 'bg-green-500/30 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                    }
                    hover:scale-110 active:scale-95
                  `}
                  title={zone}
                >
                  {zone}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

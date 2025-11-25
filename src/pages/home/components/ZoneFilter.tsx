import { trackCustomEvent } from '@/lib/analytics';

interface ZoneFilterProps {
  selectedZone: string;
  onZoneChange: (zone: string) => void;
}

export function ZoneFilter({ selectedZone, onZoneChange }: ZoneFilterProps) {
  const zones = Array.from({ length: 20 }, (_, i) => i + 1);

  const handleZoneClick = (zone: number) => {
    const zoneStr = zone.toString();
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
        <img src={`${import.meta.env.BASE_URL}images/type/PokemonBall.png`} className='w-10 h-10' />
        Wild Zones
      </h2>
      <div className='flex flex-col gap-3'>
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
      </div>
    </div>
  );
}

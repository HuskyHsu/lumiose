import { ReleaseNotesModal } from '@/components/ReleaseNotesModal';
import { useManualReleaseChecker } from '@/hooks/useManualReleaseChecker';
import { ExternalLink, FileText, Github } from 'lucide-react';

export const Footer = () => {
  const { release, showModal, isLoading, checkRelease, closeModal } = useManualReleaseChecker();

  return (
    <>
      <footer className='mt-16 border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm'>
        <div className='container mx-auto px-4 py-4 max-w-3xl'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            {/* Left side - App info */}
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <img
                  src={`${import.meta.env.BASE_URL}images/appIcon/mega_symbol.svg`}
                  className='w-6 h-6'
                  alt='Lumiose'
                />
                <span className='text-sm font-medium text-gray-700'>Lumiose Pokédex</span>
              </div>
              <span className='text-xs text-gray-500'>© 2025</span>
            </div>

            {/* Center - Links */}
            <div className='flex items-center gap-6 text-sm'>
              <button
                onClick={checkRelease}
                disabled={isLoading}
                className='flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50'
              >
                <FileText size={16} />
                {isLoading ? 'Loading...' : 'Release Notes'}
              </button>

              <a
                href='https://github.com/HuskyHsu/lumiose'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors'
              >
                <Github size={16} />
                GitHub
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Right side - Additional info */}
            <div className='text-xs text-gray-500'>Made with ❤️ for Pokémon fans</div>
          </div>
        </div>
      </footer>

      {/* Release Notes Modal */}
      {release && <ReleaseNotesModal release={release} isOpen={showModal} onClose={closeModal} />}
    </>
  );
};

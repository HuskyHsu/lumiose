import { usePokemonContext } from '@/contexts/PokemonContext';
import {
  canShowInstallPrompt,
  isPWAInstalled,
  isPWASupported,
  PWAImageCache,
  showInstallPrompt,
} from '@/utils/pwaUtils';
import { useEffect, useState } from 'react';

interface PWAInstallButtonProps {
  preloadPokemonImages?: boolean;
}

export default function PWAInstallButton({ preloadPokemonImages = true }: PWAInstallButtonProps) {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const { pokemonList } = usePokemonContext();

  useEffect(() => {
    const updateInstallStatus = () => {
      if (isPWASupported() && !isPWAInstalled()) {
        setCanInstall(canShowInstallPrompt());
      } else {
        setCanInstall(false);
      }
    };

    updateInstallStatus();

    const handleBeforeInstallPrompt = () => {
      updateInstallStatus();
    };

    const handleAppInstalled = () => {
      setCanInstall(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    setIsInstalling(true);
    try {
      const installed = await showInstallPrompt();
      if (installed) {
        setCanInstall(false);

        if (preloadPokemonImages && pokemonList.length > 0) {
          setIsPreloading(true);
          try {
            const pokemonIds = pokemonList.map((pokemon) => pokemon.link);

            console.log(
              `Starting to preload ${pokemonIds.length} Pokemon images (normal + shiny)...`
            );
            await PWAImageCache.preloadPokemonImages(pokemonIds);
            console.log('Pokemon images preloaded successfully');
          } catch (preloadError) {
            console.error('Failed to preload Pokemon images:', preloadError);
          } finally {
            setIsPreloading(false);
          }
        }
      }
    } catch (error) {
      console.error('Failed to install app:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Don't show button if PWA is not supported, already installed, or install prompt is not available
  if (!canInstall) {
    return null;
  }

  return (
    <button
      onClick={handleInstallApp}
      disabled={isInstalling}
      className='fixed top-4 right-4 z-50 w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center'
      title={
        isPreloading
          ? 'Preloading Pokemon images...'
          : isInstalling
          ? 'Installing...'
          : 'Install to Desktop'
      }
    >
      {isInstalling || isPreloading ? (
        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
      ) : (
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
      )}
    </button>
  );
}

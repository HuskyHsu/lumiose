// PWA utility functions

export interface CacheStats {
  totalImages: number;
  cachedImages: number;
  cacheSize: number;
}

// PWA installation related type definitions
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export class PWAImageCache {
  private static readonly IMAGE_CACHE_NAME = 'lumiose-images-v1';
  private static readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB

  // Preload critical Pokemon images
  static async preloadCriticalImages(): Promise<void> {
    if (!('serviceWorker' in navigator)) return;

    try {
      const cache = await caches.open(this.IMAGE_CACHE_NAME);

      // Preload commonly used images
      const criticalImages = [
        '/images/pwa-192x192.png',
        '/images/pwa-512x512.png',
        '/images/favicon.ico',
      ];

      const promises = criticalImages.map(async (url) => {
        const response = await cache.match(url);
        if (!response) {
          try {
            await cache.add(url);
            console.log(`Preloaded: ${url}`);
          } catch (error) {
            console.warn(`Failed to preload: ${url}`, error);
          }
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to preload critical images:', error);
    }
  }

  // Batch preload Pokemon images (both normal and shiny)
  static async preloadPokemonImages(pokemonData: string[]): Promise<void> {
    if (!('serviceWorker' in navigator)) return;

    try {
      const cache = await caches.open(this.IMAGE_CACHE_NAME);
      const batchSize = 5; // Process 5 Pokemon at a time (each has 2 images)

      for (let i = 0; i < pokemonData.length; i += batchSize) {
        const batch = pokemonData.slice(i, i + batchSize);
        const promises = batch.flatMap(async (link) => {
          const normalImageUrl = `${import.meta.env.BASE_URL}images/pmIcon/${link}.png`;
          const shinyImageUrl = `${import.meta.env.BASE_URL}images/pmIcon/${link}s.png`;

          const imagePromises = [];

          // Cache normal image
          try {
            const normalResponse = await cache.match(normalImageUrl);
            if (!normalResponse) {
              imagePromises.push(
                cache
                  .add(normalImageUrl)
                  .then(() => {
                    console.log(`Cached normal Pokemon image: ${link}`);
                  })
                  .catch((error) => {
                    console.warn(`Failed to cache normal Pokemon image: ${link}`, error);
                  })
              );
            }
          } catch (error) {
            console.warn(`Error checking normal Pokemon image: ${link}`, error);
          }

          // Cache shiny image
          try {
            const shinyResponse = await cache.match(shinyImageUrl);
            if (!shinyResponse) {
              imagePromises.push(
                cache
                  .add(shinyImageUrl)
                  .then(() => {
                    console.log(`Cached shiny Pokemon image: ${link}s`);
                  })
                  .catch((error) => {
                    console.warn(`Failed to cache shiny Pokemon image: ${link}s`, error);
                  })
              );
            }
          } catch (error) {
            console.warn(`Error checking shiny Pokemon image: ${link}s`, error);
          }

          return Promise.all(imagePromises);
        });

        await Promise.all(promises);

        // Check cache size to avoid exceeding limits
        const cacheSize = await this.getCacheSize();
        if (cacheSize > this.MAX_CACHE_SIZE) {
          console.warn('Cache size limit reached, stopping preload');
          break;
        }

        // Small delay to avoid blocking UI
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Failed to preload Pokemon images:', error);
    }
  }

  // Get cache statistics
  static async getCacheStats(): Promise<CacheStats> {
    try {
      const cache = await caches.open(this.IMAGE_CACHE_NAME);
      const keys = await cache.keys();

      let totalSize = 0;
      const sizePromises = keys.map(async (request) => {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          return blob.size;
        }
        return 0;
      });

      const sizes = await Promise.all(sizePromises);
      totalSize = sizes.reduce((sum, size) => sum + size, 0);

      return {
        totalImages: keys.length,
        cachedImages: keys.length,
        cacheSize: totalSize,
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {
        totalImages: 0,
        cachedImages: 0,
        cacheSize: 0,
      };
    }
  }

  // Get cache size
  private static async getCacheSize(): Promise<number> {
    try {
      const stats = await this.getCacheStats();
      return stats.cacheSize;
    } catch {
      return 0;
    }
  }

  // Clean up old cache entries
  static async cleanupCache(): Promise<void> {
    try {
      const cache = await caches.open(this.IMAGE_CACHE_NAME);
      const keys = await cache.keys();

      // Clear all cache entries
      const deletePromises = keys.map((key) => cache.delete(key));
      await Promise.all(deletePromises);
      console.log(`Cleaned up ${keys.length} cache entries`);
    } catch (error) {
      console.error('Failed to cleanup cache:', error);
    }
  }
}

// Check PWA installation status
export function isPWAInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

// Check if PWA is supported
export function isPWASupported(): boolean {
  return 'serviceWorker' in navigator && 'caches' in window;
}

// Format cache size for display
export function formatCacheSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// PWA installation related
let deferredPrompt: BeforeInstallPromptEvent | null = null;

// Listen for beforeinstallprompt event
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Store the event so it can be triggered later
    deferredPrompt = e as BeforeInstallPromptEvent;
    console.log('PWA install prompt is ready');
  });

  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
  });
}

// Check if install prompt can be shown
export function canShowInstallPrompt(): boolean {
  return deferredPrompt !== null && !isPWAInstalled();
}

// Show PWA install prompt
export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    console.log('Install prompt not available');
    return false;
  }

  try {
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response to install prompt: ${outcome}`);

    // Clear deferredPrompt as it can only be used once
    deferredPrompt = null;

    return outcome === 'accepted';
  } catch (error) {
    console.error('Error showing install prompt:', error);
    return false;
  }
}

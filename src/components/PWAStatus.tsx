import {
  PWAImageCache,
  formatCacheSize,
  isPWAInstalled,
  isPWASupported,
  type CacheStats,
} from '@/utils/pwaUtils';
import { useEffect, useState } from 'react';

export default function PWAStatus() {
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    totalImages: 0,
    cachedImages: 0,
    cacheSize: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const updateStats = async () => {
      if (isPWASupported()) {
        try {
          const stats = await PWAImageCache.getCacheStats();
          setCacheStats(stats);
        } catch (error) {
          console.error('Failed to get cache stats:', error);
        }
      }
      setIsLoading(false);
    };

    updateStats();
    const interval = setInterval(updateStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCleanupCache = async () => {
    setIsClearing(true);
    try {
      await PWAImageCache.cleanupCache();
      // 立即更新統計
      const stats = await PWAImageCache.getCacheStats();
      setCacheStats(stats);
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Failed to cleanup cache:', error);
    } finally {
      setIsClearing(false);
    }
  };

  if (!isPWASupported()) {
    return <div className='bg-gray-100 rounded p-3 text-sm text-gray-600'>⚠️ 瀏覽器不支援PWA</div>;
  }

  return (
    <div className='bg-gray-50 border rounded p-3 text-sm'>
      <div className='flex items-center justify-between mb-2'>
        <span className='font-medium'>PWA狀態 {isPWAInstalled() ? '✅' : '⭕'}</span>
        <button
          onClick={handleCleanupCache}
          disabled={isClearing}
          className='px-2 py-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded text-xs'
        >
          {isClearing ? '清理中...' : '清理緩存'}
        </button>
      </div>

      {isLoading ? (
        <div className='text-gray-500'>載入中...</div>
      ) : (
        <div className='space-y-1 text-gray-600 flex gap-8'>
          <div>已緩存圖片: {cacheStats.cachedImages}</div>
          <div>緩存大小: {formatCacheSize(cacheStats.cacheSize)}</div>
        </div>
      )}
    </div>
  );
}

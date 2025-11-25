import { fetchLatestRelease, type GitHubRelease } from '@/services/releaseService';
import { useState } from 'react';

export const useManualReleaseChecker = () => {
  const [release, setRelease] = useState<GitHubRelease | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkRelease = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const latestRelease = await fetchLatestRelease();
      setRelease(latestRelease);
      setShowModal(true);
    } catch (err) {
      console.error('Failed to fetch release:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return {
    release,
    showModal,
    isLoading,
    error,
    checkRelease,
    closeModal,
  };
};

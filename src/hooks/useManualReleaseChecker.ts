import { fetchReleases, type GitHubRelease } from '@/services/releaseService';
import { useState } from 'react';

export const useManualReleaseChecker = () => {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkRelease = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const allReleases = await fetchReleases();
      setReleases(allReleases);
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
    releases,
    showModal,
    isLoading,
    error,
    checkRelease,
    closeModal,
  };
};

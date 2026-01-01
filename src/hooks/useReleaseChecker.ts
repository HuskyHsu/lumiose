import { fetchReleases, type GitHubRelease } from '@/services/releaseService';
import { hasSeenVersion, setLastSeenVersion } from '@/utils/versionStorage';
import { useEffect, useState } from 'react';

export const useReleaseChecker = () => {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkForNewRelease = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const allReleases = await fetchReleases();
        setReleases(allReleases);

        if (allReleases.length > 0) {
          const latestRelease = allReleases[0];
          // Check if this version has been seen before
          if (!hasSeenVersion(latestRelease.tag_name)) {
            setShowModal(true);
          }
        }
      } catch (err) {
        console.error('Failed to check for new release:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    checkForNewRelease();
  }, []);

  const handleCloseModal = () => {
    if (releases.length > 0) {
      setLastSeenVersion(releases[0].tag_name);
    }
    setShowModal(false);
  };

  return {
    releases,
    showModal,
    isLoading,
    error,
    closeModal: handleCloseModal,
  };
};

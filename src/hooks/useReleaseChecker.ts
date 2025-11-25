import { fetchLatestRelease, type GitHubRelease } from '@/services/releaseService';
import { hasSeenVersion, setLastSeenVersion } from '@/utils/versionStorage';
import { useEffect, useState } from 'react';

export const useReleaseChecker = () => {
  const [release, setRelease] = useState<GitHubRelease | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkForNewRelease = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const latestRelease = await fetchLatestRelease();
        setRelease(latestRelease);

        // Check if this version has been seen before
        if (!hasSeenVersion(latestRelease.tag_name)) {
          setShowModal(true);
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
    if (release) {
      setLastSeenVersion(release.tag_name);
    }
    setShowModal(false);
  };

  return {
    release,
    showModal,
    isLoading,
    error,
    closeModal: handleCloseModal,
  };
};

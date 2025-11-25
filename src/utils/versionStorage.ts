const VERSION_STORAGE_KEY = 'lumiose_last_seen_version';

export const getLastSeenVersion = (): string | null => {
  return localStorage.getItem(VERSION_STORAGE_KEY);
};

export const setLastSeenVersion = (version: string): void => {
  localStorage.setItem(VERSION_STORAGE_KEY, version);
};

export const hasSeenVersion = (version: string): boolean => {
  const lastSeenVersion = getLastSeenVersion();
  return lastSeenVersion === version;
};

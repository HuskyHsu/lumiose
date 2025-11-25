export interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
}

export const fetchLatestRelease = async (): Promise<GitHubRelease> => {
  const response = await fetch('https://api.github.com/repos/HuskyHsu/lumiose/releases/latest');

  if (!response.ok) {
    throw new Error(`Failed to fetch release: ${response.status}`);
  }

  const data: GitHubRelease = await response.json();
  return data;
};

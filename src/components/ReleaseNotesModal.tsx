import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { GitHubRelease } from '@/services/releaseService';
import { X } from 'lucide-react';
import React from 'react';

interface ReleaseNotesModalProps {
  releases: GitHubRelease[];
  isOpen: boolean;
  onClose: () => void;
}

export const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({
  releases,
  isOpen,
  onClose,
}) => {
  const [selectedRelease, setSelectedRelease] = React.useState<GitHubRelease | null>(null);

  React.useEffect(() => {
    if (releases && releases.length > 0) {
      setSelectedRelease(releases[0]);
    }
  }, [releases]);

  if (!isOpen || !selectedRelease) return null;

  const formatReleaseBody = (body: string) => {
    // Convert markdown-style formatting to basic HTML
    return body
      .replace(/^######\s+(.*$)/gm, '<h6 class="text-xs">$1</h6>')
      .replace(/^#####\s+(.*$)/gm, '<h5 class="text-sm">$1</h5>')
      .replace(/^####\s+(.*$)/gm, '<h4 class="text-base">$1</h4>')
      .replace(/^###\s+(.*$)/gm, '<h3 class="text-lg">$1</h3>')
      .replace(/^##\s+(.*$)/gm, '<h2 class="text-xl">$1</h2>')
      .replace(/^#\s+(.*$)/gm, '<h1 class="text-2xl">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
      <div className='max-w-4xl w-full max-h-[80vh] flex flex-col'>
        <Card className='bg-white flex flex-col w-full h-full overflow-hidden gap-0'>
          {/* Version Selection Dropdown - Fixed at top */}
          <div className='p-4 border-b bg-gray-50 shrink-0 relative'>
            <select
              className='w-full p-2 border border-gray-300 rounded-md bg-white text-sm pr-10'
              value={selectedRelease.tag_name}
              onChange={(e) => {
                const release = releases.find((r) => r.tag_name === e.target.value);
                if (release) setSelectedRelease(release);
              }}
            >
              {releases.map((release) => (
                <option key={release.tag_name} value={release.tag_name}>
                  {release.name || release.tag_name} -{' '}
                  {new Date(release.published_at).toLocaleDateString('zh-TW')}
                </option>
              ))}
            </select>
            <button
              onClick={onClose}
              className='absolute top-1/2 right-4 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-full transition-colors z-10'
              aria-label='close'
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className='flex-1 overflow-y-auto min-h-0'>
            <CardHeader className='pb-0'>
              <CardTitle className='text-xl flex justify-between items-center pr-8'>
                <span>{selectedRelease.name || selectedRelease.tag_name}</span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className='space-y-4'>
                <div className='text-sm text-gray-600'>
                  Release Date: {new Date(selectedRelease.published_at).toLocaleDateString('zh-TW')}
                </div>

                <div
                  className='prose prose-sm max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: formatReleaseBody(selectedRelease.body),
                  }}
                />
              </div>
            </CardContent>
          </div>

          <CardFooter className='shrink-0 flex justify-between border-t pt-4 bg-white'>
            <a
              href={selectedRelease.html_url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-green-600 hover:text-green-800 text-sm underline'
            >
              GitHub release note
            </a>
            <button
              onClick={onClose}
              className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
            >
              OK
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

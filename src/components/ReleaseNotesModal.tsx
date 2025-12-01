import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { GitHubRelease } from '@/services/releaseService';
import { X } from 'lucide-react';
import React from 'react';

interface ReleaseNotesModalProps {
  release: GitHubRelease;
  isOpen: boolean;
  onClose: () => void;
}

export const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({
  release,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

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
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden'>
        <Card className='bg-white'>
          <CardHeader>
            <CardTitle className='text-xl'>
              🎉 NEW VERSION - {release.name || release.tag_name}
            </CardTitle>
            <CardAction>
              <button
                onClick={onClose}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                aria-label='close'
              >
                <X size={20} />
              </button>
            </CardAction>
          </CardHeader>

          <CardContent className='overflow-y-auto max-h-96'>
            <div className='space-y-4'>
              <div className='text-sm text-gray-600'>
                Release Date: {new Date(release.published_at).toLocaleDateString('zh-TW')}
              </div>

              <div
                className='prose prose-sm max-w-none'
                dangerouslySetInnerHTML={{
                  __html: formatReleaseBody(release.body),
                }}
              />
            </div>
          </CardContent>

          <CardFooter className='flex justify-between'>
            <a
              href={release.html_url}
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

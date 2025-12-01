import { Link } from 'lucide-react';
import React from 'react';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
}

const ShareButton = React.forwardRef<HTMLButtonElement, ShareButtonProps>(
  ({ title = '', text = '', url = '', className = 'h-8 w-8', ...props }, ref) => {
    const handleShare = async () => {
      // Use current URL if no URL is provided
      const shareUrl = url || window.location.href;
      const fullText = text || title || document.title;

      // Check if navigator.share is supported
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: `${fullText}\n`,
            url: shareUrl,
          });
        } catch (error) {
          // User cancelled the share or an error occurred
          console.log('Error sharing:', error);
        }
      } else {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert('URL copied to clipboard!');
        } catch (error) {
          console.log('Error copying to clipboard:', error);
          // Ultimate fallback: show alert with URL
          alert(`Share this URL: ${shareUrl}`);
        }
      }
    };

    return (
      <button ref={ref} onClick={handleShare} type='button' {...props}>
        <Link className={className} />
      </button>
    );
  }
);

ShareButton.displayName = 'ShareButton';

export { ShareButton };
export type { ShareButtonProps };

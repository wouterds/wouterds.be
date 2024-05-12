import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { FileField } from '~/graphql';

export const Image = ({ url, alt, responsiveImage, width, height }: FileField) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpanded(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <div
        className="bg-zinc-50 dark:bg-zinc-800 dark:bg-opacity-25 relative overflow-hidden rounded-sm"
        style={{ aspectRatio: `${width! / height!}` }}>
        {responsiveImage?.base64 && (
          <img className="absolute inset-0 w-full h-full" src={responsiveImage.base64} />
        )}
        <img
          onClick={() => setExpanded(!expanded)}
          className="cursor-pointer relative z-10 w-full"
          loading="lazy"
          src={`/images/thumb${new URL(url).pathname}`}
          alt={alt || undefined}
        />
      </div>

      {expanded &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 p-6"
            onClick={() => setExpanded(false)}>
            <button
              className="absolute top-4 right-4 p-1 text-white rounded-sm hover:bg-zinc-300 hover:bg-opacity-10"
              onClick={() => setExpanded(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
            <img
              className="max-w-full max-h-full bg-zinc-50 dark:bg-zinc-800 dark:bg-opacity-25 rounded-sm"
              src={`/images${new URL(url).pathname}`}
              alt={alt || undefined}
              loading="lazy"
            />
          </div>,
          document.getElementById('modal-portal')!,
        )}
    </>
  );
};

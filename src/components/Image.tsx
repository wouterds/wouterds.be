import { XMarkIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export type ImageProps = {
  url: string;
  alt?: string | null;
};

export const Image = ({ url, alt }: ImageProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <img
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer hover:opacity-95 hover:dark:opacity-90 transition-opacity ease-in-out"
        loading="lazy"
        src={`/images${new URL(url).pathname}`}
        alt={alt || undefined}
      />

      {expanded &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 p-6"
            onClick={() => setExpanded(false)}>
            <button
              className="absolute top-4 right-4 p-1 text-white rounded hover:bg-zinc-300 hover:bg-opacity-10"
              onClick={() => setExpanded(false)}>
              <XMarkIcon className="w-6 h-6" />
            </button>
            <img
              className="max-w-full max-h-full bg-zinc-50 dark:bg-zinc-800 dark:bg-opacity-25"
              src={`/images${new URL(url).pathname}`}
              alt={alt || undefined}
            />
          </div>,
          document.getElementById('modal-portal')!,
        )}
    </>
  );
};

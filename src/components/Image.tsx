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
        className="cursor-pointer"
        loading="lazy"
        src={`/images${new URL(url).pathname}`}
        alt={alt || undefined}
      />

      {expanded &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 cursor-pointer p-6"
            onClick={() => setExpanded(false)}>
            <img
              className="max-w-full max-h-full pointer-events-none bg-zinc-50 dark:bg-zinc-800 dark:bg-opacity-25"
              src={`/images${new URL(url).pathname}`}
              alt={alt || undefined}
            />
          </div>,
          document.getElementById('modal-portal')!,
        )}
    </>
  );
};

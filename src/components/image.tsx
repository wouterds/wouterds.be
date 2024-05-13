import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { FileField } from '~/graphql';
import { humanReadableSize } from '~/lib/utils';

import Loader from './loader';

export const Image = ({ url, alt, responsiveImage, width, height, size }: FileField) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expanded) {
      setLoading(true);
    }
  }, [expanded]);

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
        className="bg-zinc-50 dark:bg-zinc-800 dark:bg-opacity-25 relative overflow-hidden rounded-sm w-full"
        style={{ aspectRatio: `${width! / height!}` }}>
        {responsiveImage?.base64 && (
          <img className="absolute inset-0 w-full h-full" src={responsiveImage.base64} />
        )}
        <img
          onClick={() => setExpanded(!expanded)}
          className="cursor-pointer relative z-10 w-full"
          loading="lazy"
          src={`/images/thumb${new URL(url).pathname}`}
          alt={alt!}
        />
      </div>

      {expanded &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-95 flex"
            onClick={() => setExpanded(false)}>
            <div className="flex-1 relative flex items-center justify-center my-12 mx-6">
              {responsiveImage?.base64 && (
                <img
                  className="max-w-full max-h-full flex-1 absolute w-full object-contain"
                  style={{ aspectRatio: `${width! / height!}` }}
                  src={responsiveImage.base64}
                />
              )}
              <img
                className="max-w-full max-h-full flex-1 object-contain absolute w-full"
                style={{ aspectRatio: `${width! / height!}` }}
                src={`/images/thumb${new URL(url).pathname}`}
                alt={alt!}
              />
              <img
                className="max-w-full max-h-full flex-1 object-contain absolute w-full"
                style={{ aspectRatio: `${width! / height!}` }}
                src={`/images${new URL(url).pathname}`}
                alt={alt!}
                onLoad={() => setLoading(false)}
              />
            </div>
            <p className="text-white text-opacity-30 text-xs absolute bottom-4 left-6 flex gap-2.5 items-center">
              <span>
                {width}x{height}, {humanReadableSize(size)}
              </span>
              {loading && <Loader />}
            </p>
            <button
              className="z-50 absolute top-2.5 right-3 sm:top-3.5 sm:right-4 text-white text-opacity-90 hover:text-opacity-100 rounded-sm hover:bg-zinc-300 hover:bg-opacity-10 aspect-square w-7 h-7 text-2xl"
              onClick={() => setExpanded(false)}>
              <span className="relative" style={{ top: -3 }}>
                &times;
              </span>
            </button>
          </div>,
          document.getElementById('modal-portal')!,
        )}
    </>
  );
};

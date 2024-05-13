import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { FileField } from '~/graphql';
import { humanReadableSize } from '~/lib/utils';

import Loader from './loader';

interface Props extends FileField {
  images: FileField[];
}

export const Image = ({ id, images }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    images?.findIndex((image) => image.id === id) || 0,
  );

  const { url, alt, responsiveImage, width, height, size } = useMemo(
    () => images[activeIndex]!,
    [activeIndex, images],
  );

  const onNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const onPrevious = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if (expanded) {
      setLoading(true);
    }
  }, [expanded, activeIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpanded(false);
      }

      if (event.key === 'ArrowRight') {
        onNext();
      }

      if (event.key === 'ArrowLeft') {
        onPrevious();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNext, onPrevious, setExpanded]);

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
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm flex">
            <header className="absolute z-20 top-4 left-4 right-4 flex items-center justify-end">
              <button
                title="Close"
                className="text-white text-opacity-90 hover:text-opacity-100 rounded-sm hover:bg-zinc-300 hover:bg-opacity-10 aspect-square w-7 h-7 text-lg inline-flex items-center justify-center"
                onClick={() => setExpanded(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  width="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-x">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M18 6l-12 12" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </header>
            <nav className="absolute z-10 top-0 bottom-0 left-4 right-4 flex items-center justify-between">
              <button
                title="Previous image"
                className="text-white text-opacity-90 hover:text-opacity-100 rounded-sm hover:bg-zinc-300 hover:bg-opacity-10 aspect-square w-7 h-7 text-xl inline-flex items-center justify-center"
                onClick={onPrevious}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  width="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M15 6l-6 6l6 6" />
                </svg>
              </button>
              <button
                title="Next image"
                className="text-white text-opacity-90 hover:text-opacity-100 rounded-sm hover:bg-zinc-300 hover:bg-opacity-10 aspect-square w-7 h-7 text-xl inline-flex items-center justify-center"
                onClick={onNext}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  width="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 6l6 6l-6 6" />
                </svg>
              </button>
            </nav>
            <div className="flex-1 relative flex items-center justify-center my-12 mx-6">
              {responsiveImage?.base64 && (
                <img
                  key={`${id}-responsive`}
                  className="max-w-full max-h-full flex-1 absolute w-full object-contain"
                  style={{ aspectRatio: `${width! / height!}` }}
                  src={responsiveImage.base64}
                />
              )}
              <img
                key={`${id}-lowres`}
                className="max-w-full max-h-full flex-1 object-contain absolute w-full"
                style={{ aspectRatio: `${width! / height!}` }}
                src={`/images/thumb${new URL(url).pathname}`}
                alt={alt!}
              />
              <img
                key={`${id}-highres`}
                className="max-w-full max-h-full flex-1 object-contain absolute w-full"
                style={{ aspectRatio: `${width! / height!}` }}
                src={`/images${new URL(url).pathname}`}
                alt={alt!}
                onLoad={() => setLoading(false)}
              />
            </div>
            <footer>
              <p className="text-white text-opacity-30 text-xs absolute bottom-4 left-4 flex gap-2.5 items-center">
                <span>
                  {width}x{height}, {humanReadableSize(size)}
                </span>
                {loading && <Loader />}
              </p>
            </footer>
          </div>,
          document.getElementById('modal-portal')!,
        )}
    </>
  );
};

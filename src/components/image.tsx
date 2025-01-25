import type { FileField } from '~/graphql';

type Props = FileField;

export const Image = ({ width, height, responsiveImage, url, alt }: Props) => {
  return (
    <a
      href={`/images${new URL(url).pathname}`}
      target="_blank"
      className="m-0 p-0 block bg-zinc-50 relative overflow-hidden rounded-sm w-full"
      style={{ aspectRatio: `${width! / height!}` }}
      rel="noreferrer">
      {responsiveImage?.base64 && (
        <img className="absolute inset-0 w-full h-full" src={responsiveImage.base64} />
      )}
      <img
        className="cursor-pointer relative z-10 w-full"
        loading="lazy"
        srcSet={`/images/768${new URL(url).pathname} 1x, /images/1024${new URL(url).pathname} 2x`}
        src={`/images/768${new URL(url).pathname}`}
        alt={alt!}
      />
    </a>
  );
};

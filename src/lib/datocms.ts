import { render } from 'datocms-structured-text-to-plain-text';
import { StructuredText } from 'datocms-structured-text-utils';

import { GalleryRecord } from '~/graphql';

export const plainTextFromContent = (content: StructuredText) => {
  return render(content)?.trim();
};

export const excerptFromContent = (content: StructuredText, length = 240) => {
  return (
    plainTextFromContent(content)
      ?.slice(0, Math.max(length - 2, 0))
      ?.split(' ')
      .slice(0, -1)
      ?.join(' ')
      ?.trim() + '…'
  );
};

export const imagesFromContent = (content?: StructuredText) => {
  const images: GalleryRecord['images'] = [];

  const blocks = (content?.blocks || []) as GalleryRecord[];
  for (const block of blocks) {
    if (block.__typename === 'GalleryRecord') {
      images.push(...block.images);
    }
  }

  return images;
};

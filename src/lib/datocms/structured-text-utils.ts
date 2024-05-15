import { render, StructuredTextDocument } from 'datocms-structured-text-to-plain-text';

import { GalleryRecord, Scalars } from '~/graphql';

type Content = {
  value: Scalars['JsonField']['output'];
  links?: unknown[];
  blocks?: unknown[];
};

export const plainTextFromContent = (content: Content) => {
  return render(content as unknown as StructuredTextDocument)?.trim();
};

export const excerptFromContent = (content: Content, length = 240) => {
  return (
    plainTextFromContent(content)
      ?.slice(0, Math.max(length - 2, 0))
      ?.split(' ')
      .slice(0, -1)
      ?.join(' ')
      ?.trim() + '…'
  );
};

export const imagesFromContent = (content?: Content) => {
  const images: GalleryRecord['images'] = [];

  const blocks = (content?.blocks || []) as GalleryRecord[];
  for (const block of blocks) {
    if (block.__typename === 'GalleryRecord') {
      images.push(...block.images);
    }
  }

  return images;
};

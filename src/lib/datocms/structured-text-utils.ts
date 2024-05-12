import { render, StructuredTextDocument } from 'datocms-structured-text-to-plain-text';

import { Scalars } from '~/graphql';

export const plainTextFromContent = (content: {
  value: Scalars['JsonField']['output'];
  links?: unknown[];
  blocks?: unknown[];
}) => {
  return render(content as unknown as StructuredTextDocument)?.trim();
};

export const excerptFromContent = (
  content: {
    value: Scalars['JsonField']['output'];
    links?: unknown[];
    blocks?: unknown[];
  },
  length = 240,
) => {
  return (
    plainTextFromContent(content)
      ?.slice(0, Math.max(length - 2, 0))
      ?.split(' ')
      .slice(0, -1)
      ?.join(' ')
      ?.trim() + '…'
  );
};

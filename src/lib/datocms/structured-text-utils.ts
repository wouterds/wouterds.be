import { render, StructuredTextDocument } from 'datocms-structured-text-to-plain-text';

import { Scalars } from '~/graphql';

export const plainTextFromContent = (content: {
  value: Scalars['JsonField']['output'];
  links?: unknown[];
  blocks?: unknown[];
}) => {
  return render(content as unknown as StructuredTextDocument)?.trim();
};

export const excerptFromContent = (content: {
  value: Scalars['JsonField']['output'];
  links?: unknown[];
  blocks?: unknown[];
}) => {
  return (
    plainTextFromContent(content)?.slice(0, 240)?.split(' ').slice(0, -1)?.join(' ')?.trim() + '…'
  );
};

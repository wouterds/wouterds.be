import {
  render,
  StructuredTextDocument,
} from 'datocms-structured-text-to-plain-text';

export const extractDescriptionFromContent = (
  content: StructuredTextDocument,
) => {
  return (
    render(content)?.slice(0, 180)?.split(' ').slice(0, -1)?.join(' ')?.trim() +
    '...'
  );
};

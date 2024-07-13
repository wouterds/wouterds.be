import { StructuredText } from 'datocms-structured-text-utils';

import { excerptFromContent, plainTextFromContent } from './datocms';

describe('datocms', () => {
  describe('plainTextFromContent', () => {
    it('should return plain text from content', () => {
      // given
      const content = {
        schema: 'dast',
        document: {
          type: 'root',
          children: [
            {
              type: 'heading',
              level: 1,
              children: [
                {
                  type: 'span',
                  value: 'Hello, world!',
                },
              ],
            },
          ],
        },
      } as unknown as StructuredText;

      // when
      const result = plainTextFromContent(content);

      // then
      expect(result).toEqual('Hello, world!');
    });
  });

  describe('excerptFromContent', () => {
    it('should return excerpt from content', () => {
      // given
      const content = {
        schema: 'dast',
        document: {
          type: 'root',
          children: [
            {
              type: 'heading',
              level: 1,
              children: [
                {
                  type: 'span',
                  value: 'Hello, world!',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'span',
                  value: 'This is test content.',
                },
              ],
            },
          ],
        },
      } as unknown as StructuredText;

      // when
      const result = excerptFromContent(content);

      // then
      expect(result).toEqual('Hello, world!\nThis is test…');
    });
  });
});

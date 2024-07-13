import { StructuredText } from 'datocms-structured-text-utils';

import { plainTextFromContent } from './datocms';

describe('datocms', () => {
  describe('plainTextFromContent', () => {
    it('should return plain text from content', () => {
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

      expect(plainTextFromContent(content)).toBe('Hello, world!');
    });
  });
});

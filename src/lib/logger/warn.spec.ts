import { faker } from '@faker-js/faker';

const prefixedLog = jest.fn();

jest.mock('./prefixed-log', () => ({
  prefixedLog,
}));

import { warn } from './warn';

describe('warn', () => {
  it('should call prefixedLog with "warn" prefix & passed message', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    warn(message);

    // then
    expect(prefixedLog).toHaveBeenCalledWith('warn', message);
  });
});

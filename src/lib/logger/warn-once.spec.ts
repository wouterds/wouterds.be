import { faker } from '@faker-js/faker';

const prefixedLog = jest.fn();

jest.mock('./prefixed-log', () => ({
  prefixedLog,
}));

import { warnOnce } from './warn-once';

beforeEach(() => {
  prefixedLog.mockClear();
});

describe('warnOnce', () => {
  it('should call prefixedLog with "warn" prefix & passed message', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    warnOnce(message);

    // then
    expect(prefixedLog).toHaveBeenCalledWith('warn', message);
  });

  it('should call prefixedLog with "warn" prefix & passed message only once', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    warnOnce(message);
    warnOnce(message);

    // then
    expect(prefixedLog).toHaveBeenCalledTimes(1);
  });
});

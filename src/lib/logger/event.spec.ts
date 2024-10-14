import { faker } from '@faker-js/faker';

const prefixedLog = jest.fn();

jest.mock('./prefixed-log', () => ({
  prefixedLog,
}));

import { event } from './event';

describe('event', () => {
  it('should call prefixedLog with "event" prefix & passed message', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    event(message);

    // then
    expect(prefixedLog).toHaveBeenCalledWith('event', message);
  });
});

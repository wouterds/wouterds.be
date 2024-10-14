import { faker } from '@faker-js/faker';

const prefixedLog = jest.fn();

jest.mock('./prefixed-log', () => ({
  prefixedLog,
}));

import { wait } from './wait';

describe('wait', () => {
  it('should call prefixedLog with "wait" prefix & passed message', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    wait(message);

    // then
    expect(prefixedLog).toHaveBeenCalledWith('wait', message);
  });
});

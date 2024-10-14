import { faker } from '@faker-js/faker';

const prefixedLog = jest.fn();

jest.mock('./prefixed-log', () => ({
  prefixedLog,
}));

import { error } from './error';

describe('error', () => {
  it('should call prefixedLog with "error" prefix & passed message', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    error(message);

    // then
    expect(prefixedLog).toHaveBeenCalledWith('error', message);
  });
});

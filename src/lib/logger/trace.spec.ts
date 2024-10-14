import { faker } from '@faker-js/faker';

const prefixedLog = jest.fn();

jest.mock('./prefixed-log', () => ({
  prefixedLog,
}));

import { trace } from './trace';

describe('trace', () => {
  it('should call prefixedLog with "trace" prefix & passed message', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    trace(message);

    // then
    expect(prefixedLog).toHaveBeenCalledWith('trace', message);
  });
});

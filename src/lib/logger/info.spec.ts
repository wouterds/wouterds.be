import { faker } from '@faker-js/faker';

const prefixedLog = jest.fn();

jest.mock('./prefixed-log', () => ({
  prefixedLog,
}));

import { info } from './info';

describe('info', () => {
  it('should call prefixedLog with "info" prefix & passed message', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    info(message);

    // then
    expect(prefixedLog).toHaveBeenCalledWith('info', message);
  });
});

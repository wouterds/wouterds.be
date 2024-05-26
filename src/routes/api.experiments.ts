import { json, LoaderFunctionArgs } from '@remix-run/cloudflare';

import { AranetRepository } from '~/data/repositories/aranet-repository';
import { TeslaRepository } from '~/data/repositories/tesla-repository';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const tesla = TeslaRepository.create(context);
  const aranet = AranetRepository.create(context);

  return json({
    aranet: await aranet.getLast(),
    tesla: await tesla.getLast(),
  });
};

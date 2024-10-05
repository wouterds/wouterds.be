import 'dotenv/config';

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { fromUnixTime, isSameDay } from 'date-fns';

import { AranetReadings } from '~/database/aranet-readings/repository';
import { AuthTokens } from '~/database/auth-tokens/repository';
import { P1Readings } from '~/database/p1-readings/repository';
import { TeslaData } from '~/database/tesla-data/repository';
import { Spotify } from '~/lib/spotify';
import { Tesla } from '~/lib/tesla';

const readDataFile = (filename: string) => {
  const dir = dirname(fileURLToPath(import.meta.url));
  const path = resolve(dir, 'data', filename);

  return JSON.parse(readFileSync(path, 'utf-8'));
};

const cf_aranet = readDataFile('aranet.json');
const cf_tokens = readDataFile('tokens.json');
const cf_p1 = readDataFile('p1.json');
const cf_p1_history = readDataFile('p1-history.json');
const cf_tesla = readDataFile('tesla.json');

const migrateAranet = async () => {
  await AranetReadings.truncate();
  console.log('Truncated aranet readings');

  for (const data of cf_aranet) {
    await AranetReadings.add({
      temperature: data.temperature,
      humidity: data.humidity,
      co2: data.co2,
      pressure: data.pressure,
      battery: data.battery,
      created_at: fromUnixTime(data.time),
    });
  }

  const data = await AranetReadings.getAll();
  console.log('Inserted', data.length, 'aranet readings');
};

const migrateP1 = async () => {
  await P1Readings.truncate();
  console.log('Truncated p1 readings');

  for (const data of cf_p1) {
    let peak = 0;
    let peaked_at = new Date(0);

    for (const history of cf_p1_history) {
      if (isSameDay(fromUnixTime(history.peakTime), fromUnixTime(data.time))) {
        peak = history.peak;
        peaked_at = fromUnixTime(history.peakTime);
      }
    }

    await P1Readings.add({
      active: data.active,
      total: data.total,
      peak,
      peaked_at,
      created_at: fromUnixTime(data.time),
    });
  }

  const data = await P1Readings.getAll();
  console.log('Inserted', data.length, 'p1 readings');
};

const migrateTeslaData = async () => {
  await TeslaData.truncate();
  console.log('Truncated tesla data');

  for (const data of cf_tesla) {
    await TeslaData.add({
      battery: data.battery,
      distance: data.distance,
      wake: data.wake,
      created_at: fromUnixTime(data.time),
    });
  }

  const data = await TeslaData.getAll();
  console.log('Inserted', data.length, 'tesla data records');
};

const migrateTokens = async () => {
  await AuthTokens.truncate();
  console.log('Truncated auth tokens');

  const decoded = JSON.parse(Buffer.from(cf_tokens, 'base64').toString('utf-8'));

  for (const [vendor, tokens] of Object.entries(decoded)) {
    switch (vendor) {
      case 'spotify':
        await AuthTokens.add('SPOTIFY', 'REFRESH_TOKEN', {
          token: (tokens as { refreshToken: string }).refreshToken,
        });
        break;
      case 'tesla':
        await AuthTokens.add('TESLA', 'REFRESH_TOKEN', {
          token: (tokens as { refreshToken: string }).refreshToken,
        });
        break;
    }
  }

  await Promise.all([
    new Tesla((await AuthTokens.get('TESLA', 'REFRESH_TOKEN'))!.token).exchangeToken(),
    new Spotify((await AuthTokens.get('SPOTIFY', 'REFRESH_TOKEN'))!.token).exchangeToken(),
  ]);
};

(async () => {
  await Promise.all([migrateAranet(), migrateP1(), migrateTeslaData(), migrateTokens()]);

  process.exit(0);
})();

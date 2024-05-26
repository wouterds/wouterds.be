import { formatDistanceToNowStrict, fromUnixTime } from 'date-fns';
import { useState } from 'react';

import { useInterval } from './use-interval';

export const useTimeDistance = (timestamp?: number) => {
  const [distance, setDistance] = useState(
    timestamp
      ? formatDistanceToNowStrict(fromUnixTime(timestamp), {
          addSuffix: true,
        })
      : null,
  );

  useInterval(() => {
    if (timestamp) {
      setDistance(
        formatDistanceToNowStrict(fromUnixTime(timestamp), {
          addSuffix: true,
        }),
      );
    }
  }, 1000);

  return distance;
};

import { formatDistanceToNowStrict } from 'date-fns';
import { useState } from 'react';

import { useInterval } from './use-interval';

export const useTimeAgo = (date?: Date) => {
  const [distance, setDistance] = useState(
    date ? formatDistanceToNowStrict(date, { addSuffix: true }) : null,
  );

  useInterval(() => {
    if (date) {
      setDistance(formatDistanceToNowStrict(date, { addSuffix: true }));
    }
  }, 1000);

  return distance;
};

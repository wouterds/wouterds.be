import ms from 'ms';
import { useEffect, useState } from 'react';

export const useTick = (delay: number | string) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setTick((tick) => tick + 1);
      },
      typeof delay === 'number' ? delay : ms(delay),
    );

    return () => clearInterval(interval);
  }, [delay]);

  return tick;
};

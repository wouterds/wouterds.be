import { useEffect, useState } from 'react';

export const useTick = (delay: number) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => tick + 1);
    }, delay);

    return () => clearInterval(interval);
  }, [delay]);

  return tick;
};

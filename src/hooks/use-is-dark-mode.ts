import { useEffect, useState } from 'react';

export const useIsDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== 'undefined' && window?.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handler = () => setIsDarkMode(mediaQuery.matches);

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  return isDarkMode;
};

import { useEffect, useState } from 'react';

const time = 125;
const characters = ['|', '/', '-', '\\'];

const TextSpinner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(index + 1 >= characters.length ? 0 : index + 1);
    }, time);

    return () => clearInterval(interval);
  }, [index, setIndex]);

  return <>{characters[index]}</>;
};

export default TextSpinner;

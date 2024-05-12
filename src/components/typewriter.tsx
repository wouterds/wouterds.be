import { useEffect, useState } from 'react';

type Props = {
  children: string;
  interval: number;
  delay: number;
};

const Typewriter = ({ children, interval, delay }: Props) => {
  const [blinkingBlock, setBlinkingBlock] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    setCurrentText('');
    setCurrentIndex(0);
    setEnded(false);
  }, [children]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (ended) {
      return;
    }

    const timeout = setTimeout(() => {
      setBlinkingBlock((prevBlinkingBlock) => !prevBlinkingBlock);
    }, 400);

    return () => clearTimeout(timeout);
  }, [ended, blinkingBlock]);

  useEffect(() => {
    if (!started || ended) {
      return;
    }

    if (currentIndex < children.length) {
      const timeout = setTimeout(
        () => {
          setCurrentText((prevText) => prevText + children[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        },
        interval * (Math.random() * 0.6 + 0.7),
      );

      return () => clearTimeout(timeout);
    } else {
      setEnded(true);
    }
  }, [started, ended, currentIndex, interval, children]);

  return (
    <span className="relative">
      {currentText}
      {!ended && (blinkingBlock || started) && '█'}
    </span>
  );
};

export default Typewriter;

import { Link } from '@remix-run/react';

import Typewriter from './typewriter';

type Props = {
  ray?: string | null;
};

const Footer = ({ ray }: Props) => {
  return (
    <>
      <footer className="border-t border-b border-dashed border-zinc-900 dark:border-zinc-100 py-3">
        <div className="flex justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} Wouter De Schuyter</p>
          <p>
            <Link to="/experiments" title="experiments">
              experiments
            </Link>
          </p>
        </div>
      </footer>

      {ray && (
        <p className="text-center text-zinc-400 dark:text-zinc-500 mt-3">
          <Typewriter delay={3000} interval={150}>
            {ray}
          </Typewriter>
        </p>
      )}
    </>
  );
};

export default Footer;

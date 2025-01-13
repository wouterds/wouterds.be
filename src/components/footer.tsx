import { Link } from 'react-router';

import Typewriter from './typewriter';

type Props = {
  ray?: string | null;
};

const Footer = ({ ray }: Props) => {
  return (
    <>
      <footer className="border-t border-b border-dashed border-zinc-900 py-3 text-nowrap">
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
        <p className="text-center text-zinc-400 mt-3">
          <Typewriter delay={3000} interval={150}>
            {`${ray || ' '}`}
          </Typewriter>
        </p>
      )}
    </>
  );
};

export default Footer;

import { Link } from '@remix-run/react';

type Props = {
  ray?: string | null;
};

const Footer = ({ ray }: Props) => {
  return (
    <footer className="border-t border-dashed border-zinc-900 dark:border-zinc-100 py-3">
      <div className="flex justify-between gap-2 mb-12">
        <p>&copy; {new Date().getFullYear()} Wouter De Schuyter</p>
        <p>
          <Link to="/experiments">experiments</Link>
        </p>
      </div>

      {ray && (
        <p className="text-center text-zinc-300 dark:text-zinc-600 text-xs py-2">
          {ray}
        </p>
      )}
    </footer>
  );
};

export default Footer;

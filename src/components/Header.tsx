import { Link } from '@remix-run/react';

const Header = () => (
  <header className="py-3 flex justify-between">
    <ul className="flex justify-end items-center gap-2.5">
      <li>
        <Link to="/" prefetch="intent">
          Wouter De Schuyter
        </Link>
      </li>
    </ul>
    <ul className="flex justify-end items-center gap-2.5">
      <li>
        <Link to="/about" prefetch="intent">
          about
        </Link>
      </li>
      <li>
        <Link to="/contact" prefetch="intent">
          contact
        </Link>
      </li>
    </ul>
  </header>
);

export default Header;

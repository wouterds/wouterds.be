import { Link } from 'react-router';

const Header = () => (
  <header className="border-t border-b border-dashed border-zinc-900 dark:border-zinc-100 py-3">
    <ul className="flex justify-end items-center gap-2.5">
      <li>
        <Link to="/" prefetch="intent">
          /
        </Link>
      </li>
      <li>
        <Link to="/about" prefetch="intent">
          about
        </Link>
      </li>
      <li>
        <Link to="/blog" prefetch="intent">
          blog
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

import { Link } from 'react-router';

const Header = () => (
  <header className="px-8 py-3 mt-6 mb-12">
    <nav className="flex justify-between">
      <Link to="/">
        <img src="/images/logo.svg" alt="Home" className="h-8" />
      </Link>
      <ul className="flex justify-end items-center -m-3">
        <li>
          <HeaderLink to="/blog">Blog</HeaderLink>
        </li>
        <li>
          <HeaderLink to="/contact">Contact</HeaderLink>
        </li>
      </ul>
    </nav>
  </header>
);

const HeaderLink = ({ children, to }: { children: React.ReactNode; to: string }) => (
  <Link
    to={to}
    prefetch="intent"
    className="text-gray-400 hover:text-gray-500 transition-colors duration-500 p-3">
    {children}
  </Link>
);

export default Header;

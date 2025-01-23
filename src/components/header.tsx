import { Link } from 'react-router';

import { Logo } from './logo';

const Header = () => (
  <header className="px-6 sm:px-8 py-3 mt-6 mb-12">
    <nav className="flex justify-between">
      <Link to="/" title="Home" className="inline-block relative text-2xl group">
        <Logo className="text-rose-400 absolute top-0 transition-transform duration-500 group-hover:translate-x-[-1px] group-hover:translate-y-[-1px]" />
        <Logo className="text-cyan-400 absolute top-0 transition-transform duration-500 group-hover:translate-x-[1px] group-hover:translate-y-[1px]" />
        <Logo className="relative" />
      </Link>
      <ul className="flex justify-end items-center -m-2.5">
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
  <Link to={to} prefetch="intent" className="text-gray-400 hover:text-gray-500 no-underline p-2.5">
    {children}
  </Link>
);

export default Header;

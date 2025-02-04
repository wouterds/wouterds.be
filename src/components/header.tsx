import { SiBluesky, SiGithub, SiInstagram, SiRss } from '@icons-pack/react-simple-icons';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { Logo } from './logo';

const Header = () => (
  <header className="px-6 sm:px-8 py-3 mt-6 mb-12">
    <nav className="flex justify-between">
      <Link to="/" title="Home" className="inline-block relative text-2xl group">
        <Logo className="text-rose-400 absolute top-0 transition-transform duration-300 group-hover:translate-x-[-1px] group-hover:translate-y-[-1px]" />
        <Logo className="text-cyan-400 absolute top-0 transition-transform duration-300 group-hover:translate-x-[1px] group-hover:translate-y-[1px]" />
        <Logo className="relative" />
      </Link>
      <ul className="flex justify-end items-center -m-2.5">
        <HeaderLink to="/blog">Blog</HeaderLink>
        <HeaderLink to="/contact">Contact</HeaderLink>
        <HeaderLink
          to="https://bsky.app/profile/wouterds.com"
          target="_blank"
          rel="noopener noreferrer">
          <SiBluesky className="size-4" />
        </HeaderLink>
        <HeaderLink to="https://instagram.com/wouterds" target="_blank" rel="noopener noreferrer">
          <SiInstagram className="size-4" />
        </HeaderLink>
        <HeaderLink to="https://github.com/wouterds" target="_blank" rel="noopener noreferrer">
          <SiGithub className="size-4" />
        </HeaderLink>
        <HeaderLink to="/feed.xml" target="_blank" rel="noopener noreferrer">
          <SiRss className="size-3.5" />
        </HeaderLink>
      </ul>
    </nav>
  </header>
);

const HeaderLink = ({
  children,
  to,
  target,
  rel,
  className,
}: {
  children: ReactNode;
  to: string;
  target?: string;
  rel?: string;
  className?: string;
}) => (
  <li className={clsx('flex flex-1 h-full items-center justify-center', className)}>
    <Link
      to={to}
      target={target}
      rel={rel}
      prefetch={!target ? 'intent' : undefined}
      className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-300 no-underline p-2.5 flex-1 flex items-center justify-center h-full">
      {children}
    </Link>
  </li>
);

export default Header;

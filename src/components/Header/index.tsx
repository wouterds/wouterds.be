import React from 'react';
import Link from 'next/link';
import { Container, Title, Nav, Logo } from './styles';
import { withRouter, NextRouter } from 'next/router';

interface Props {
  router: NextRouter;
  hideLogo?: boolean;
  transparent?: boolean;
}

export const Header = (props: Props) => {
  const { router, hideLogo, transparent = false } = props;

  return (
    <Container>
      {hideLogo !== true && (
        <Title transparent={transparent}>
          <Link href="/">
            <a>
              <Logo />
              <h1>Wouter De Schuyter</h1>
            </a>
          </Link>
        </Title>
      )}
      <Nav transparent={transparent}>
        <Link href="/about">
          <a
            className={
              router.pathname.indexOf('/about') !== -1 ? 'active' : undefined
            }
          >
            About
          </a>
        </Link>
        <Link href="/blog">
          <a
            className={
              router.pathname.indexOf('/blog') !== -1 ? 'active' : undefined
            }
          >
            Blog
          </a>
        </Link>
        <Link href="/contact">
          <a
            className={
              router.pathname.indexOf('/contact') !== -1 ? 'active' : undefined
            }
          >
            Contact
          </a>
        </Link>
      </Nav>
    </Container>
  );
};

export default withRouter(Header);

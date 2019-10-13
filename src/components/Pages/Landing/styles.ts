import styled from 'styled-components';

export const Links = styled.div`
  text-align: right;
  margin-top: 2.5em;

  a {
    font-size: ${16 / 19.2}em;
    font-weight: 500;
    border: 0;
    color: var(--color-alternative-link);
    transition: color ease-in-out 200ms;

    @media (max-width: 640px) {
      font-size: 1em;
    }

    &:hover {
      color: var(--color-text-dark);
      text-decoration: none;
    }
  }
`;

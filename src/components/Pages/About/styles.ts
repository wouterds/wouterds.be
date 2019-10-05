import styled, { css } from 'styled-components';

export const Container = styled.div`
  .age {
    font-variant-numeric: tabular-nums;
  }
`;

export const Social = styled.div`
  margin-top: 50px;

  h2 {
    margin-bottom: 0.75em;
  }

  a {
    color: #fff;
  }
`;

export const SocialLink = styled.a<{
  twitter?: boolean;
  facebook?: boolean;
  instagram?: boolean;
  linkedIn?: boolean;
  github?: boolean;
}>`
  font-size: 26px;
  height: 48px;
  width: 48px;
  border-radius: 24px;
  line-height: 47px;
  display: inline-block;
  text-align: center;
  transition: background ease-in-out 200ms;

  + a {
    margin-left: 16px;
  }

  ${({ twitter }) =>
    twitter &&
    css`
      background: #00aced;

      &:hover {
        background: #0099d4;
      }
    `}

  ${({ facebook }) =>
    facebook &&
    css`
      background: #354e8b;

      &:hover {
        background: #2e4479;
      }
    `}

  ${({ instagram }) =>
    instagram &&
    css`
      background: linear-gradient(
        #6559ca,
        #bc318f 30%,
        #e33f5f 50%,
        #f77638 70%,
        #fec66d 100%
      );

      &:hover {
        background: linear-gradient(
          #5346c4,
          #a82c80 30%,
          #e0294c 50%,
          #f6651f 70%,
          #febc54 100%
        );
      }
    `}

    ${({ linkedIn }) =>
      linkedIn &&
      css`
        background: #0f6baa;

        &:hover {
          background: #0d5c93;
        }
      `}

    ${({ github }) =>
      github &&
      css`
        background: #2d2d2d;

        &:hover {
          background: #202020;
        }
      `}
`;

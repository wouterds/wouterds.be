import type { Config } from 'tailwindcss';

const css = {
  h1: { fontWeight: '600' },
  h2: { fontWeight: '600' },
  h3: { fontWeight: '600' },
  blockquote: { fontWeight: 'inherit' },
  pre: { fontSize: '1.1em', color: '#202021', background: '#F9FBFC !important' },
  'p > code': {
    color: '#db2756',
    padding: '0.15em 0.3em',
    borderRadius: '0.3em',
    fontWeight: '400',
    backgroundColor: '#f9f2f4',
    fontSize: 'inherit',
    '&:before': {
      content: 'normal',
    },
    '&:after': {
      content: 'normal',
    },
  },
};

export default {
  content: ['./src/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      typography: {
        DEFAULT: { css },
        xs: { css },
        sm: { css },
        base: { css },
        md: { css },
        lg: { css },
        xl: { css },
        '2xl': { css },
        '3xl': { css },
        '4xl': { css },
        '5xl': { css },
        '6xl': { css },
        '7xl': { css },
        dark: {
          css: {
            ...css,
            'p > code': {
              backgroundColor: '#2e2124',
              color: '#f24e79',
            },
            pre: { fontSize: '1.1em', color: '#F9FBFC', background: '#202021 !important' },
          },
        },
      },
    },
  },
  variants: {
    extend: {
      typography: ['dark'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;

import type { Config } from 'tailwindcss';

const css = {
  h1: { fontWeight: '600' },
  h2: { fontWeight: '600' },
  h3: { fontWeight: '600' },
  blockquote: { fontWeight: 'inherit' },
  pre: { fontSize: '0.85em', color: '#202021', background: '#F9FBFC !important', overflow: 'auto' },
  'p > code': {
    color: '#db2756',
    padding: '0.15em 0.3em',
    borderRadius: '0.3em',
    fontWeight: '400',
    fontSize: '0.85em',
    backgroundColor: '#f9f2f4',
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
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: [
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
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;

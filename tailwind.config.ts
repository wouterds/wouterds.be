import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      typography: (_theme: string) => ({
        DEFAULT: {
          css: {
            h1: { fontWeight: '600' },
            h2: { fontWeight: '600' },
            h3: { fontWeight: '600' },
            blockquote: { fontWeight: 'inherit' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;

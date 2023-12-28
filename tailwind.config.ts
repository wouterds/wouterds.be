import type { Config } from 'tailwindcss';

const customizations = {
  h1: { fontWeight: '600' },
  h2: { fontWeight: '600' },
  h3: { fontWeight: '600' },
  blockquote: { fontWeight: 'inherit' },
  pre: { fontSize: 'inherit' },
};

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: { css: customizations },
        sm: { css: customizations },
        lg: { css: customizations },
        xl: { css: customizations },
        '2xl': { css: customizations },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;

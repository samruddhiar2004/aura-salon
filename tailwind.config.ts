import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        salon: {
          50: '#FAF8F5',
          100: '#F4EFE6',
          200: '#E8DEC9',
          300: '#D5C4A3',
          400: '#C2A77B',
          500: '#B28E58',
          600: '#9B7443',
          700: '#7E5B35',
          800: '#64472E',
          900: '#523A27',
          950: '#2D1E14',
        },
        ivory: {
          light: '#FAFAF7',
          DEFAULT: '#F5F2EB',
          dark: '#EBE5D8',
        },
        charcoal: {
          light: '#44403C',
          DEFAULT: '#1C1917',
          dark: '#0C0A09',
        },
        bronze: {
          light: '#D4AF37',
          DEFAULT: '#B8976C',
          dark: '#9A784B',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(28, 25, 23, 0.05)',
        'elevated': '0 10px 30px -5px rgba(28, 25, 23, 0.08)',
      }
    },
  },
  plugins: [],
};
export default config;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf9',
          100: '#ccfbf0',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#4fc3a1', // Main emerald primary
          500: '#34d399',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        clinic: {
          primary: '#4fc3a1',
          primaryHover: '#3fb190',
          bgLight: '#F7F9FA',
          surface: '#FFFFFF',
          textDark: '#1E293B',
          textMuted: '#64748B',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Be Vietnam Pro', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(79, 195, 161, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        soft: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
};

export default config;

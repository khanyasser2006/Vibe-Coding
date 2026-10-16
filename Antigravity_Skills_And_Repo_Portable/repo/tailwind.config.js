/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          DEFAULT: '#FEC5A8',
          light: '#FFF2EB',
          deep: '#FCA47C',
          50: '#FFF8F4',
          100: '#FEEDDE',
          200: '#FEDCC9',
          300: '#FEC5A8',
          400: '#FCA47C',
          500: '#F98350',
          600: '#E9632C',
          700: '#C34614',
          800: '#9B3612',
          900: '#7E2E12',
        },
        tangerine: {
          DEFAULT: '#F4784E',
          deep: '#DE5F32',
          50: '#FEF4F0',
          100: '#FDE6DE',
          200: '#FCCDBD',
          300: '#FAAA94',
          400: '#F78768',
          500: '#F4784E',
          600: '#DE5F32',
          700: '#B23F18',
          800: '#8E3416',
          900: '#752E17',
        },
        terracotta: {
          DEFAULT: '#38140B',
          dark: '#250B05',
          muted: '#6F3424',
          card: '#4A1D11',
          surface: '#38140B',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Italiana', 'Georgia', 'serif'],
        display: ['Italiana', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(56, 20, 11, 0.2)',
        'glow-peach': '0 0 35px -5px rgba(254, 197, 168, 0.7)',
        'glow-tangerine': '0 0 35px -5px rgba(244, 120, 78, 0.7)',
        'dual': '0 20px 50px -10px rgba(244, 120, 78, 0.35)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
};

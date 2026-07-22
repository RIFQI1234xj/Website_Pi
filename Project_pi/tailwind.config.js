/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#F0FDF4',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        mint: {
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
        ivory: {
          50:  '#FDFCF8',
          100: '#FAF5E9',
          200: '#F5EED4',
          300: '#EDE3C4',
        }
      },
      fontFamily: {
        serif:   ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"Plus Jakarta Sans"', 'ui-sans-serif', 'sans-serif'],
        poppins: ['"Poppins"', 'ui-sans-serif', 'sans-serif'],
      },
    }
  },
  plugins: [],
}

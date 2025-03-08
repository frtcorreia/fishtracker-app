/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003f5c',
          light: '#2f95a0',
        },
        secondary: {
          DEFAULT: '#66c5ba',
          light: '#f7e1c1',
        },
        white: '#ffffff',
      },
      backgroundColor: {
        primary: {
          DEFAULT: '#003f5c',
          light: '#2f95a0',
        },
        secondary: {
          DEFAULT: '#66c5ba',
          light: '#f7e1c1',
        },
      },
      textColor: {
        primary: {
          DEFAULT: '#003f5c',
          light: '#2f95a0',
        },
        secondary: {
          DEFAULT: '#66c5ba',
          light: '#f7e1c1',
        },
      },
      borderColor: {
        primary: {
          DEFAULT: '#003f5c',
          light: '#2f95a0',
        },
        secondary: {
          DEFAULT: '#66c5ba',
          light: '#f7e1c1',
        },
      },
      gradientColorStops: {
        'primary-dark': '#003f5c',
        'primary-light': '#2f95a0',
        'secondary': '#66c5ba',
        'sand': '#f7e1c1',
      },
    },
  },
  plugins: [],
};
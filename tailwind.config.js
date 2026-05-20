/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:   '#4A6F7A',  // тёмно-бирюзовый
          light:     '#DDE7EA',  // светло-голубой
          cream:     '#F2F4F5',  // почти белый
          muted:     '#8A959B',  // серый
          dark:      '#2E3A40',  // очень тёмный
          beige:     '#E9E4DF',  // тёплый бежевый
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"Jost"', 'sans-serif'],
      },
      animation: {
        'fade-up':    'fadeUp 0.7s ease forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'slide-left': 'slideLeft 0.4s ease forwards',
        'slide-right':'slideRight 0.4s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%':   { transform: 'translateX(40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%':   { transform: 'translateX(-40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

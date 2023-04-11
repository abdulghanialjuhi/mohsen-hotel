/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      xs: '400px',
      sm: '480px',
      md: '768px',
      xl: '1440px',
    },
    extend: {
      colors: {
        'black-rgba': 'rgba(0, 0, 0, 0.54)',
        'blue-opaque': 'rgb(13 42 148 / 18%)',
        gray: {
          0: '#fff',
          100: '#fafafa',
          200: '#eaeaea',
          300: '#999999',
          400: '#888888',
          500: '#666666',
          600: '#444444',
          700: '#333333',
          800: '#222222',
          900: '#111111'
        },
        darkColor: '#0a0a0a',
        primaryBlue: '#0070f3',
      },
      display: ["group-hover"]
    },
    fontFamily: {
      'sans': 'Arial',
    }
  },
  plugins: [],
}

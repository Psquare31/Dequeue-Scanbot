/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        backdrop: '#0f051d',
      },
      boxShadow: {
        neon: '0 0 20px rgba(255, 0, 255, 0.6)',
      },
    },
  },
  plugins: [],
};
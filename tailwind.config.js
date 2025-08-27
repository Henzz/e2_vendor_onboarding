// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        // This adds a new breakpoint named 'max-sm'
        // It applies styles for screens *up to* 639px wide.
        'max-sm': { max: '639px' },
      },
    },
  },
  plugins: [],
};

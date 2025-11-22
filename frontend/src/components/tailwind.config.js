/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        tealLight: '#d1fae5',   // light teal, for backgrounds/highlights
        teal: '#14b8a6',        // main teal
        tealDark: '#0d9488',    // darker teal, for buttons/gradients
        tealHero: '#0f766e',    // hero elements or special gradients
      },
    },
  },
  plugins: [],
};

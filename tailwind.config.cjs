/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon:     '#39ff14',
        deepBlack:'#090909',
        amber:    '#ffbf00',
      },
      fontFamily: {
        monoRetro: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
}
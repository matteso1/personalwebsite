/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Terminal color system
        'terminal': {
          DEFAULT: '#1e1e21',
          bg: '#0a0a0b',
          surface: '#111113',
          green: '#00ff9f',
          cyan: '#00d4ff',
          amber: '#ffb800',
          red: '#ff4757',
          muted: '#4a4a52',
        },
      },
      fontFamily: {
        sans: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero': 'clamp(2.5rem, 8vw, 5rem)',
        'hero-sub': 'clamp(1rem, 2vw, 1.25rem)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': {
            textShadow: '0 0 10px #00ff9f, 0 0 20px #00ff9f',
          },
          '50%': {
            textShadow: '0 0 20px #00ff9f, 0 0 40px #00ff9f',
          },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      backdropBlur: {
        '4xl': '72px',
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}

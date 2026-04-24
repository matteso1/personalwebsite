/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#07080D',
        'bg-2': '#0B0D16',
        surface: '#10131F',
        'surface-2': '#181C2C',
        raised: '#1F2338',
        acid: '#C6FF1A',
        'acid-dim': '#9ACC0E',
        magenta: '#FF2E7E',
        'magenta-dim': '#CC1F62',
        blue: '#3E6BFF',
        cyan: '#00E5FF',
        violet: '#A855F7',
        warn: '#FFB547',
        'text-primary': '#EAEDF5',
        'text-mid': '#B4BAC9',
        'text-dim': '#6E7588',
        border: 'rgba(255,255,255,0.06)',
        'border-bright': 'rgba(255,255,255,0.14)',
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        display: ['"Archivo Black"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'hero': 'clamp(56px, 11.5vw, 190px)',
        'hero-sub': 'clamp(18px, 1.5vw, 22px)',
        'section': 'clamp(40px, 7vw, 96px)',
      },
      letterSpacing: {
        'tightest': '-0.055em',
        'display': '-0.045em',
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-dot': 'pulse-dot 1.4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 6s linear infinite',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.4)' },
        },
        'glow-pulse': {
          '0%, 100%': { textShadow: '0 0 32px rgba(198,255,26,0.22)' },
          '50%': { textShadow: '0 0 60px rgba(198,255,26,0.45)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
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

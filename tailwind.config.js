/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enhanced color system
        dark: '#0a0a0f',
        'dark-elevated': '#12121a',
        'dark-surface': '#1a1a24',
        accent: '#8b5cf6',
        'accent-light': '#a78bfa',
        'accent-dark': '#7c3aed',
        secondary: '#06b6d4',
        'secondary-light': '#22d3ee',
        warm: '#f59e0b',
        'warm-light': '#fbbf24',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Satoshi', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Geist Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'monospace'],
      },
      fontSize: {
        'hero': 'var(--fs-hero)',
        'hero-sub': 'var(--fs-hero-sub)',
        'h2': 'var(--fs-h2)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'glow': 'glow-pulse 3s ease-in-out infinite',
        'aurora': 'aurora-float 20s ease-in-out infinite alternate',
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
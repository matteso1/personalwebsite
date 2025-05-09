module.exports = {
  darkMode: false,            // disable auto dark-mode
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // indigo-600
        accent: '#6366F1',  // indigo-500
        secondary: '#1E293B', // slate-800
        dark: '#0F172A',    // slate-900
        light: '#F8FAFC',   // slate-50
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
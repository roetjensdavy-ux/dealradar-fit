/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a14',
        'bg-card': 'rgba(20, 20, 35, 0.8)',
        'border-card': 'rgba(255, 255, 255, 0.08)',
        'accent-green': '#00ff88',
        'accent-cyan': '#00D4FF',
        'accent-purple': '#a855f7',
        'accent-deal': '#ff9500',
        'accent-red': '#ff4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

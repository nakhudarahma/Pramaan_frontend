/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#0f2a4a',
          50: '#eef4f9',
          100: '#dce8f2',
          200: '#b9d1e5',
          300: '#8fb2ce',
          400: '#5f8bb0',
          500: '#35648c',
          600: '#0f2a4a',
          700: '#0a1e35',
          800: '#08182b',
          900: '#06111f',
          950: '#040c17',
        },
        accent: '#38bdf8',
        sky: {
          DEFAULT: '#38bdf8',
        },
        page: '#f4f8fb',
        night: {
          page: '#0b1220',
          card: '#111c2e',
          border: '#1e2d45',
          text: '#e6edf5',
          muted: '#8fa3ba',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 42, 74, 0.04), 0 4px 16px rgba(15, 42, 74, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-soft': 'pulseSoft 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}

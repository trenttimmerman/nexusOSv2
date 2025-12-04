/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        nexus: {
          black: '#0a0a0a',
          dark: '#111111',
          gray: '#222222',
          accent: '#3b82f6',
          neon: '#ccff00',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 25s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'breathe': 'breathe 8s ease-in-out infinite alternate',
        'pulse-dot': 'pulseDot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
            '0%': { transform: 'scale(1)', opacity: '0.6' },
            '100%': { transform: 'scale(1.5)', opacity: '0.4' },
        },
         pulseDot: {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: .5 },
        }
      }
    }
  },
  plugins: [],
}

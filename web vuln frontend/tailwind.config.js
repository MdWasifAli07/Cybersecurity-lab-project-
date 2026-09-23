/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0E1A',
        surface: '#0F1424',
        border: '#1F2740',
        primary: '#00E5A0',
        blue: '#3B82F6',
        critical: '#FF3B5C',
        high: '#FFA726',
        medium: '#FFD60A',
        low: '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(0,229,160,0.25), 0 0 30px rgba(0,229,160,0.22)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'scan-line': 'scan 2.4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '20%': { opacity: 1 },
          '100%': { transform: 'translateY(140%)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};

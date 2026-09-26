/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        frost: {
          bg: '#0a0e14',
          panel: '#11161f',
          panel2: '#161c28',
          border: '#2a3344',
          border2: '#3a4658',
          accent: '#6ab7d8',
          accent2: '#4a90a8',
          glow: '#7cc6e0',
          warn: '#d4a44a',
          danger: '#c45a4a',
          success: '#5a9a6a',
          text: '#c8d0dc',
          text2: '#8a94a6',
          text3: '#5a6478',
        },
        ember: {
          DEFAULT: '#d4a44a',
          glow: '#e8b85a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'frost-glow': '0 0 12px rgba(108, 183, 216, 0.15)',
        'frost-inner': 'inset 0 1px 0 rgba(255,255,255,0.03), inset 0 -1px 0 rgba(0,0,0,0.3)',
        'frost-panel': '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)',
      },
      backgroundImage: {
        'frost-grid': "linear-gradient(rgba(42,51,68,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(42,51,68,0.15) 1px, transparent 1px)",
        'frost-radial': 'radial-gradient(ellipse at top, rgba(108,183,216,0.06), transparent 60%)',
      },
      backgroundSize: {
        'grid-sm': '24px 24px',
      },
    },
  },
  plugins: [],
}
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        unbounded: ['Unbounded', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      screens: {
        sidebar: '860px',
      },
    },
  },
  plugins: [],
} satisfies Config

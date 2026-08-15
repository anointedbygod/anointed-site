import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'espresso':  '#3a2e2b',
        'cocoa':     '#5d4d42',
        'stone':     '#f1eae4',
        'sandstone': '#c1a99a',
        'almond':    '#e8d2c3',
      },
    },
  },
  plugins: [],
}
export default config

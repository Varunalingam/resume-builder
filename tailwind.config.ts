/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        sm: '0.625rem',
        md: '0.875rem',
        lg: '1.25rem',
        xl: '1.75rem',
      },
    },
  },
  plugins: [],
}

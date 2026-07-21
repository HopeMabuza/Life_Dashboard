/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'sans-serif'],
        body:    ['Nunito', 'sans-serif'],
      },
      colors: {
        // Design handoff palette
        cream:   '#F6F1E7',   // page background
        surface: '#FFFDF8',   // card / input background
        ink:     '#1B2140',   // primary text, buttons
        muted:   '#5B5F73',   // secondary text
        faint:   '#9A9DAA',   // placeholder / tertiary
        line:    '#ECE6D8',   // borders, dividers
        // Priority
        priority: {
          high:   { bg: '#FDE8E3', text: '#9B3018' },
          medium: { bg: '#FEF3C7', text: '#92610A' },
          low:    { bg: '#F0EBDD', text: '#8A8570' },
        },
      },
      borderRadius: {
        pill: '9999px',
        card: '20px',
      },
      keyframes: {
        floatBlob: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-14px)' },
        },
      },
      animation: {
        floatBlob:       'floatBlob 7s ease-in-out infinite',
        floatBlobSlow:   'floatBlob 8s ease-in-out infinite 1s',
      },
    },
  },
  plugins: [],
}

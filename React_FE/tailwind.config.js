module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#494A8A',
        secondary: '#925892',
        tertiary: '#c05E91',
        accent1: '#FFc39d',
        accent2: '#fe9397',
        accent3: '#f86888',
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
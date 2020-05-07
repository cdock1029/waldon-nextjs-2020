module.exports = {
  purge: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  variants: {
    backgroundColor: [
      'responsive',
      'first',
      'last',
      'even',
      'odd',
      'hover',
      'focus',
    ],
    backgroundOpacity: [
      'responsive',
      'first',
      'last',
      'even',
      'odd',
      'hover',
      'focus',
    ],
  },
  plugins: [require('@tailwindcss/ui')],
}

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      title: ['Lexend', 'sans-serif']
    },
    extend: {
      colors: {
        brandWhite: '#FFF',
        'brandGray-50': '#F7F9FA',
        'brandGray-100': '#E6E8EB',
        'brandGray-200': '#AFB2B1',
        'brandGray-500': '#808080',
        'brandGray-800': '#494D4B',
        'brandGreen-500': '#04D361',
        'brandPurple-300': '#9F75FF',
        'brandPurple-400': '#9164FA',
        'brandPurple-500': '#8256E5',
        'brandPurple-800': '#6F48C9'
      }
    }
  },
  plugins: []
}

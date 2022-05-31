module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'synthwave': "url('./assets/background.png')",
        'note': "url('./assets/bg-stickernote.svg')"
      },
      colors: {
        vaneo: '#ef4444',
        notepad: '#fe7c97',
        yellowbutton: '#fff458',
        buttontext: '#3C6F9F'
      },
      fontFamily: {
        smythe: ['Smythe, cursive'],
        roboto: ['Roboto Condensed, sans-serif'],
      },
      rotate: {
        '358': '358deg',
      }
    },
  },
  plugins: [],
}

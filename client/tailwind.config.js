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
        buttontext: '#437db2'
      },
      fontFamily: {
        smythe: ['Smythe, cursive']
      },
      rotate: {
        '358': '358deg',
      }
    },
  },
  plugins: [],
}

// /Users/VMercado/Desktop/buildspace-hackathon-gtfol/client/src/assets/background.png
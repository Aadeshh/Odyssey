// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      width: {
        'screen-90': '90vw', // Adds a custom width that sets the width to 90% of the viewport width
      },
      fontFamily: {

        roboto: ["Roboto", "sans-serif"] // Add Roboto font

      },
    },
  },
  plugins: [],
};

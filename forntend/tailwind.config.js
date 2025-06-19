module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Add this line to include your JavaScript/TypeScript files
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}

// tailwind.config.js
module.exports = {
    darkMode: 'class', // Enable class-based dark mode
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          // Custom colors for your application
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          }
        },
      },
    },
    plugins: [],
  }
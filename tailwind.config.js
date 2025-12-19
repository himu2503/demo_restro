/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // White & Orange Theme
        primary: '#FF6B35',      // Vibrant Orange
        secondary: '#FF8C42',    // Light Orange
        accent: '#FFA06B',       // Peach Orange
        
        // Additional Color Palette
        orange: {
          light: '#FFB997',      // Light Peach
          medium: '#FF8C42',     // Medium Orange
          dark: '#FF6B35',       // Dark Orange
          deep: '#E85D2A',       // Deep Orange
          burnt: '#D84315',      // Burnt Orange
        },
        
        neutral: {
          white: '#FFFFFF',      // Pure White
          snow: '#FAFAFA',       // Snow White
          light: '#F5F5F5',      // Light Gray
          medium: '#E0E0E0',     // Medium Gray
          dark: '#9E9E9E',       // Dark Gray
          charcoal: '#424242',   // Charcoal
        },
        
        warm: {
          cream: '#FFF8F0',      // Warm Cream
          peach: '#FFCCBC',      // Warm Peach
          coral: '#FF7043',      // Coral
          sunset: '#FF5722',     // Sunset Orange
          amber: '#FFB300',      // Golden Amber
        },
        
        accent: {
          mint: '#B2DFDB',       // Cool Mint (contrast)
          teal: '#4DB6AC',       // Cool Teal (contrast)
          blue: '#42A5F5',       // Sky Blue (contrast)
          green: '#66BB6A',      // Fresh Green (contrast)
        },
      },
    },
  },
  plugins: [],
}


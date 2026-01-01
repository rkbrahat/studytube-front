/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          hover: "rgb(var(--primary-hover) / <alpha-value>)",
          glow: "rgb(var(--primary-glow) / 0.5)", // Default glow opacity
        },
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        text: {
          main: "rgb(var(--text-main) / <alpha-value>)",
          muted: "rgb(var(--text-muted) / <alpha-value>)",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 10px rgb(var(--primary-glow) / 0.3), 0 0 20px rgb(var(--primary) / 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}

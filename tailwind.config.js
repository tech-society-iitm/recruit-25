/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nord color palette
        nord0: "#2E3440", // Polar Night (darkest)
        nord1: "#3B4252", // Polar Night
        nord2: "#434C5E", // Polar Night
        nord3: "#4C566A", // Polar Night
        nord4: "#D8DEE9", // Snow Storm (lightest)
        nord5: "#E5E9F0", // Snow Storm
        nord6: "#ECEFF4", // Snow Storm
        nord7: "#8FBCBB", // Frost
        nord8: "#88C0D0", // Frost
        nord9: "#81A1C1", // Frost
        nord10: "#5E81AC", // Frost
        nord11: "#BF616A", // Aurora (red)
        nord12: "#D08770", // Aurora (orange)
        nord13: "#EBCB8B", // Aurora (yellow)
        nord14: "#A3BE8C", // Aurora (green)
        nord15: "#B48EAD", // Aurora (purple)
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      boxShadow: {
        'nord': '0 4px 14px 0 rgba(46, 52, 64, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
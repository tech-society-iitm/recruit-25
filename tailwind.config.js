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
        // Refined Apple-inspired dark theme with better contrast
        nord0: "#000000", // Pure Black (background)
        nord1: "#000000", // Apple Dark Gray 1 (surface)
        nord2: "#121213", // Apple Dark Gray 2 (card/container bg)
        nord3: "#3a3a3c", // Apple Dark Gray 3 (borders)
        
        nord4: "#8e8e93", // Apple Gray 1 (secondary text)
        nord5: "#aeaeb2", // Apple Gray 2 (primary text)
        nord6: "#e4e4e8", // Apple Gray 3 (bright text) - brightened for better contrast
        
        nord7: "#0071e3", // Apple Blue Dark 
        nord8: "#0a84ff", // Apple Blue Primary
        nord9: "#64d2ff", // Apple Blue Light
        nord10: "#0a84ff", // Apple Blue Primary (same as nord8 for consistency)
        
        nord11: "#ffffff", // System Red (corrected)
        nord12: "#ff9f0a", // System Orange
        nord13: "#ffffff", // System Yellow
        nord14: "#00ffb3", // System Green (corrected)
        nord15: "#bf5af2", // System Purple
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      boxShadow: {
        'nord': '0 4px 14px 0 rgba(0, 0, 0, 0.25)',
        'apple-blue': '0 0 0 3px rgba(10, 132, 255, 0.3)',
        'apple-card': '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        'apple-elevated': '0 12px 32px -5px rgba(0, 0, 0, 0.5)', // New elevated shadow
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite', // New subtle floating animation
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      borderRadius: {
        'apple': '10px',
        'xl': '12px', // Slightly rounder corners
        '2xl': '16px', // More pronounced round corners
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
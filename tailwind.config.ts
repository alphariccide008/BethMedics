import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#7C3AED',
          'purple-dark': '#5B21B6',
          'purple-light': '#8B5CF6',
          'purple-50': '#F5F3FF',
          'purple-100': '#EDE9FE',
          orange: '#F97316',
          'orange-dark': '#EA580C',
          'orange-light': '#FB923C',
          'orange-50': '#FFF7ED',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #7C3AED 0%, #F97316 100%)',
        'gradient-hero': 'linear-gradient(to bottom, #0D0B1E 0%, #1A0A3E 100%)',
        'gradient-purple': 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(249,115,22,0.05) 100%)',
      },
      boxShadow: {
        'brand': '0 4px 30px rgba(124, 58, 237, 0.25)',
        'orange': '0 4px 30px rgba(249, 115, 22, 0.25)',
        'card': '0 8px 40px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 20px 60px rgba(124, 58, 237, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;

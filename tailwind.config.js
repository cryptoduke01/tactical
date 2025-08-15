/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        gray: {
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        red: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        blue: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
        purple: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        yellow: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        orange: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite',
        'bounce': 'bounce 1s infinite',
      },
      backdropBlur: {
        'xl': '24px',
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(34, 197, 94, 0.3)',
        'neon-red': '0 0 20px rgba(239, 68, 68, 0.3)',
        'neon-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
        'neon-yellow': '0 0 20px rgba(250, 204, 21, 0.3)',
      },
    },
  },
  plugins: [],
} 
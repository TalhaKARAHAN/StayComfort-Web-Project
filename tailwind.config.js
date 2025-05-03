/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'slide-in': {
          '0%': { 
            transform: 'translateY(100%)',
            opacity: '0' 
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1' 
          },
        },
        'slide-out': {
          '0%': { 
            transform: 'translateY(0)',
            opacity: '1' 
          },
          '100%': { 
            transform: 'translateY(100%)',
            opacity: '0' 
          },
        },
        'fade-in': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
        },
        'fade-out': {
          '0%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
          '100%': { 
            opacity: '0',
            transform: 'scale(0.95)'
          },
        },
        'bounce-in': {
          '0%': { 
            transform: 'scale(0.3)',
            opacity: '0'
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '0.8'
          },
          '70%': { 
            transform: 'scale(0.9)',
            opacity: '0.9'
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1'
          },
        }
      },
      animation: {
        'slide-in': 'slide-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-out': 'slide-out 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-out': 'fade-out 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }
    },
  },
  plugins: [],
};

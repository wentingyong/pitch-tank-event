import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // PitchTank token bridge → CSS variables in tokens.css
        'pt-blue':       'var(--c-blue)',
        'pt-blue-deep':  'var(--c-blue-deep)',
        'pt-cyan':       'var(--c-cyan)',
        'pt-purple':     'var(--c-purple)',
        'pt-orange':     'var(--c-orange)',
        'pt-red':        'var(--c-red)',
        'pt-metal-blue': 'var(--c-metal-blue)',
        'pt-metal-white':'var(--c-metal-white)',
        'pt-bg':         'var(--c-bg-deep)',
        'pt-text-1':     'var(--c-text-1)',
        'pt-text-2':     'var(--c-text-2)',
        'pt-text-3':     'var(--c-text-3)',

        // shadcn defaults
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      borderRadius: {
        'card': 'var(--radius-card)',
        'mini': 'var(--radius-mini)',
        'pt-pill': 'var(--radius-pill)',
        // shadcn
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      height: {
        'btn-lg': 'var(--btn-h-lg)',
        'btn-md': 'var(--btn-h-md)',
        'btn-sm': 'var(--btn-h-sm)',
      },
      fontFamily: {
        display: ['Tomorrow', 'system-ui', 'sans-serif'],
        sans:    ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      transitionTimingFunction: {
        'pt-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [animate],
};

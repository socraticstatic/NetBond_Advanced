/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        sans: ['ATTAleckSans', 'Inter var', 'system-ui', 'sans-serif'],
      },
      colors: {
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        brand: {
          blue: '#003184',
          lightBlue: '#E6F6FD',
          darkBlue: '#002255',
          accent: '#00A3E0',
          neutral: '#607D8B',
        },
        complementary: {
          teal: '#00A3A6',
          orange: '#FF7900',
          amber: '#F59E0B',
          green: '#2E8B57',
          purple: '#6B5B95',
        }
      },
      borderRadius: {
        'full': '9999px',
        'lg': '0.5rem',
        'md': '0.375rem',
        'xl': '0.75rem',
        '2xl': '1rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  // Enable purging for production builds
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    options: {
      safelist: [
        // Keep critical utility classes
        'bg-brand-blue',
        'text-brand-blue',
        'border-brand-blue',
        'rounded-full',
        'animate-spin',
        'animate-pulse'
      ]
    }
  }
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './feeds/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--bg-primary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        accent: {
          DEFAULT: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
          tertiary: 'var(--accent-tertiary)',
        },
        code: {
          bg: 'var(--bg-code)',
          text: 'var(--text-code)',
        },
        border: 'var(--border)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
      },
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
      },
      fontWeight: {
        normal: 'var(--font-normal)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold: 'var(--font-bold)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      animation: {
        blink: 'blink 1s infinite',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            // Match existing design system colors
            '--tw-prose-body': 'var(--text-primary)',
            '--tw-prose-headings': 'var(--text-primary)',
            '--tw-prose-links': 'var(--accent-primary)',
            '--tw-prose-bold': 'var(--text-primary)',
            '--tw-prose-quotes': 'var(--text-secondary)',
            '--tw-prose-quote-borders': 'var(--accent-primary)',
            '--tw-prose-code': 'var(--text-code)',
            '--tw-prose-pre-code': 'var(--text-code)',
            '--tw-prose-pre-bg': 'var(--bg-code)',

            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            lineHeight: '1.8', // Increased from 1.7 for better readability
            maxWidth: '100%',

            // Headings
            h1: {
              fontSize: 'var(--text-2xl)',
              marginTop: 'var(--space-12)',
              marginBottom: 'var(--space-6)',
              color: 'var(--text-primary)',
              lineHeight: '1.3',
            },
            h2: {
              fontSize: 'var(--text-xl)',
              marginTop: 'var(--space-10)',
              marginBottom: 'var(--space-4)',
              color: 'var(--text-primary)',
              lineHeight: '1.35',
            },
            h3: {
              fontSize: 'var(--text-lg)',
              marginTop: 'var(--space-8)',
              marginBottom: 'var(--space-3)',
              color: 'var(--text-primary)',
              lineHeight: '1.4',
            },

            // Lists
            'ul > li::marker': {
              color: 'var(--accent-primary)',
            },
            'ol > li::marker': {
              color: 'var(--accent-primary)',
            },
            ul: {
              paddingLeft: '1.625em',
            },
            ol: {
              paddingLeft: '1.625em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },

            // Paragraphs
            p: {
              marginBottom: '1em',
              whiteSpace: 'pre-wrap', // Treat newlines as line breaks
            },

            // Code blocks
            pre: {
              backgroundColor: 'var(--bg-code)',
              color: 'var(--text-code)',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-md)',
              overflow: 'auto',
              margin: 'var(--space-8) 0',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-base)',
            },
            code: {
              fontFamily: 'var(--font-mono)',
              wordBreak: 'break-word',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            'pre code': {
              wordBreak: 'normal',
            },

            // Images
            img: {
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              margin: 'var(--space-8) auto',
              borderRadius: 'var(--radius-md)',
            },

            // Blockquotes
            blockquote: {
              borderLeftWidth: '4px',
              borderLeftColor: 'var(--accent-primary)',
              fontStyle: 'italic',
              paddingLeft: 'var(--space-6)',
              margin: 'var(--space-8) 0',
              color: 'var(--text-secondary)',
            },
            'blockquote p': {
              marginBottom: 0,
            },

            // Tables
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
            },
            'th, td': {
              padding: '0.75rem 1rem',
              textAlign: 'left',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-code)',
              border: '1px solid var(--border)',
            },
            th: {
              fontWeight: 600,
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep Matte Foundation
        forensic: {
          bg: '#0B1020',           // Primary background
          secondary: '#11182A',    // Secondary background / cards
          surface: '#171F35',      // Elevated surfaces
          interactive: '#202B43',  // Interactive elements / hovers
          border: '#25324E',       // Default borders
          subtle: '#1B253D',       // Hairline dividers
          elevated: '#1D2742',     // Hover/focus surface
        },
        // Premium Typography Colors
        text: {
          primary: '#F4F5FF',      // Crisp headings & main content
          secondary: '#A7B0C5',    // High-readability body
          muted: '#737F98',        // Secondary metadata & timestamps
        },
        // Purposeful Accent Palette
        accent: {
          violet: '#9B72FF',       // AI Reasoning & Gemini Investigation
          cyan: '#42D9F5',         // Execution traces & evidence
          blue: '#639BFF',         // Structural information
          amber: '#FFBD59',        // Suspicious decisions & warnings
          coral: '#FF647C',        // Confirmed failures & critical violations
          mint: '#4DDBA5',         // Verified fixes & control passes
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-violet': '0 0 24px -4px rgba(155, 114, 255, 0.22)',
        'glow-cyan': '0 0 24px -4px rgba(66, 217, 245, 0.22)',
        'glow-coral': '0 0 24px -4px rgba(255, 100, 124, 0.25)',
        'glow-mint': '0 0 24px -4px rgba(77, 219, 165, 0.22)',
        'glow-amber': '0 0 24px -4px rgba(255, 189, 89, 0.22)',
        'surface-elevation': '0 10px 30px -5px rgba(5, 8, 18, 0.6)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'gradient-radial-at-t': 'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
        'gradient-radial-at-b': 'radial-gradient(ellipse at bottom, var(--tw-gradient-stops))',
      },
      fontSize: {
        'hero': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'section': ['1.375rem', { lineHeight: '1.3', fontWeight: '700' }],
        'card-title': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.7' }],
        'body': ['0.9375rem', { lineHeight: '1.7' }],
        'detail': ['0.8125rem', { lineHeight: '1.6' }],
        'meta': ['0.75rem', { lineHeight: '1.5' }],
      }
    },
  },
  plugins: [],
}

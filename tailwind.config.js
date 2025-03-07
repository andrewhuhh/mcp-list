/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      letterSpacing: {
        DEFAULT: '-0.025em', // -2.5%
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      colors: {
        site: "hsl(var(--site-background))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          hover: "hsl(var(--card-hover))",
        },
        vote: {
          DEFAULT: "hsl(var(--secondary))",
          hover: "hsl(var(--secondary-muted))",
          active: "hsl(var(--secondary))",
          text: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "hsl(128 77% 42%)",
          hover: "hsl(128 77% 37%)",
          foreground: "white",
          gradient: "linear-gradient(90deg, hsl(128 77% 42%), hsl(128 77% 87%))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "vote-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" }
        },
        "card-hover": {
          "0%": { transform: "perspective(1000px) rotateX(0) rotateY(0)" },
          "100%": { transform: "perspective(1000px) rotateX(var(--rx)) rotateY(var(--ry))" }
        },
        "card-leave": {
          "0%": { transform: "perspective(1000px) rotateX(var(--rx)) rotateY(var(--ry))" },
          "100%": { transform: "perspective(1000px) rotateX(0) rotateY(0)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "vote-bounce": "vote-bounce 0.3s ease-in-out",
        "card-hover": "card-hover 0.2s ease-out forwards",
        "card-leave": "card-leave 0.4s ease-out forwards"
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('tailwindcss-scrollbar'),
  ],
} 

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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
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
        },
        // Art Deco theme colors
        gold: {
          50: "#FFF9E6",
          100: "#FFF4CC",
          200: "#FFE999",
          300: "#FFDD66",
          400: "#FFD233",
          500: "#FFC700",
          600: "#CCA000",
          700: "#997800",
          800: "#665000",
          900: "#332800",
        },
        midnight: {
          50: "#E6E6E9",
          100: "#CCCED3",
          200: "#999CA7",
          300: "#666B7B",
          400: "#33394F",
          500: "#000723",
          600: "#00061C",
          700: "#000415",
          800: "#00020F",
          900: "#000108",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Art Deco border radius values
        'art': '0.5rem',
        'art-sm': '0.25rem',
        'art-lg': '1rem',
        'art-xl': '1.5rem',
        'art-none': '0',
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        // Art Deco gradient utilities
        'art-gold-gradient': 'linear-gradient(to right, #FFC700, #FFDD66)',
        'art-gold-radial': 'radial-gradient(circle at center, #FFD233, #CCA000)',
        'art-midnight-gradient': 'linear-gradient(135deg, #000108, #00020F)',
        'art-midnight-radial': 'radial-gradient(circle at center, #000723, #000108)',
        'art-card-gradient': 'linear-gradient(to bottom right, #00020F, #000108)',
        'art-header-gradient': 'linear-gradient(to right, #00020F, #000108)',
        'art-divider-gradient': 'linear-gradient(to right, transparent, #FFC700, transparent)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

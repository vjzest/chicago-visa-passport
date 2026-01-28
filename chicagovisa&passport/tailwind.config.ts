import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      boxShadow: {
        full: "0 0 15px rgba(0, 0, 0, 0.2)",
      },
      screens: {
        xsm: "480px",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        poppins: ["var(--font-poppins)"],
        inter: ["var(--font-poppins)"], // Mapping inter to poppins for consistency
        cabinet: ["var(--font-cabinet)", "sans-serif"],
        grotesk: ["var(--font-space-grotesk)", "sans-serif"],
        roboto: ["var(--font-roboto)", "sans-serif"],
      },
      fontSize: {
        xs: ["0.675rem", { lineHeight: "1rem" }],
        sm: ["0.7875rem", { lineHeight: "1.25rem" }],
        base: ["0.9rem", { lineHeight: "1.5rem" }],
        lg: ["1.0125rem", { lineHeight: "1.75rem" }],
        xl: ["1.125rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.35rem", { lineHeight: "1.75rem" }],
        "3xl": ["1.6875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.025rem", { lineHeight: "2.5rem" }],
        "5xl": ["2.7rem", { lineHeight: "2.5rem" }],
        "6xl": ["3.375rem", { lineHeight: "2.5rem" }],
        "7xl": ["4.05rem", { lineHeight: "2.5rem" }],
        "8xl": ["5.4rem", { lineHeight: "2.5rem" }],
        "9xl": ["7.2rem", { lineHeight: "2.5rem" }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        "banner-background": "hsl(var(--banner-background))",
        foreground: "hsl(var(--foreground))",
        "nav-bg": "#F2FAFF",
        "custom-yellow": "#C3B123",
        primary: {
          // DEFAULT: "#244d89",
          DEFAULT: "#122241",
          foreground: "hsl(var(--primary-foreground))",
        },
        "primary-2": "hsl(var(--primary-2))",
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
        "primary-red": "#d75648",
        "dark-blue": "#1A243F",
        // "deep-blue": "#2B416C",
        "deep-blue": "#122241",
        "light-blue": "#244d89",
        "dark-red": "#CF1F3F",
        "light-red": "#EA2341",
        "light-gray": "#b2b2b2",
        "dark-gray": "#454545",
        "dark-1": "#181818",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        float: {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "40%": { transform: "translateY(-12px) rotate(-2deg)" },
          "60%": { transform: "translateY(-16px) rotate(2deg)" },
          "80%": { transform: "translateY(-20px) rotate(-1deg)" },
          "100%": { transform: "translateY(0) rotate(0deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

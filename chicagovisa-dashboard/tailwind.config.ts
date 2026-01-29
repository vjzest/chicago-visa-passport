import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      fontSize: {
        xs: ["0.675rem", { lineHeight: "1rem" }], // 90% of 0.75rem (default: 0.75rem)
        sm: ["0.7875rem", { lineHeight: "1.25rem" }], // 90% of 0.875rem (default: 0.875rem)
        base: ["0.9rem", { lineHeight: "1.5rem" }], // 90% of 1rem (default: 1rem)
        lg: ["1.0125rem", { lineHeight: "1.75rem" }], // 90% of 1.125rem (default: 1.125rem)
        xl: ["1.125rem", { lineHeight: "1.75rem" }], // 90% of 1.25rem (default: 1.25rem)
        "2xl": ["1.35rem", { lineHeight: "1.75rem" }], // 90% of 1.5rem (default: 1.5rem)
        "3xl": ["1.6875rem", { lineHeight: "2.25rem" }], // 90% of 1.875rem (default: 1.875rem)
        "4xl": ["2.025rem", { lineHeight: "2.5rem" }], // 90% of 2.25rem (default: 2.25rem)
        "5xl": ["2.7rem", { lineHeight: "2.5rem" }], // 90% of 3rem (default: 3rem)
        "6xl": ["3.375rem", { lineHeight: "2.5rem" }], // 90% of 3.75rem (default: 3.75rem)
        "7xl": ["4.05rem", { lineHeight: "2.5rem" }], // 90% of 4.5rem (default: 4.5rem)
        "8xl": ["5.4rem", { lineHeight: "2.5rem" }], // 90% of 6rem (default: 6rem)
        "9xl": ["7.2rem", { lineHeight: "2.5rem" }], // 90% of 8rem (default: 8rem)
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        "banner-background": "hsl(var(--banner-background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          // DEFAULT: "#2B416C",
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
        "dark-blue": "#1A243F",
        // "deep-blue": "#2B416C",
        "deep-blue": "#122241",
        "light-blue": "#325A96",
        "dark-red": "#CF1F3F",
        "light-red": "#EA2341",
        "light-gray": "#b2b2b2",
        "dark-gray": "#454545",
        "dark-1": "#181818",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

// import type { Config } from "tailwindcss"

// const config = {
//   darkMode: ["class"],
//   content: [
//     './pages/**/*.{ts,tsx}',
//     './components/**/*.{ts,tsx}',
//     './app/**/*.{ts,tsx}',
//     './src/**/*.{ts,tsx}',
// 	],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       colors: {
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
//         primary: {
//           DEFAULT: "hsl(var(--primary))",
//           foreground: "hsl(var(--primary-foreground))",
//         },
//         secondary: {
//           DEFAULT: "hsl(var(--secondary))",
//           foreground: "hsl(var(--secondary-foreground))",
//         },
//         destructive: {
//           DEFAULT: "hsl(var(--destructive))",
//           foreground: "hsl(var(--destructive-foreground))",
//         },
//         muted: {
//           DEFAULT: "hsl(var(--muted))",
//           foreground: "hsl(var(--muted-foreground))",
//         },
//         accent: {
//           DEFAULT: "hsl(var(--accent))",
//           foreground: "hsl(var(--accent-foreground))",
//         },
//         popover: {
//           DEFAULT: "hsl(var(--popover))",
//           foreground: "hsl(var(--popover-foreground))",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//       },
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//       },
//       keyframes: {
//         "accordion-down": {
//           from: { height: "0" },
//           to: { height: "var(--radix-accordion-content-height)" },
//         },
//         "accordion-up": {
//           from: { height: "var(--radix-accordion-content-height)" },
//           to: { height: "0" },
//         },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//       },
//     },
//   },
//   plugins: [require("tailwindcss-animate")],
// } satisfies Config

// export default config

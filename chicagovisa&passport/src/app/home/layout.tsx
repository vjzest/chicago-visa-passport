// src/app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { Poppins, Roboto, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Footer from "@/components/globals/footer-home/footer-home";
import Navbar from "@/components/dashboard/globals/navbar/nav-bar-home";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

// roboto
const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-roboto",
  display: "swap",
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Chicago Passport & Visa Expedite",
  description: "Professional passport services",
  keywords: "passport, expedited passport, passport renewal, US passport",
};

const GTM_ID = "GTM-W462WPX3";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_ENVIRONMENT === "live" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
            }}
          />
        )}
      </head>
      <body
        className={`${poppins.variable} ${spaceGrotesk.variable} ${roboto.variable} font-sans antialiased`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        {process.env.NEXT_PUBLIC_ENVIRONMENT === "live" && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `
            <iframe 
              src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
              height="0" 
              width="0" 
              style="display:none;visibility:hidden"
            ></iframe>
          `,
            }}
          />
        )}
      </body>
    </html>
  );
}

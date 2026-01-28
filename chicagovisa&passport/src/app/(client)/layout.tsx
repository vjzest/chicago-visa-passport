import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Chicago Passport & Visa Expedite Services",
  description: "One platform for all your Passport Related Activities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GTM_ID = "GTM-W462WPX3";
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <meta name="robots" content="noindex" />
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
      <body className={`${poppins.className} min-h-screen bg-background antialiased`}>
        <Toaster
          closeButton={true}
          position="top-right"
          richColors
          duration={5000}
        />
        <main className="">{children}</main>
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

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
export const metadata: Metadata = {
  title: "Chicago Passport & Visa Admin",
  description: "Admin management console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={"min-h-screen bg-background antialiased"}>
        <main>
          {children}
          <Toaster position="top-right" richColors />
        </main>
      </body>
    </html>
  );
}

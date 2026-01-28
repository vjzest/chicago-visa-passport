import type { Metadata } from "next";
import "../globals.css";
// import { Footer, Header } from "@/components/globals";
import { Header } from "@/components/globals";
import Footer from "@/components/landing/layout/Footer";

export const metadata: Metadata = {
  title: "Chicago Passport & Visa Expedite",
  description: "One platform for all your Passport Related Activities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en" className="m-0 !scroll-smooth p-0">
    //   <head>
    //     <link
    //       rel="stylesheet"
    //       href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
    //     />
    //   </head>
    //   <body className="m-0 min-h-screen bg-background p-0 antialiased">
    <>
      <Header />
      <div className="pb-24">
        {/* <BreadCrumbComponent /> */}
        {children}
      </div>
      <Footer />
    </>
    //   </body>
    // </html>
  );
}

import "./landing.css";
import Header from "@/components/landing/layout/Header";
import Footer from "@/components/landing/layout/Footer";
import { ReactNode } from "react";
import { Poppins } from "next/font/google";
import { HomepageProvider } from "@/hooks/use-homepage-content";
import StoreHydrator from "@/components/globals/StoreHydrator";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

async function getInitialData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASEURL;
  if (!baseUrl) return null;

  try {
    // We use cache: 'no-store' to ensure that every refresh gets the LATEST data from the API
    // without hitting the Next.js server-side cache. This fixes the "stale preview" issue.

    const [homepageRes, levelsRes, additionalRes, contactRes, toCountriesRes, passportRes] = await Promise.all([
      fetch(`${baseUrl}/content/homepage`, { cache: 'no-store' }),
      fetch(`${baseUrl}/common/service-levels`, { cache: 'no-store' }),
      fetch(`${baseUrl}/common/additional-services`, { cache: 'no-store' }),
      fetch(`${baseUrl}/common/contact-info`, { cache: 'no-store' }),
      fetch(`${baseUrl}/common/country-pairs/enabled-to?fromCountryCode=US`, { cache: 'no-store' }),
      fetch(`http://localhost:4001/api/v1/content`, { cache: 'no-store' })
    ]);

    const homepageData = homepageRes.ok ? await homepageRes.json() : null;
    const levelsData = levelsRes.ok ? await levelsRes.json() : null;
    const additionalData = additionalRes.ok ? await additionalRes.json() : null;
    const contactData = contactRes.ok ? await contactRes.json() : null;
    const toCountriesData = toCountriesRes.ok ? await toCountriesRes.json() : null;
    const passportData = passportRes.ok ? await passportRes.json() : null;

    // Standardize Chicago Data (handle optional .data wrapper)
    const chicagoDoc = homepageData?.data || homepageData;

    // Standardize Passport Data (handle optional .data wrapper)
    const passportDoc = passportData?.data || passportData;

    // SELECTIVE MERGE: 
    // Chicago is the source for everything EXCEPT usPassportPage.
    // Passport is the source for usPassportPage.
    const mergedHomepageContent = {
      ...(chicagoDoc || {}),
      usPassportPage: passportDoc?.usPassportPage || chicagoDoc?.usPassportPage
    };

    return {
      homepageContent: mergedHomepageContent,
      serviceLevels: levelsData?.data || [],
      additionalServices: additionalData?.data || [],
      contactInfo: contactData?.data || null,
      toCountries: toCountriesData?.data || []
    };
  } catch (error) {
    console.error("Failed to fetch initial data in layout:", error);
    return null;
  }
}

export default async function LandingLayout({ children }: { children: ReactNode }) {
  const initialData = await getInitialData();

  return (
    <html lang="en">
      <body className={poppins.className}>
        <HomepageProvider data={initialData?.homepageContent}>
          <StoreHydrator data={initialData || {}} />
          <Header initialToCountries={initialData?.toCountries} />
          <main>{children}</main>
          <Footer />
        </HomepageProvider>
      </body>
    </html>
  );
}

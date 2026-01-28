import { ReactNode } from "react";

export const metadata = {
  title: "Country Access",
  description: "Manage country access for visa applications",
};

export default function CountryAccessLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

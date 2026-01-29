import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jet Admin",
  description: "Admin management console",
};

export default function PassportLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apex Gear LLC | Mobile Mechanic",
  description: "Expert mobile mechanic services for ATVs, UTVs, and dirt bikes at your home or office.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container mx-auto p-4">
          <ClientWrapper>{children}</ClientWrapper>
        </main>
      </body>
    </html>
  );
}

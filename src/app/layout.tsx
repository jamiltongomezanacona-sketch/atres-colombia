import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/layout/site-shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AtresColombia",
  description: "Moda colombiana directa del taller al cliente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.variable + " font-sans antialiased"}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

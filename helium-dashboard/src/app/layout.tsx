import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DePIN Ops | Unified DePIN Dashboard",
  description: "Monitor your Helium and DIMO DePINs in one place. Real-time prices, hotspot monitoring, Telegram alerts, and more. Free to use.",
  keywords: ["DePIN", "Helium", "DIMO", "hotspot", "monitoring", "crypto", "dashboard"],
  authors: [{ name: "DePIN Ops" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "DePIN Ops - Unified DePIN Dashboard",
    description: "Monitor your Helium and DIMO DePINs in one place",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

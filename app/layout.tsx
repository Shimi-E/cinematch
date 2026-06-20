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
  title: "CineMatch — המלצות סרטים שמתאימות לך",
  description: "גלה סרטים שמתאימים לטעם שלך. סקר סרטים חכם שבונה את הפרופיל הקולנועי שלך.",
  openGraph: {
    title: "CineMatch",
    description: "גלה סרטים שמתאימים לטעם שלך",
    siteName: "CineMatch by Shimi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

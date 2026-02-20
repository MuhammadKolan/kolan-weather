import type { Metadata, Viewport } from "next";
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
  title: "کۆڵان | Kolan - Weather App",
  description: "برنامه آب و هوای چندزبانه با پیش‌بینی دقیق - Multi-language weather app with accurate forecasts",
  keywords: ["weather", "آب و هوا", "forecast", "پیش‌بینی", "هوا", "kurdish", "persian", "farsi", "کوردی", "kolan", "کۆڵان"],
  authors: [{ name: "Weather App Team" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "کۆڵان | Kolan - Weather App",
    description: "Multi-language weather app with accurate forecasts",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "کۆڵان | Kolan - Weather App",
    description: "Multi-language weather app with accurate forecasts",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ku" suppressHydrationWarning>
      <head>
        {/* Vazirmatn Font - Persian & Kurdish Support */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

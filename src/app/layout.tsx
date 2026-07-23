import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0F3D26",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Civitas PropTech — Smart Living. Sustainable Legacy.",
  description: "Ghana's leading integrated platform for smart estate management, renewable energy solar micro-grids, 24/7 SLA maintenance dispatch, and impact investing. Engineered for Ghana. Benchmarked globally.",
  keywords: ["PropTech Ghana", "property management Ghana", "solar energy Ghana", "estate management Accra", "impact investing Africa", "MTN Mobile Money rent", "Ghana Rent Act"],
  authors: [{ name: "Civitas Estate & Maintenance Ltd" }],
  creator: "Civitas Estate & Maintenance Ltd",
  metadataBase: new URL("https://civitasestate.com"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Civitas PropTech",
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://civitasestate.com",
    siteName: "Civitas PropTech",
    title: "Civitas PropTech — Smart Living. Sustainable Legacy.",
    description: "Ghana's pioneering platform for smart estate management, solar micro-grids, and impact investing. 500+ eco-homes. 24/7 SLA maintenance. 14–18% projected investor IRR.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Civitas PropTech Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Civitas PropTech — Smart Living. Sustainable Legacy.",
    description: "Ghana's #1 integrated PropTech platform. Smart estate management, solar grids, 24/7 SLA maintenance, and impact investing.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
      <body className="min-h-full flex flex-col">
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}

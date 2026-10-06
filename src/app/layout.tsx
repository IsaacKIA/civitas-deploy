import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { LOCAL_BUSINESS_JSONLD } from "@/lib/seo-schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0F3D26",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Civitas PropTech — #1 Property & Estate Management Platform in Ghana",
    template: "%s | Civitas PropTech Ghana",
  },
  description: "Ghana's #1 integrated PropTech platform: Rent Act 220 compliant Mobile Money rent collections (MTN MoMo, Telecel Cash), diaspora remote property management, solar telemetry, and verified artisan dispatch across Accra, Kumasi & Takoradi.",
  keywords: [
    "PropTech Ghana",
    "property management Ghana",
    "estate management Accra",
    "property management East Legon",
    "property management Cantonments",
    "property management Airport Residential",
    "property management Kumasi",
    "property management Takoradi",
    "diaspora property management Ghana",
    "Ghana Rent Act 220 compliance",
    "pay rent with MTN Mobile Money",
    "Telecel Cash rent Ghana",
    "solar energy property management Ghana",
    "facility management Ghana",
    "developer handover certificate Ghana",
    "artisan maintenance Accra",
    "real estate software Ghana"
  ],
  authors: [{ name: "Civitas Estate & Maintenance Ltd", url: "https://www.civitasestate.com" }],
  creator: "Civitas Estate & Maintenance Ltd",
  publisher: "Civitas Estate & Maintenance Ltd",
  metadataBase: new URL("https://www.civitasestate.com"),
  alternates: {
    canonical: "https://www.civitasestate.com",
    languages: {
      "en-GH": "https://www.civitasestate.com",
      "en": "https://www.civitasestate.com",
    },
  },
  verification: {
    google: "2tEyzjJeTvPxW8KKCRhA-WQsaBElEmWz3B1ZXq5l6Dk",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Civitas PropTech",
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://www.civitasestate.com",
    siteName: "Civitas PropTech",
    title: "Civitas PropTech — #1 Property & Estate Management Platform in Ghana",
    description: "Ghana's leading PropTech platform. Rent Act 220 compliant rent payments via Mobile Money, diaspora remote property management, solar telemetry, and verified artisan dispatch.",
    images: [
      {
        url: "https://www.civitasestate.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Civitas PropTech — Smart Living. Sustainable Legacy.",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Civitas PropTech — #1 Property & Estate Management Platform in Ghana",
    description: "Ghana's leading PropTech platform. Rent Act 220 compliant Mobile Money payments, diaspora remote management, solar telemetry & 24/7 maintenance dispatch.",
    images: ["https://www.civitasestate.com/og-image.png"],
    creator: "@civitasestate",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    apple: "/apple-touch-icon.png",
  },
  other: {
    "geo.region": "GH-AA",
    "geo.placename": "Accra, Ghana",
    "geo.position": "5.6358;-0.1601",
    "ICBM": "5.6358, -0.1601",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GH"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(LOCAL_BUSINESS_JSONLD),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}

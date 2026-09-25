import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { LOCAL_BUSINESS_JSONLD } from "@/lib/seo-schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Every headline on the site uses font-serif, but no serif face was ever
// actually loaded — it was silently falling back to the browser's generic
// default serif (Georgia/Times). Fraunces is a warm, characterful display
// serif with real personality at large sizes (its "soft" optical variant
// suits "Sustainable Legacy" better than the ubiquitous Playfair Display),
// used deliberately only for headlines, not body copy.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

export const viewport: Viewport = {
  themeColor: "#0F3D26",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Civitas PropTech — Property & Estate Management Platform in Ghana",
    template: "%s | Civitas PropTech Ghana",
  },
  description: "Ghana's #1 integrated PropTech platform: Rent Act 220 compliant Mobile Money rent collections, diaspora property management, solar telemetry, and verified artisan dispatch across Accra, Kumasi & Takoradi.",
  keywords: [
    "PropTech Ghana",
    "property management Ghana",
    "estate management Accra",
    "property management East Legon",
    "property management Cantonments",
    "property management Airport Residential",
    "property management Kumasi",
    "diaspora property management Ghana",
    "Ghana Rent Act 220 compliance",
    "pay rent with MTN Mobile Money",
    "Telecel Cash rent Ghana",
    "solar energy property management Ghana",
    "facility management Ghana",
    "developer handover certificate Ghana",
    "artisan maintenance Accra"
  ],
  authors: [{ name: "Civitas Estate & Maintenance Ltd", url: "https://civitasestate.com" }],
  creator: "Civitas Estate & Maintenance Ltd",
  publisher: "Civitas Estate & Maintenance Ltd",
  metadataBase: new URL("https://civitasestate.com"),
  alternates: {
    canonical: "https://civitasestate.com",
  },
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
    title: "Civitas PropTech — Smart Living & Estate Management in Ghana",
    description: "Ghana's leading PropTech platform. Rent Act 220 compliant rent payments via Mobile Money, diaspora remote property management, solar telemetry, and verified artisan dispatch.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Civitas PropTech — Smart Living. Sustainable Legacy.",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Civitas PropTech — Smart Living & Estate Management in Ghana",
    description: "Ghana's leading PropTech platform. Rent Act 220 compliant Mobile Money payments, diaspora remote management, solar telemetry & 24/7 maintenance dispatch.",
    images: ["/og-image.png"],
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
    "geo.placename": "Accra",
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

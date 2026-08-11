import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
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
  title: "Civitas PropTech — Smart Living. Sustainable Legacy.",
  description: "Ghana's integrated platform for property management: Rent Act 220 compliant rent payments via Mobile Money, tenant and maintenance tracking, and solar-ready property listings.",
  keywords: ["PropTech Ghana", "property management Ghana", "solar energy Ghana", "estate management Accra", "MTN Mobile Money rent", "Ghana Rent Act"],
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
    description: "Ghana's integrated platform for property management: Rent Act 220 compliant rent payments via Mobile Money, tenant and maintenance tracking, and solar-ready property listings.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Civitas PropTech Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Civitas PropTech — Smart Living. Sustainable Legacy.",
    description: "Ghana's integrated PropTech platform for Rent Act compliant payments, tenant management, and maintenance tracking.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}

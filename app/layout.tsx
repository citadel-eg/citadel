import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { IntroProvider } from "@/lib/intro-context";
import { CitadelPreloader } from "@/components/CitadelPreloader";
import { PageTransitionProvider } from "@/components/PageTransition";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://citadel-solution.vercel.app";

export const viewport: Viewport = {
  themeColor: "#05070a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Citadel Smart Solutions — Business-First Systems Engineering & Digital Infrastructure",
    template: "%s | Citadel Smart Solutions",
  },
  description:
    "Citadel Smart Solutions engineers custom operational engines, automation infrastructure, and scalable digital products built directly around how modern businesses operate.",
  applicationName: "Citadel Smart Solutions",
  authors: [{ name: "Citadel Smart Solutions", url: SITE_URL }],
  creator: "Citadel Smart Solutions",
  publisher: "Citadel Smart Solutions",
  category: "technology",
  keywords: [
    "Citadel Smart Solutions",
    "Business Automation",
    "Operations Engineering",
    "Custom Software Development",
    "Digital Products",
    "Enterprise Systems Architecture",
    "Next.js Architecture",
    "Egypt Software Consulting",
    "Software Consulting",
    "Process Automation",
    "Tech Solutions",
    "Middle East Tech Solutions",
  ],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: undefined,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Citadel Smart Solutions",
    title: "Citadel Smart Solutions — Business-First Systems Engineering",
    description:
      "We understand your business first, then architect technology around how it really works. Custom software, automation, and operational engines.",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "Citadel Smart Solutions Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Citadel Smart Solutions — Business-First Systems Engineering",
    description:
      "Custom automation, operational engines, and scalable digital products built around real business operations.",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Citadel Smart Solutions",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      description:
        "Business-first systems engineering, automation infrastructure, and custom digital products.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "adel@citadel.systems",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Citadel Smart Solutions",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-[#05070a] text-white"
        suppressHydrationWarning
      >
        <IntroProvider>
          <CitadelPreloader />
          <PageTransitionProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </PageTransitionProvider>
        </IntroProvider>
      </body>
    </html>
  );
}

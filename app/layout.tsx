import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Citadel Smart Solutions",
  description: "Citadel Smart Solutions UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#05070a] text-white">
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

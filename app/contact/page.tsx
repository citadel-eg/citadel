import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { FooterCTA } from "@/components/FooterCTA";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactBookingSection } from "@/components/contact/ContactBookingSection";

export const metadata: Metadata = {
  title: "Contact & Consultation Scheduling",
  description:
    "A clear project starts with a clear conversation. Schedule an architectural consultation or discovery session with Citadel Smart Solutions.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact & Schedule Consultation | Citadel Smart Solutions",
    description:
      "Schedule a 30-minute discovery call with our systems team or send an inquiry about your project.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col font-sans selection:bg-brand selection:text-[#1C2633]">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* Contact Hero */}
        <ContactHero />

        {/* Dual Booking & Consultation Form */}
        <ContactBookingSection />
      </main>

      {/* Footer CTA */}
      <FooterCTA />
    </div>
  );
}

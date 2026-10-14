import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { FooterCTA } from "@/components/FooterCTA";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactBookingSection } from "@/components/contact/ContactBookingSection";

export const metadata: Metadata = {
  title: "Contact | Citadel Smart Solutions",
  description:
    "A clear project starts with a clear conversation. Schedule a consultation with Citadel Smart Solutions.",
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

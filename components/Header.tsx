import React from "react";
import Link from "next/link";
import { CitadelLogo } from "./CitadelLogo";

export function Header() {
  const navLinks = [
    { label: "Home", href: "#", active: true },
    { label: "Company", href: "#company", active: false },
    { label: "Services", href: "#services", active: false },
    { label: "Work", href: "#work", active: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#05070a]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1440px] mx-auto h-20 px-6 sm:px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
          <CitadelLogo />
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative py-1 text-[13px] font-medium tracking-tight transition-colors ${
                link.active ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
              {link.active && (
                <span className="absolute bottom-[-18px] left-0 right-0 h-[2px] bg-white/70 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="#schedule"
            className="inline-flex items-center justify-center border border-white/80 hover:border-brand hover:text-brand px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold tracking-[2px] text-white uppercase transition-colors"
          >
            GET STARTED
          </Link>
        </div>
      </div>
    </header>
  );
}

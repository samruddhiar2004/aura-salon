'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Calendar, Menu, X, MessageSquare, Search } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { getWhatsAppLink } from '@/lib/whatsapp';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services & Pricing' },
    { href: '/offers', label: 'Special Offers' },
    { href: '/gallery', label: 'Atelier Gallery' },
    { href: '/contact', label: 'Location & Contact' },
    { href: '/lookup', label: 'Find Booking' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF7]/90 backdrop-blur-md border-b border-[#E8DEC9]/60 transition-all">
      {/* Top micro bar for phone & hours */}
      <div className="bg-[#1C1917] text-[#FAFAF7] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-[#D5C4A3]">✦ {siteConfig.tagline}</span>
            <span className="sm:hidden text-[#D5C4A3]">Beverly Hills Luxury Atelier</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex items-center space-x-1.5 hover:text-[#B8976C] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#B8976C]" />
              <span>{siteConfig.phone}</span>
            </a>
            <a
              href={getWhatsAppLink('Hi AURA Atelier, I would like to make an inquiry.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-1 hover:text-emerald-400 transition-colors"
            >
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="group flex flex-col">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] group-hover:text-[#B8976C] transition-colors">
              AURA
            </span>
            <span className="text-[9px] tracking-[0.25em] font-medium uppercase text-[#78716C]">
              Atelier & Spa
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#B8976C] ${
                  isActive(link.href)
                    ? 'text-[#B8976C] font-semibold underline underline-offset-8 decoration-1 decoration-[#B8976C]'
                    : 'text-[#44403C]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/lookup"
              className="text-xs font-medium text-[#78716C] hover:text-[#1C1917] flex items-center gap-1 transition-colors px-3 py-2 border border-[#E8DEC9] rounded-full"
            >
              <Search className="w-3.5 h-3.5 text-[#B8976C]" />
              <span>My Booking</span>
            </Link>

            <Link
              href="/book"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#1C1917] text-[#FAFAF7] hover:bg-[#B8976C] text-sm font-medium rounded-full shadow-soft hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4 text-[#B8976C] group-hover:text-white" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center space-x-3">
            <Link
              href="/book"
              className="px-4 py-2 bg-[#1C1917] text-[#FAFAF7] text-xs font-medium rounded-full flex items-center space-x-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-[#B8976C]" />
              <span>Book</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1C1917] hover:bg-[#E8DEC9]/50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E8DEC9] bg-[#FAFAF7] px-4 pt-4 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-2 px-3 rounded-md transition-colors ${
                  isActive(link.href)
                    ? 'bg-[#E8DEC9]/40 text-[#B8976C] font-semibold'
                    : 'text-[#1C1917] hover:bg-[#E8DEC9]/20'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E8DEC9] flex flex-col gap-3">
            <a
              href={`tel:${siteConfig.phone}`}
              className="w-full py-3 text-center border border-[#1C1917] rounded-full text-sm font-medium text-[#1C1917] flex justify-center items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#B8976C]" />
              <span>Call Salon: {siteConfig.phone}</span>
            </a>
            <a
              href={getWhatsAppLink('Hi AURA Atelier, I would like to inquire about booking.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 text-center bg-emerald-600 text-white rounded-full text-sm font-medium flex justify-center items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

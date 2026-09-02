import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageSquare, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { getWhatsAppLink } from '@/lib/whatsapp';

export function Footer() {
  return (
    <footer className="bg-[#1C1917] text-[#FAFAF7] pt-16 pb-12 border-t border-[#292524]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-[#292524]">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-tight text-[#FAFAF7]">
                AURA
              </span>
              <span className="block text-[10px] tracking-[0.3em] uppercase text-[#B8976C]">
                Atelier & Spa
              </span>
            </Link>
            <p className="text-sm text-[#A8A29E] leading-relaxed">
              Bespoke beauty, elevated rest, and artisanal hair styling. Experience an unhurried, luxury salon environment tailored to your unique elegance.
            </p>
            <div className="pt-2 flex items-center space-x-3">
              <a
                href={getWhatsAppLink('Hi AURA Atelier, I have a quick question.')}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#292524] text-emerald-400 hover:bg-[#332D29] transition-colors"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#292524] text-[#D5C4A3] hover:bg-[#332D29] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#292524] text-[#D5C4A3] hover:bg-[#332D29] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#FAFAF7] tracking-wide">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-[#A8A29E]">
              <li>
                <Link href="/services" className="hover:text-[#B8976C] transition-colors flex items-center gap-1">
                  <span>Services & Pricing</span>
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-[#B8976C] transition-colors flex items-center gap-1">
                  <span>Special Offers & Packages</span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#B8976C] transition-colors flex items-center gap-1">
                  <span>Photo Gallery</span>
                </Link>
              </li>
              <li>
                <Link href="/lookup" className="hover:text-[#B8976C] transition-colors flex items-center gap-1">
                  <span>Lookup / Manage Booking</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#B8976C] transition-colors flex items-center gap-1 text-xs text-[#78716C]">
                  <span>Staff Portal Login</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours & Schedule */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#FAFAF7] tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#B8976C]" />
              <span>Hours of Atelier</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              <li className="flex justify-between border-b border-[#292524] pb-1.5">
                <span>Monday – Friday</span>
                <span className="text-[#FAFAF7] font-medium">10:00 AM – 8:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-[#292524] pb-1.5">
                <span>Saturday</span>
                <span className="text-[#FAFAF7] font-medium">9:30 AM – 7:30 PM</span>
              </li>
              <li className="flex justify-between pb-1.5">
                <span>Sunday</span>
                <span className="text-amber-500/90 font-medium">Closed for Rest</span>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#FAFAF7] tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#B8976C]" />
              <span>Visit Us</span>
            </h3>
            <div className="space-y-2.5 text-xs text-[#A8A29E]">
              <p className="leading-relaxed text-[#D6D3D1]">
                {siteConfig.address}
              </p>
              <div className="pt-2 flex flex-col space-y-2">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-2 text-sm text-[#FAFAF7] hover:text-[#B8976C] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#B8976C]" />
                  <span>{siteConfig.phone}</span>
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 text-xs text-[#A8A29E] hover:text-[#FAFAF7] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#B8976C]" />
                  <span>{siteConfig.email}</span>
                </a>
              </div>
              <div className="pt-2">
                <a
                  href={siteConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-medium text-[#B8976C] hover:underline"
                >
                  <span>Get Directions on Google Maps</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#78716C]">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-light">Designed for Artisanal Salon Excellence.</p>
        </div>
      </div>
    </footer>
  );
}

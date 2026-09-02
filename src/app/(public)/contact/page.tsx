import { MapPin, Phone, Mail, Clock, MessageSquare, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { getWhatsAppLink } from '@/lib/whatsapp';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#B8976C]">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1917]">
          Location & Concierge
        </h1>
        <p className="text-sm text-[#78716C]">
          Have questions about a custom bridal package or complex hair transformation? Connect with our concierge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Contact Info Card */}
        <div className="bg-white p-8 rounded-3xl border border-[#E8DEC9] shadow-soft space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
            Atelier Contact Details
          </h2>

          <div className="space-y-4 text-xs text-[#44403C]">
            <div className="flex items-start space-x-3 pb-3 border-b border-[#FAFAF7]">
              <MapPin className="w-5 h-5 text-[#B8976C] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#1C1917] text-sm block mb-1">Sanctuary Address</span>
                <span className="text-[#78716C] leading-relaxed">{siteConfig.address}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 pb-3 border-b border-[#FAFAF7]">
              <Phone className="w-5 h-5 text-[#B8976C] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#1C1917] text-sm block mb-1">Direct Telephone</span>
                <a href={`tel:${siteConfig.phone}`} className="text-sm text-[#1C1917] font-semibold hover:text-[#B8976C]">
                  {siteConfig.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3 pb-3 border-b border-[#FAFAF7]">
              <Mail className="w-5 h-5 text-[#B8976C] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#1C1917] text-sm block mb-1">Email Inquiry</span>
                <a href={`mailto:${siteConfig.email}`} className="text-[#78716C] hover:text-[#1C1917]">
                  {siteConfig.email}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-[#B8976C] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#1C1917] text-sm block mb-1">Hours of Operation</span>
                <span className="text-[#78716C] leading-relaxed">{siteConfig.hours}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8DEC9] flex flex-wrap gap-3">
            <a
              href={`tel:${siteConfig.phone}`}
              className="px-6 py-3 bg-[#1C1917] text-white text-xs font-semibold rounded-full hover:bg-[#B8976C] transition-colors"
            >
              Call Salon Now
            </a>

            <a
              href={getWhatsAppLink('Hi AURA Atelier, I would like to inquire about booking.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href={siteConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-[#E8DEC9] text-[#1C1917] hover:bg-[#E8DEC9]/50 text-xs font-semibold rounded-full transition-colors flex items-center gap-1"
            >
              <span>Get Directions</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-[#F5F2EB] rounded-3xl border border-[#E8DEC9] overflow-hidden min-h-[450px] relative shadow-soft">
          <iframe
            title="Interactive Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.715220261314!2d-118.40268572352882!3d34.06394541712211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c3c72b8d000!2sBeverly%20Hills%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            className="w-full h-full absolute inset-0 border-0 filter grayscale hover:grayscale-0 transition-all duration-500"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

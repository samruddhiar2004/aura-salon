import Link from 'next/link';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle,
  Phone,
  MessageSquare,
  MapPin,
  Star,
  Award,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';
import { db } from '@/lib/db';
import { siteConfig } from '@/lib/config';
import { getWhatsAppLink, getServiceInquiryWhatsAppLink } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch Featured Services
  const featuredServices = await db.service.findMany({
    where: { isActive: true, isFeatured: true },
    take: 6,
    include: { category: true },
  });

  // Fetch Active Offers
  const activeOffers = await db.offer.findMany({
    where: { isActive: true },
    take: 3,
  });

  // Fetch Gallery Images
  const galleryImages = await db.galleryImage.findMany({
    take: 6,
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F5F2EB] py-16 lg:py-24 border-b border-[#E8DEC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#E8DEC9]/60 border border-[#D5C4A3] text-xs font-semibold text-[#64472E]">
                <Sparkles className="w-3.5 h-3.5 text-[#B8976C]" />
                <span>Beverly Hills Premier Beauty Atelier</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#1C1917] leading-[1.1]">
                Bespoke Beauty & <br />
                <span className="italic font-normal text-[#B8976C]">Artisanal Rest</span>
              </h1>

              <p className="text-base sm:text-lg text-[#44403C] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Step into an unhurried, luxury sanctuary where master stylists, color directors, and clinical skin specialists curate your personal aesthetic.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/book"
                  className="w-full sm:w-auto px-8 py-4 bg-[#1C1917] text-[#FAFAF7] hover:bg-[#B8976C] text-sm font-semibold rounded-full shadow-soft hover:shadow-elevated transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-4 h-4 text-[#B8976C]" />
                  <span>Book Appointment</span>
                </Link>

                <Link
                  href="/services"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-[#1C1917] hover:bg-[#E8DEC9]/50 border border-[#E8DEC9] text-sm font-semibold rounded-full transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4 text-[#B8976C]" />
                </Link>
              </div>

              {/* Quick stats micro bar */}
              <div className="pt-8 border-t border-[#E8DEC9] grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="font-serif text-2xl font-bold text-[#1C1917]">10+</div>
                  <div className="text-xs text-[#78716C]">Years Excellence</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-[#1C1917]">4.9★</div>
                  <div className="text-xs text-[#78716C]">Customer Rating</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-[#1C1917]">100%</div>
                  <div className="text-xs text-[#78716C]">Organic Products</div>
                </div>
              </div>
            </div>

            {/* Right Photography */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-elevated border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
                    alt="AURA Atelier Luxury Salon Interior"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl border border-[#E8DEC9] shadow-elevated hidden sm:flex items-center space-x-3 max-w-xs">
                  <div className="p-3 bg-[#FAFAF7] rounded-xl text-[#B8976C]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1C1917]">Japanese Head Spa</div>
                    <div className="text-[11px] text-[#78716C]">Now available in Beverly Hills</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#B8976C]">
            Curated Atelier Catalogue
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] mt-1">
            Featured Treatments
          </h2>
          <p className="text-sm text-[#78716C] mt-2">
            Each ritual is customized to elevate your personal style using luxury, non-toxic formulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-[#E8DEC9] overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col group"
            >
              {service.image && (
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#1C1917]">
                    {service.category.name}
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl font-bold text-[#1C1917] group-hover:text-[#B8976C] transition-colors">
                      {service.name}
                    </h3>
                    <span className="font-serif text-lg font-bold text-[#B8976C]">
                      ${service.price}
                    </span>
                  </div>
                  <p className="text-xs text-[#78716C] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#FAFAF7] flex items-center justify-between">
                  <span className="text-xs text-[#78716C] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#B8976C]" />
                    {service.durationMinutes} mins
                  </span>

                  <Link
                    href={`/book?service=${service.id}`}
                    className="px-4 py-2 bg-[#1C1917] text-[#FAFAF7] hover:bg-[#B8976C] text-xs font-semibold rounded-full transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-[#1C1917] hover:text-[#B8976C] transition-colors"
          >
            <span>View All Services & Pricing</span>
            <ArrowRight className="w-4 h-4 text-[#B8976C]" />
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-[#F5F2EB] py-16 border-y border-[#E8DEC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B8976C]">
              The AURA Promise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] mt-1">
              Why Guests Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-[#E8DEC9] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAFAF7] text-[#B8976C] flex items-center justify-center mx-auto border border-[#E8DEC9]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">Master Specialists</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Trained in London & Paris with over a decade of high-fashion and clinical expertise.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8DEC9] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAFAF7] text-[#B8976C] flex items-center justify-center mx-auto border border-[#E8DEC9]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">Organic & Clean</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Sustainably sourced, cruelty-free, ammonia-free products for hair & skin vitality.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8DEC9] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAFAF7] text-[#B8976C] flex items-center justify-center mx-auto border border-[#E8DEC9]">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">Personal Consultation</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Every appointment begins with an in-depth conversation regarding your lifestyle & hair goals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8DEC9] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAFAF7] text-[#B8976C] flex items-center justify-center mx-auto border border-[#E8DEC9]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">Pristine Hygiene</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Medical-grade sterilization for all nail & facial instruments in a pristine environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OFFERS BANNER (if offers exist) */}
      {activeOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1C1917] text-[#FAFAF7] rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="relative z-10 max-w-xl space-y-4">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#B8976C]">
                Exclusive Seasonal Offers
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">
                {activeOffers[0].title}
              </h2>
              <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
                {activeOffers[0].description}
              </p>
              {activeOffers[0].code && (
                <div className="inline-block bg-[#292524] px-4 py-2 rounded-lg border border-[#332D29] font-mono text-xs text-[#B8976C]">
                  Promo Code: <span className="font-bold text-white">{activeOffers[0].code}</span>
                </div>
              )}
              <div className="pt-2">
                <Link
                  href="/book"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-[#B8976C] text-white font-semibold text-xs rounded-full hover:bg-amber-700 transition-colors"
                >
                  <span>Claim & Book Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GALLERY PREVIEW */}
      {galleryImages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-[#B8976C]">
                Atelier Atmosphere
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#1C1917]">
                Visual Journal
              </h2>
            </div>
            <Link
              href="/gallery"
              className="mt-4 sm:mt-0 text-xs font-semibold text-[#1C1917] hover:text-[#B8976C] flex items-center gap-1"
            >
              <span>Explore Full Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img) => (
              <div
                key={img.id}
                className="aspect-square rounded-2xl overflow-hidden border border-[#E8DEC9] relative group"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                  <span className="text-xs font-serif font-bold text-white">
                    {img.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="bg-[#FAF8F5] py-16 border-y border-[#E8DEC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#B8976C]">
            Client Experiences
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#1C1917] mt-1 mb-10">
            Words From Our Guests
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl border border-[#E8DEC9] shadow-soft space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-[#44403C] italic leading-relaxed">
                "Ananya transformed my hair with the most seamless balayage I’ve ever received. The salon atmosphere is peaceful, refined, and truly elevated."
              </p>
              <div className="text-xs font-bold text-[#1C1917] pt-2 border-t border-[#FAFAF7]">
                — Camilla Rodriguez
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8DEC9] shadow-soft space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-[#44403C] italic leading-relaxed">
                "The Japanese Head Spa treatment is pure bliss. From the scalp hydro-therapy to the neck massage, it’s an experience everyone needs."
              </p>
              <div className="text-xs font-bold text-[#1C1917] pt-2 border-t border-[#FAFAF7]">
                — Julian Vance
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8DEC9] shadow-soft space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-[#44403C] italic leading-relaxed">
                "Priya’s Hydra-Glow facial gave me instant glass skin before my event. The booking process was effortless right from my phone."
              </p>
              <div className="text-xs font-bold text-[#1C1917] pt-2 border-t border-[#FAFAF7]">
                — Dr. Sarah Jenkins
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION & CONTACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#E8DEC9] overflow-hidden shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 sm:p-12 space-y-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#B8976C]">
                Visit Us
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#1C1917]">
                Location & Operating Hours
              </h2>

              <div className="space-y-4 text-xs text-[#44403C]">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-[#B8976C] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1C1917] block mb-0.5">Address</span>
                    <span>{siteConfig.address}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-[#B8976C] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1C1917] block mb-0.5">Hours</span>
                    <span>{siteConfig.hours}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="px-5 py-2.5 bg-[#1C1917] text-white text-xs font-semibold rounded-full flex items-center gap-2 hover:bg-[#B8976C] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {siteConfig.phone}</span>
                </a>

                <a
                  href={getWhatsAppLink('Hi AURA Atelier, I have a question.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-full flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Google Map Embed / Image Placeholder */}
            <div className="bg-[#F5F2EB] relative min-h-[300px] flex items-center justify-center p-6 border-t lg:border-t-0 lg:border-l border-[#E8DEC9]">
              <iframe
                title="Salon Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.715220261314!2d-118.40268572352882!3d34.06394541712211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c3c72b8d000!2sBeverly%20Hills%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                className="w-full h-full absolute inset-0 border-0 filter grayscale opacity-90 hover:grayscale-0 transition-all duration-500"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-[#1C1917] text-[#FAFAF7] rounded-3xl p-10 sm:p-14 space-y-6 shadow-elevated">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Ready for Your Next Appointment?
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A29E] max-w-md mx-auto">
            Book online in less than two minutes. Select your service, date, and preferred specialist.
          </p>
          <div>
            <Link
              href="/book"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-[#B8976C] text-white hover:bg-amber-700 text-sm font-semibold rounded-full shadow-soft transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

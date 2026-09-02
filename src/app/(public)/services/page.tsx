import Link from 'next/link';
import { db } from '@/lib/db';
import { Clock, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { getServiceInquiryWhatsAppLink } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  let categories: any[] = [];
  try {
    categories = await db.serviceCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        services: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
      },
    });
  } catch (e) {
    console.error('Services DB fetch error:', e);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#B8976C]">
          Atelier Treatment Menu
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1917]">
          Services & Pricing
        </h1>
        <p className="text-sm text-[#78716C] leading-relaxed">
          Discover our full menu of artisanal hair, color, skin aesthetics, and holistic spa rituals. All services include a personalized consultation.
        </p>
      </div>

      {/* Category Menu Sections */}
      <div className="space-y-16">
        {categories.map((category) => {
          if (category.services.length === 0) return null;

          return (
            <div key={category.id} id={category.slug} className="space-y-6 scroll-mt-24">
              <div className="border-b border-[#E8DEC9] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-xs text-[#78716C] mt-1">{category.description}</p>
                  )}
                </div>
                <span className="text-xs font-semibold text-[#B8976C] mt-2 sm:mt-0">
                  {category.services.length} Treatments Available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.services.map((service: any) => (
                  <div
                    key={service.id}
                    className="bg-white p-6 rounded-2xl border border-[#E8DEC9] shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-serif text-lg font-bold text-[#1C1917] group-hover:text-[#B8976C] transition-colors">
                          {service.name}
                        </h3>
                        <span className="font-serif text-lg font-bold text-[#B8976C] shrink-0">
                          ${service.price}
                        </span>
                      </div>
                      <p className="text-xs text-[#78716C] leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#FAFAF7] flex items-center justify-between">
                      <span className="text-xs text-[#78716C] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#B8976C]" />
                        <span>{service.durationMinutes} minutes</span>
                      </span>

                      <div className="flex items-center space-x-2">
                        <a
                          href={getServiceInquiryWhatsAppLink(service.name, service.price)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full border border-[#E8DEC9] text-[#78716C] hover:text-emerald-600 hover:border-emerald-300 transition-colors"
                          title="Ask on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>

                        <Link
                          href={`/book?service=${service.id}`}
                          className="px-4 py-2 bg-[#1C1917] text-[#FAFAF7] hover:bg-[#B8976C] text-xs font-semibold rounded-full transition-colors flex items-center gap-1"
                        >
                          <span>Book</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import Link from 'next/link';
import { db } from '@/lib/db';
import { Tag, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OffersPage() {
  const offers = await db.offer.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#B8976C]">
          Exclusive Atelier Packages
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1917]">
          Special Offers
        </h1>
        <p className="text-sm text-[#78716C]">
          Seasonal promotional packages and introductory rewards for new & returning guests.
        </p>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#E8DEC9] p-8">
          <p className="text-sm text-[#78716C]">No active offers at this moment. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-3xl border border-[#E8DEC9] overflow-hidden shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              {offer.image && (
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#1C1917] text-[#FAFAF7] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#B8976C]" />
                    <span>Special Package</span>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
                    {offer.title}
                  </h2>
                  <p className="text-xs text-[#78716C] leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8DEC9] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    {offer.code && (
                      <span className="font-mono font-bold bg-[#E8DEC9]/40 px-2.5 py-1 rounded-md text-[#1C1917]">
                        Code: {offer.code}
                      </span>
                    )}
                    <span className="text-[#78716C]">Valid until: {offer.validUntil}</span>
                  </div>

                  <Link
                    href="/book"
                    className="w-full py-3 bg-[#1C1917] text-white hover:bg-[#B8976C] text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors"
                  >
                    <span>Claim & Book Appointment</span>
                    <ArrowRight className="w-4 h-4 text-[#B8976C]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

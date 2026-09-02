import { db } from '@/lib/db';

export const revalidate = 60;

export default async function GalleryPage() {
  const gallery = await db.galleryImage.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#B8976C]">
          Visual Inspiration
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1917]">
          Atelier Gallery
        </h1>
        <p className="text-sm text-[#78716C]">
          Immerse yourself in our Beverly Hills sanctuary, artisanal styling results, and serene treatment suites.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((img) => (
          <div
            key={img.id}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E8DEC9] bg-[#F5F2EB] shadow-soft"
          >
            <img
              src={img.imageUrl}
              alt={img.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-5 flex flex-col justify-end">
              <span className="text-[11px] uppercase tracking-widest text-[#B8976C] font-semibold">
                {img.category}
              </span>
              <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                {img.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hair');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadGallery() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGallery();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !imageUrl) return;

    try {
      setSaving(true);
      await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, imageUrl }),
      });
      setTitle('');
      setImageUrl('');
      setModalOpen(false);
      loadGallery();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this gallery photo?')) return;
    try {
      await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
      loadGallery();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
            Gallery Management
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Upload and organize photos displayed in the public website journal.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-[#1C1917] text-white hover:bg-[#B8976C] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4 text-[#B8976C]" />
          <span>Add Photo</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#78716C]">Loading gallery images...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-2xl border border-[#E8DEC9] overflow-hidden shadow-soft group relative aspect-square"
            >
              <img
                src={img.imageUrl}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="self-end p-1.5 bg-rose-600 text-white rounded-lg text-xs"
                  title="Delete Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div>
                  <span className="text-[10px] font-bold text-[#B8976C] uppercase">
                    {img.category}
                  </span>
                  <h4 className="font-serif text-xs font-bold text-white truncate">
                    {img.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAdd}
            className="bg-white max-w-md w-full rounded-3xl p-6 border border-[#E8DEC9] shadow-elevated space-y-4"
          >
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              Add Photo to Gallery
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Modern Atelier Interior"
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                >
                  <option value="Hair">Hair</option>
                  <option value="Skin">Skin</option>
                  <option value="Nails">Nails</option>
                  <option value="Spa">Spa</option>
                  <option value="Interior">Interior</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Image URL *
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-[#E8DEC9] text-xs font-semibold rounded-xl text-[#78716C] hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-[#1C1917] text-white text-xs font-semibold rounded-xl hover:bg-[#B8976C]"
              >
                {saving ? 'Adding...' : 'Add Image'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

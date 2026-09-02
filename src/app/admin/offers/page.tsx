'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Calendar, Sparkles } from 'lucide-react';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [fixedDiscount, setFixedDiscount] = useState('');
  const [validUntil, setValidUntil] = useState('2026-12-31');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadOffers() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/offers');
      const data = await res.json();
      setOffers(data.offers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOffers();
  }, []);

  function openCreateModal() {
    setEditingOffer(null);
    setTitle('');
    setDescription('');
    setCode('');
    setDiscountPercent('');
    setFixedDiscount('');
    setValidUntil('2026-12-31');
    setImage('');
    setIsActive(true);
    setModalOpen(true);
  }

  function openEditModal(off: any) {
    setEditingOffer(off);
    setTitle(off.title);
    setDescription(off.description);
    setCode(off.code || '');
    setDiscountPercent(off.discountPercent ? off.discountPercent.toString() : '');
    setFixedDiscount(off.fixedDiscount ? off.fixedDiscount.toString() : '');
    setValidUntil(off.validUntil);
    setImage(off.image || '');
    setIsActive(off.isActive);
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description || !validUntil) return;

    try {
      setSaving(true);
      const payload = {
        id: editingOffer?.id,
        title,
        description,
        code,
        discountPercent,
        fixedDiscount,
        validUntil,
        image,
        isActive,
      };

      if (editingOffer) {
        await fetch('/api/admin/offers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/admin/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      loadOffers();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      await fetch(`/api/admin/offers?id=${id}`, { method: 'DELETE' });
      loadOffers();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
            Promotional Offers
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Create and manage promotional discount codes and special packages.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#1C1917] text-white hover:bg-[#B8976C] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4 text-[#B8976C]" />
          <span>Create New Offer</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#78716C]">Loading offers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((off) => (
            <div
              key={off.id}
              className="bg-white p-6 rounded-3xl border border-[#E8DEC9] shadow-soft space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                    {off.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      off.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {off.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-xs text-[#78716C] leading-relaxed">
                  {off.description}
                </p>

                {off.code && (
                  <span className="inline-block bg-[#E8DEC9]/40 font-mono text-xs font-bold text-[#1C1917] px-2.5 py-1 rounded-md">
                    Code: {off.code}
                  </span>
                )}
              </div>

              <div className="pt-3 border-t border-[#E8DEC9] flex justify-between items-center text-xs text-[#78716C]">
                <span>Valid until: {off.validUntil}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(off)}
                    className="p-1.5 border border-[#E8DEC9] rounded-xl text-[#1C1917] hover:bg-gray-100"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(off.id)}
                    className="p-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
            onSubmit={handleSave}
            className="bg-white max-w-md w-full rounded-3xl p-6 border border-[#E8DEC9] shadow-elevated space-y-4"
          >
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              {editingOffer ? 'Edit Offer' : 'Create New Offer'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Offer Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Summer Glow Package"
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={2}
                  placeholder="Offer details and terms..."
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Promo Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="SUMMER20"
                    className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-xs font-semibold text-[#1C1917] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-gray-300 text-[#B8976C] focus:ring-[#B8976C]"
                  />
                  <span>Active & Displayed on Public Website</span>
                </label>
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
                {saving ? 'Saving...' : 'Save Offer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

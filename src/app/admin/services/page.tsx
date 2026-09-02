'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Scissors, Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react';

export default function AdminServicesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [image, setImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetch('/api/services');
      const data = await res.json();
      setCategories(data.categories || []);
      setServices(data.services || []);
      if (data.categories?.length > 0) {
        setCategoryId(data.categories[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateModal() {
    setEditingService(null);
    setName('');
    setDescription('');
    setPrice('');
    setDurationMinutes('60');
    setImage('');
    setIsFeatured(false);
    setIsActive(true);
    setModalOpen(true);
  }

  function openEditModal(srv: any) {
    setEditingService(srv);
    setName(srv.name);
    setCategoryId(srv.categoryId);
    setDescription(srv.description);
    setPrice(srv.price.toString());
    setDurationMinutes(srv.durationMinutes.toString());
    setImage(srv.image || '');
    setIsFeatured(srv.isFeatured);
    setIsActive(srv.isActive);
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !categoryId || !price || !durationMinutes) return;

    try {
      setSaving(true);
      const payload = {
        name,
        categoryId,
        description,
        price,
        durationMinutes,
        image,
        isFeatured,
        isActive,
      };

      if (editingService) {
        await fetch(`/api/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
            Services Catalogue
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Manage treatments, descriptions, pricing, durations, and category assignments.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#1C1917] text-white hover:bg-[#B8976C] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4 text-[#B8976C]" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table/Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#78716C]">Loading services menu...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8DEC9] overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF7] border-b border-[#E8DEC9] text-[#78716C] font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Service Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DEC9]">
                {services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-[#FAFAF7]/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#1C1917]">
                      <div>{srv.name}</div>
                      <div className="text-[11px] text-[#78716C] font-normal truncate max-w-xs">
                        {srv.description}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#78716C]">
                      {srv.category?.name || 'Uncategorized'}
                    </td>
                    <td className="py-4 px-4 font-medium text-[#1C1917]">
                      {srv.durationMinutes} mins
                    </td>
                    <td className="py-4 px-4 font-serif font-bold text-[#B8976C]">
                      ${srv.price}
                    </td>
                    <td className="py-4 px-4">
                      {srv.isFeatured ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ★ Featured
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {srv.isActive ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(srv)}
                        className="p-1.5 border border-[#E8DEC9] rounded-lg text-[#1C1917] hover:bg-gray-100"
                        title="Edit Service"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(srv.id)}
                        className="p-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white max-w-lg w-full rounded-3xl p-6 border border-[#E8DEC9] shadow-elevated space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              {editingService ? 'Edit Treatment Service' : 'Add New Treatment Service'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Signature Cut & Blowout"
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8976C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="95.00"
                    className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    required
                    placeholder="60"
                    className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Detailed description of the service..."
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Image URL (Unsplash or hosted)
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs font-semibold text-[#1C1917] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-gray-300 text-[#B8976C] focus:ring-[#B8976C]"
                  />
                  <span>Featured on Home Page</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-semibold text-[#1C1917] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-gray-300 text-[#B8976C] focus:ring-[#B8976C]"
                  />
                  <span>Active (Bookable)</span>
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
                {saving ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

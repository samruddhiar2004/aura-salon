'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, Clock, Scissors, Check } from 'lucide-react';

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);

  // Form
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('20:00');
  const [selectedWorkDays, setSelectedWorkDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const [resStaff, resServices] = await Promise.all([
        fetch('/api/staff'),
        fetch('/api/services'),
      ]);
      const dataStaff = await resStaff.json();
      const dataServices = await resServices.json();

      setStaffList(dataStaff.staff || []);
      setAllServices(dataServices.services || []);
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
    setEditingStaff(null);
    setName('');
    setRole('');
    setBio('');
    setImage('');
    setIsAvailable(true);
    setStartTime('10:00');
    setEndTime('20:00');
    setSelectedWorkDays([1, 2, 3, 4, 5, 6]);
    setSelectedServiceIds(allServices.map((s) => s.id));
    setModalOpen(true);
  }

  function openEditModal(staff: any) {
    setEditingStaff(staff);
    setName(staff.name);
    setRole(staff.role);
    setBio(staff.bio || '');
    setImage(staff.image || '');
    setIsAvailable(staff.isAvailable);
    setStartTime(staff.startTime || '10:00');
    setEndTime(staff.endTime || '20:00');
    const days = staff.workDays ? staff.workDays.split(',').map(Number) : [1, 2, 3, 4, 5, 6];
    setSelectedWorkDays(days);
    const assignedIds = staff.staffServices ? staff.staffServices.map((ss: any) => ss.serviceId) : [];
    setSelectedServiceIds(assignedIds);
    setModalOpen(true);
  }

  function toggleWorkDay(day: number) {
    if (selectedWorkDays.includes(day)) {
      setSelectedWorkDays(selectedWorkDays.filter((d) => d !== day));
    } else {
      setSelectedWorkDays([...selectedWorkDays, day].sort());
    }
  }

  function toggleService(id: string) {
    if (selectedServiceIds.includes(id)) {
      setSelectedServiceIds(selectedServiceIds.filter((sId) => sId !== id));
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !role) return;

    try {
      setSaving(true);
      const payload = {
        name,
        role,
        bio,
        image,
        isAvailable,
        startTime,
        endTime,
        workDays: selectedWorkDays.join(','),
        serviceIds: selectedServiceIds,
      };

      if (editingStaff) {
        await fetch(`/api/staff/${editingStaff.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/staff', {
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
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
            Staff & Stylists Management
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Manage team members, roles, working hours, and assigned treatment services.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#1C1917] text-white hover:bg-[#B8976C] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4 text-[#B8976C]" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#78716C]">Loading team directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {staffList.map((staff) => (
            <div
              key={staff.id}
              className="bg-white p-6 rounded-3xl border border-[#E8DEC9] shadow-soft flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start space-x-4">
                {staff.image ? (
                  <img
                    src={staff.image}
                    alt={staff.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#E8DEC9] shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#E8DEC9] text-[#1C1917] flex items-center justify-center font-serif font-bold text-xl shrink-0">
                    {staff.name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-lg font-bold text-[#1C1917] truncate">
                      {staff.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        staff.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {staff.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <p className="text-xs text-[#B8976C] font-semibold mt-0.5">{staff.role}</p>

                  {staff.bio && (
                    <p className="text-[11px] text-[#78716C] leading-normal mt-2 line-clamp-2">
                      {staff.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8DEC9] space-y-2 text-xs text-[#78716C]">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-[#B8976C]" />
                  <span>
                    {staff.startTime} – {staff.endTime} (
                    {staff.workDays
                      .split(',')
                      .map((d: string) => dayLabels[parseInt(d, 10)])
                      .join(', ')}
                    )
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <Scissors className="w-3.5 h-3.5 text-[#B8976C] shrink-0 mt-0.5" />
                  <span>
                    Services ({staff.staffServices?.length || 0}):{' '}
                    <strong className="text-[#1C1917]">
                      {staff.staffServices
                        ?.map((ss: any) => ss.service?.name)
                        .filter(Boolean)
                        .slice(0, 3)
                        .join(', ')}
                      {(staff.staffServices?.length || 0) > 3 ? '...' : ''}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  onClick={() => openEditModal(staff)}
                  className="px-3 py-1.5 border border-[#E8DEC9] rounded-xl text-xs font-semibold text-[#1C1917] hover:bg-gray-100 flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5 text-[#B8976C]" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => handleDelete(staff.id)}
                  className="p-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl"
                  title="Delete Staff"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white max-w-lg w-full rounded-3xl p-6 border border-[#E8DEC9] shadow-elevated space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              {editingStaff ? 'Edit Staff Profile' : 'Add Staff Member'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Role / Title *
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  placeholder="e.g. Master Balayage Director"
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Bio / Qualifications
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  placeholder="Brief staff bio..."
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Start Shift Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    End Shift Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  Working Days of Week
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {dayLabels.map((label, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => toggleWorkDay(idx)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                        selectedWorkDays.includes(idx)
                          ? 'bg-[#1C1917] text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  Assigned Services
                </label>
                <div className="max-h-36 overflow-y-auto border border-[#E8DEC9] p-3 rounded-xl space-y-1.5">
                  {allServices.map((srv) => (
                    <label
                      key={srv.id}
                      className="flex items-center space-x-2 text-xs text-[#1C1917] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServiceIds.includes(srv.id)}
                        onChange={() => toggleService(srv.id)}
                        className="rounded border-gray-300 text-[#B8976C] focus:ring-[#B8976C]"
                      />
                      <span>{srv.name} (${srv.price})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 text-xs font-semibold text-[#1C1917] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="rounded border-gray-300 text-[#B8976C] focus:ring-[#B8976C]"
                  />
                  <span>Active & Available for Booking</span>
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
                {saving ? 'Saving...' : 'Save Staff Profile'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

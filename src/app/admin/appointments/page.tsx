'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  Filter,
  Phone,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Scissors,
  Edit,
  Trash2,
} from 'lucide-react';
import { getAdminCustomerWhatsAppLink } from '@/lib/whatsapp';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  // Reschedule Modal State
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [updating, setUpdating] = useState(false);

  async function loadAppointments() {
    try {
      setLoading(true);
      let query = `/api/admin/appointments?status=${statusFilter}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (dateFilter) query += `&date=${dateFilter}`;

      const res = await fetch(query);
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, [statusFilter, dateFilter]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadAppointments();
  }

  async function updateStatus(id: string, status: string) {
    try {
      await fetch(`/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      loadAppointments();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRescheduleSubmit() {
    if (!selectedApp || !rescheduleDate || !rescheduleTime) return;
    try {
      setUpdating(true);
      await fetch(`/api/admin/appointments/${selectedApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: rescheduleDate, startTime: rescheduleTime }),
      });
      setSelectedApp(null);
      loadAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
          Appointment Management
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          View, filter, confirm, reschedule, or manage status for all customer bookings.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DEC9] shadow-soft flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, phone, code..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#E8DEC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8976C]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#1C1917] text-white text-xs font-semibold rounded-xl hover:bg-[#B8976C] transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl text-[#1C1917] focus:outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl text-[#1C1917] focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {(search || dateFilter || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setDateFilter('');
                setStatusFilter('ALL');
              }}
              className="text-xs text-rose-600 hover:underline font-medium px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-3 border-[#B8976C] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-xs text-[#78716C]">Fetching appointments...</span>
        </div>
      ) : appointments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E8DEC9]">
          <p className="text-xs text-[#78716C]">No appointments matching selected criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="bg-white p-5 rounded-2xl border border-[#E8DEC9] shadow-soft hover:shadow-elevated transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Info Left */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-[#E8DEC9]/50 px-2 py-0.5 rounded text-[#1C1917]">
                    {app.appointmentCode}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      app.status === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-800'
                        : app.status === 'CANCELLED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div>
                    <span className="text-[#78716C]">Customer: </span>
                    <strong className="text-[#1C1917]">{app.customer.name}</strong> ({app.customer.phone})
                  </div>
                  <div>
                    <span className="text-[#78716C]">Treatment: </span>
                    <strong className="text-[#1C1917]">{app.service.name}</strong>
                  </div>
                  <div>
                    <span className="text-[#78716C]">Specialist: </span>
                    <strong className="text-[#1C1917]">{app.staff?.name || 'Any'}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#78716C]">
                  <span className="flex items-center gap-1 text-[#1C1917] font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#B8976C]" />
                    {app.date} at {app.startTime} - {app.endTime}
                  </span>
                  <span>•</span>
                  <span className="font-serif font-bold text-[#B8976C]">${app.price}</span>
                  {app.notes && (
                    <>
                      <span>•</span>
                      <span className="italic text-gray-500">Note: "{app.notes}"</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions Right */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {app.status === 'CONFIRMED' && (
                  <button
                    onClick={() => updateStatus(app.id, 'COMPLETED')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedApp(app);
                    setRescheduleDate(app.date);
                    setRescheduleTime(app.startTime);
                  }}
                  className="px-3 py-1.5 border border-[#E8DEC9] text-[#1C1917] hover:bg-[#FAFAF7] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5 text-[#B8976C]" />
                  <span>Reschedule</span>
                </button>

                {app.status !== 'CANCELLED' && (
                  <button
                    onClick={() => updateStatus(app.id, 'CANCELLED')}
                    className="p-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs transition-colors"
                    title="Cancel Booking"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}

                <a
                  href={getAdminCustomerWhatsAppLink(app.customer.phone, app.customer.name, app.appointmentCode)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-[#E8DEC9] text-emerald-600 hover:bg-emerald-50 rounded-xl text-xs transition-colors"
                  title="WhatsApp Guest"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>

                <a
                  href={`tel:${app.customer.phone}`}
                  className="p-2 border border-[#E8DEC9] text-[#1C1917] hover:bg-[#FAFAF7] rounded-xl text-xs transition-colors"
                  title="Call Guest"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 border border-[#E8DEC9] shadow-elevated space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              Reschedule Appointment ({selectedApp.appointmentCode})
            </h3>
            <p className="text-xs text-[#78716C]">
              Customer: <strong className="text-[#1C1917]">{selectedApp.customer.name}</strong> ({selectedApp.service.name})
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  New Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  New Time Slot (HH:mm)
                </label>
                <input
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 border border-[#E8DEC9] text-xs font-semibold rounded-xl text-[#78716C] hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                disabled={updating}
                className="px-4 py-2 bg-[#1C1917] text-white text-xs font-semibold rounded-xl hover:bg-[#B8976C]"
              >
                {updating ? 'Saving...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

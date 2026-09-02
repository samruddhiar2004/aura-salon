'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  Phone,
  MessageSquare,
  XCircle,
  Scissors,
  Plus,
  RefreshCw,
  User,
} from 'lucide-react';
import { getAdminCustomerWhatsAppLink } from '@/lib/whatsapp';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  async function loadDashboard() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/appointments');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    try {
      setActionLoadingId(id);
      await fetch(`/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      await loadDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  }

  if (loading && !data) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#B8976C] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-[#78716C]">Loading salon dashboard analytics...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    todayTotal: 0,
    upcomingCount: 0,
    completedToday: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  };

  const todayApps = data?.todayAppointments || [];

  return (
    <div className="space-y-8">
      {/* Header & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
            Dashboard Overview
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Real-time daily operations and booking telemetry for AURA Atelier.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadDashboard}
            className="p-2.5 bg-white border border-[#E8DEC9] text-[#1C1917] hover:bg-[#F5F2EB] rounded-xl transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            href="/admin/services"
            className="px-4 py-2.5 bg-[#1C1917] text-[#FAFAF7] hover:bg-[#B8976C] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-[#B8976C]" />
            <span>Manage Services</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC9] shadow-soft space-y-2">
          <div className="flex justify-between items-center text-[#78716C]">
            <span className="text-xs font-semibold">Today's Appointments</span>
            <div className="p-2 rounded-lg bg-amber-50 text-[#B8976C]">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#1C1917]">{stats.todayTotal}</div>
          <div className="text-[11px] text-[#78716C]">{stats.completedToday} completed today</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC9] shadow-soft space-y-2">
          <div className="flex justify-between items-center text-[#78716C]">
            <span className="text-xs font-semibold">Upcoming Bookings</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#1C1917]">{stats.upcomingCount}</div>
          <div className="text-[11px] text-[#78716C]">Confirmed future slots</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC9] shadow-soft space-y-2">
          <div className="flex justify-between items-center text-[#78716C]">
            <span className="text-xs font-semibold">Total Client Base</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#1C1917]">{stats.totalCustomers}</div>
          <div className="text-[11px] text-[#78716C]">Registered guests</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC9] shadow-soft space-y-2">
          <div className="flex justify-between items-center text-[#78716C]">
            <span className="text-xs font-semibold">Completed Revenue</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#1C1917]">${stats.totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-[#78716C]">From completed rituals</div>
        </div>
      </div>

      {/* TODAY'S APPOINTMENTS SCHEDULE */}
      <div className="bg-white rounded-3xl border border-[#E8DEC9] p-6 shadow-soft space-y-6">
        <div className="flex justify-between items-center border-b border-[#E8DEC9] pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1C1917]">
              Today's Schedule & Appointments
            </h2>
            <p className="text-xs text-[#78716C]">
              Chronological list of all reservations for today.
            </p>
          </div>
          <Link
            href="/admin/appointments"
            className="text-xs font-semibold text-[#B8976C] hover:underline"
          >
            View All Appointments →
          </Link>
        </div>

        {todayApps.length === 0 ? (
          <div className="p-8 text-center bg-[#FAFAF7] rounded-2xl border border-dashed border-[#E8DEC9]">
            <p className="text-xs text-[#78716C]">No appointments scheduled for today.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayApps.map((app: any) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl border border-[#E8DEC9] hover:border-[#B8976C] transition-all bg-[#FAFAF7]/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Time & Service Info */}
                <div className="flex items-start space-x-4">
                  <div className="bg-[#1C1917] text-white px-3 py-2 rounded-xl text-center shrink-0">
                    <span className="text-xs font-bold font-mono block">{app.startTime}</span>
                    <span className="text-[9px] text-[#D5C4A3] uppercase">Time</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-serif text-base font-bold text-[#1C1917]">
                        {app.service.name}
                      </h3>
                      <span className="text-xs font-serif font-bold text-[#B8976C]">
                        (${app.price})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#78716C] mt-1">
                      <span className="flex items-center gap-1 font-semibold text-[#1C1917]">
                        <User className="w-3.5 h-3.5 text-[#B8976C]" />
                        {app.customer.name} ({app.customer.phone})
                      </span>
                      <span>•</span>
                      <span>Stylist: <strong className="text-[#1C1917]">{app.staff?.name || 'Any'}</strong></span>
                      <span>•</span>
                      <span className="font-mono text-[10px] bg-[#E8DEC9]/50 px-1.5 py-0.5 rounded text-[#1C1917]">
                        {app.appointmentCode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions & Status Pill */}
                <div className="flex items-center space-x-3 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
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

                  {/* Status Toggle buttons */}
                  {app.status === 'CONFIRMED' && (
                    <button
                      onClick={() => updateStatus(app.id, 'COMPLETED')}
                      disabled={actionLoadingId === app.id}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Complete</span>
                    </button>
                  )}

                  {app.status !== 'CANCELLED' && app.status !== 'COMPLETED' && (
                    <button
                      onClick={() => updateStatus(app.id, 'CANCELLED')}
                      disabled={actionLoadingId === app.id}
                      className="p-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs transition-colors"
                      title="Cancel Booking"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}

                  <a
                    href={getAdminCustomerWhatsAppLink(app.customer.phone, app.customer.name, app.appointmentCode)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 border border-[#E8DEC9] text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs transition-colors"
                    title="WhatsApp Guest"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <a
                    href={`tel:${app.customer.phone}`}
                    className="p-1.5 border border-[#E8DEC9] text-[#1C1917] hover:bg-[#E8DEC9]/50 rounded-lg text-xs transition-colors"
                    title="Call Guest"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

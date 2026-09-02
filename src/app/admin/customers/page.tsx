'use client';

import { useState, useEffect } from 'react';
import { Search, User, Phone, Mail, Calendar, Clock, DollarSign, FileText } from 'lucide-react';
import { getAdminCustomerWhatsAppLink } from '@/lib/whatsapp';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  async function loadCustomers() {
    try {
      setLoading(true);
      let query = '/api/admin/customers';
      if (search) query += `?search=${encodeURIComponent(search)}`;

      const res = await fetch(query);
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadCustomers();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
          Customer Directory
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          Guest profiles, visit frequencies, spending telemetry, and appointment histories.
        </p>
      </div>

      {/* Search Toolbar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or phone..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E8DEC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8976C]"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[#1C1917] text-white text-xs font-semibold rounded-xl hover:bg-[#B8976C] transition-colors shrink-0"
        >
          Search
        </button>
      </form>

      {/* Customer Directory Table */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#78716C]">Loading guest profiles...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8DEC9] overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF7] border-b border-[#E8DEC9] text-[#78716C] font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Customer Name</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Total Visits</th>
                  <th className="py-3.5 px-4">Total Spent</th>
                  <th className="py-3.5 px-4">Last Visit</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DEC9]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAFAF7]/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#1C1917]">
                      {c.name}
                    </td>
                    <td className="py-4 px-4 font-mono text-[#1C1917]">{c.phone}</td>
                    <td className="py-4 px-4 text-[#78716C]">{c.email || '—'}</td>
                    <td className="py-4 px-4 font-bold text-[#1C1917]">
                      {c.totalAppointments} visits
                    </td>
                    <td className="py-4 px-4 font-serif font-bold text-[#B8976C]">
                      ${c.totalSpent}
                    </td>
                    <td className="py-4 px-4 text-[#78716C]">
                      {c.lastAppointment || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 border border-[#E8DEC9] rounded-xl text-xs font-semibold text-[#1C1917] hover:bg-gray-100"
                      >
                        View History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Detail & History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 border border-[#E8DEC9] shadow-elevated space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#E8DEC9] pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                  {selectedCustomer.name}
                </h3>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Phone: {selectedCustomer.phone} | Email: {selectedCustomer.email || 'None'}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-black font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {selectedCustomer.notes && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <strong>Guest Notes:</strong> {selectedCustomer.notes}
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                Appointment History ({selectedCustomer.appointments.length})
              </h4>

              {selectedCustomer.appointments.map((app: any) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl border border-[#E8DEC9] bg-[#FAFAF7] space-y-1 text-xs"
                >
                  <div className="flex justify-between font-semibold">
                    <span>{app.service?.name}</span>
                    <span className="text-[#B8976C] font-serif">${app.price}</span>
                  </div>
                  <div className="flex justify-between text-[#78716C]">
                    <span>Specialist: {app.staff?.name || 'Any'}</span>
                    <span>{app.date} at {app.startTime}</span>
                  </div>
                  <div className="pt-1 flex justify-between items-center text-[11px]">
                    <span className="font-mono text-gray-500">{app.appointmentCode}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold ${
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
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-[#1C1917] text-white text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Search, Calendar, Clock, User, Phone, CheckCircle2, XCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { getAppointmentConfirmationWhatsAppLink } from '@/lib/whatsapp';

export default function AppointmentLookupPage() {
  const [query, setQuery] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch(`/api/booking/lookup?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to search appointments.');
        setAppointments([]);
      } else {
        setAppointments(data.appointments || []);
      }
      setSearched(true);
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#B8976C]">
          Guest Self-Service
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
          Find Your Appointment
        </h1>
        <p className="text-sm text-[#78716C]">
          Enter your <span className="font-semibold text-[#1C1917]">Appointment Code (e.g. AUR-1001)</span> or <span className="font-semibold text-[#1C1917]">Phone Number</span> to view status & details.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="AUR-1001 or +15550192834"
            className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-[#E8DEC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8976C]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#1C1917] text-white hover:bg-[#B8976C] text-sm font-semibold rounded-xl transition-colors shrink-0 flex items-center justify-center"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Search'}
        </button>
      </form>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center">
          {errorMsg}
        </div>
      )}

      {/* Search Results */}
      {searched && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="p-8 bg-white border border-[#E8DEC9] rounded-2xl text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">No Appointments Found</h3>
              <p className="text-xs text-[#78716C]">
                We couldn't find any appointment matching "{query}". Please double check your code or phone number.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                Found {appointments.length} Appointment(s)
              </h2>

              {appointments.map((app) => (
                <div
                  key={app.id}
                  className="bg-white p-6 rounded-2xl border border-[#E8DEC9] shadow-soft space-y-4"
                >
                  <div className="flex flex-wrap justify-between items-center border-b border-[#E8DEC9] pb-3 gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#78716C] block">Appointment Code</span>
                      <span className="font-mono text-sm font-bold text-[#1C1917]">{app.appointmentCode}</span>
                    </div>

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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#44403C]">
                    <div>
                      <span className="text-[#78716C] block">Treatment:</span>
                      <span className="font-semibold text-[#1C1917] text-sm">{app.service.name}</span>
                    </div>
                    <div>
                      <span className="text-[#78716C] block">Specialist:</span>
                      <span className="font-medium text-[#1C1917]">{app.staff?.name || 'Assigned Specialist'}</span>
                    </div>
                    <div>
                      <span className="text-[#78716C] block">Date & Time:</span>
                      <span className="font-medium text-[#1C1917]">{app.date} at {app.startTime}</span>
                    </div>
                    <div>
                      <span className="text-[#78716C] block">Total Amount:</span>
                      <span className="font-serif font-bold text-[#B8976C] text-sm">${app.price}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8DEC9] flex flex-wrap justify-between items-center gap-2 text-xs">
                    <span className="text-[#78716C]">
                      Guest Name: <strong className="text-[#1C1917]">{app.customer?.name}</strong>
                    </span>

                    <a
                      href={getAppointmentConfirmationWhatsAppLink(
                        app.appointmentCode,
                        app.service.name,
                        app.date,
                        app.startTime
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-emerald-600 hover:underline font-semibold"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Contact Salon on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

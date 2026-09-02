'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminAvailabilityPage() {
  const [availability, setAvailability] = useState<any[]>([]);
  const [blackoutDates, setBlackoutDates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Blackout Date Form
  const [newBlackoutDate, setNewBlackoutDate] = useState('');
  const [newBlackoutReason, setNewBlackoutReason] = useState('');

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/availability');
      const data = await res.json();
      setAvailability(data.availability || []);
      setBlackoutDates(data.blackoutDates || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleScheduleChange(index: number, field: string, value: any) {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  }

  async function saveSchedule() {
    try {
      setSaving(true);
      await fetch('/api/admin/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedules: availability }),
      });
      alert('Operating schedule saved successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddBlackout(e: React.FormEvent) {
    e.preventDefault();
    if (!newBlackoutDate) return;
    try {
      await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newBlackoutDate, reason: newBlackoutReason }),
      });
      setNewBlackoutDate('');
      setNewBlackoutReason('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteBlackout(id: string) {
    try {
      await fetch(`/api/admin/availability?id=${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-xs text-[#78716C]">Loading schedule settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
          Availability & Schedule Control
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          Set weekly operating hours, lunch break windows, and blackout closed dates. Customers cannot book slots during closed times.
        </p>
      </div>

      {/* Weekly Schedule Section */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8DEC9] shadow-soft space-y-6">
        <div className="flex justify-between items-center border-b border-[#E8DEC9] pb-4">
          <h2 className="font-serif text-xl font-bold text-[#1C1917]">
            Weekly Operating Hours
          </h2>
          <button
            onClick={saveSchedule}
            disabled={saving}
            className="px-5 py-2.5 bg-[#1C1917] text-white hover:bg-[#B8976C] text-xs font-semibold rounded-xl transition-colors"
          >
            {saving ? 'Saving...' : 'Save Weekly Schedule'}
          </button>
        </div>

        <div className="space-y-4">
          {availability.map((item, idx) => (
            <div
              key={item.dayOfWeek}
              className="p-4 rounded-2xl border border-[#E8DEC9] bg-[#FAFAF7]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center space-x-3 w-40">
                <input
                  type="checkbox"
                  checked={item.isOpen}
                  onChange={(e) => handleScheduleChange(idx, 'isOpen', e.target.checked)}
                  className="rounded border-gray-300 text-[#B8976C] focus:ring-[#B8976C]"
                />
                <span className="font-bold text-[#1C1917] text-sm">
                  {dayNames[item.dayOfWeek]}
                </span>
              </div>

              {item.isOpen ? (
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#78716C] mb-1">
                      Open Time
                    </label>
                    <input
                      type="time"
                      value={item.openTime}
                      onChange={(e) => handleScheduleChange(idx, 'openTime', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#E8DEC9] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-[#78716C] mb-1">
                      Close Time
                    </label>
                    <input
                      type="time"
                      value={item.closeTime}
                      onChange={(e) => handleScheduleChange(idx, 'closeTime', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#E8DEC9] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-[#78716C] mb-1">
                      Break Start
                    </label>
                    <input
                      type="time"
                      value={item.breakStartTime || ''}
                      onChange={(e) => handleScheduleChange(idx, 'breakStartTime', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#E8DEC9] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-[#78716C] mb-1">
                      Break End
                    </label>
                    <input
                      type="time"
                      value={item.breakEndTime || ''}
                      onChange={(e) => handleScheduleChange(idx, 'breakEndTime', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#E8DEC9] rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 text-[#78716C] italic text-xs">
                  Closed all day
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Blackout / Holiday Dates Section */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8DEC9] shadow-soft space-y-6">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#1C1917]">
            Blackout & Holiday Dates
          </h2>
          <p className="text-xs text-[#78716C] mt-1">
            Specify specific holiday or closure dates when salon booking is completely disabled.
          </p>
        </div>

        {/* Add Blackout Form */}
        <form onSubmit={handleAddBlackout} className="flex flex-col sm:flex-row gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1">Date</label>
            <input
              type="date"
              value={newBlackoutDate}
              onChange={(e) => setNewBlackoutDate(e.target.value)}
              required
              className="px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
            />
          </div>

          <div className="flex-1">
            <label className="block text-xs font-semibold text-[#1C1917] mb-1">Reason / Event</label>
            <input
              type="text"
              value={newBlackoutReason}
              onChange={(e) => setNewBlackoutReason(e.target.value)}
              placeholder="e.g. National Holiday / Staff Retreat"
              className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-[#1C1917] text-white text-xs font-semibold rounded-xl hover:bg-[#B8976C] shrink-0"
          >
            Add Blackout Date
          </button>
        </form>

        {/* Blackouts Table */}
        <div className="space-y-2">
          {blackoutDates.length === 0 ? (
            <p className="text-xs text-[#78716C] italic">No blackout dates added.</p>
          ) : (
            blackoutDates.map((b) => (
              <div
                key={b.id}
                className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E8DEC9] flex justify-between items-center text-xs"
              >
                <div>
                  <strong className="text-[#1C1917]">{b.date}</strong> —{' '}
                  <span className="text-[#78716C]">{b.reason}</span>
                </div>
                <button
                  onClick={() => handleDeleteBlackout(b.id)}
                  className="text-rose-600 hover:text-rose-800 p-1"
                  title="Remove Blackout Date"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

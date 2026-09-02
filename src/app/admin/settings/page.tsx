'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    salon_name: 'AURA Atelier & Spa',
    salon_tagline: 'Bespoke Beauty, Elevated Rest & Modern Hair Artistry',
    salon_phone: '+1 (555) 234-5678',
    salon_whatsapp: '15552345678',
    salon_email: 'concierge@aura-salon.com',
    salon_address: '452 Beverly Atelier Way, Suite 100, Los Angeles, CA 90210',
    salon_hours: 'Mon - Fri: 10am - 8pm | Sat: 9:30am - 7:30pm | Sun: Closed',
    currency_symbol: '$',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  async function loadSettings() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.settings && Object.keys(data.settings).length > 0) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg('');
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setSuccessMsg('Salon branding configuration updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-xs text-[#78716C]">Loading salon configuration...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
          Salon Settings & Branding
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          Configure business name, address, direct telephone, WhatsApp contact, and currency.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-[#E8DEC9] shadow-soft space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#1C1917] mb-1">
            Salon Name
          </label>
          <input
            type="text"
            value={settings.salon_name || ''}
            onChange={(e) => handleChange('salon_name', e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl font-serif font-bold text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1C1917] mb-1">
            Tagline / Subtitle
          </label>
          <input
            type="text"
            value={settings.salon_tagline || ''}
            onChange={(e) => handleChange('salon_tagline', e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1">
              Public Telephone Number
            </label>
            <input
              type="text"
              value={settings.salon_phone || ''}
              onChange={(e) => handleChange('salon_phone', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1">
              WhatsApp Number (Digits only, e.g. 15552345678)
            </label>
            <input
              type="text"
              value={settings.salon_whatsapp || ''}
              onChange={(e) => handleChange('salon_whatsapp', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1C1917] mb-1">
            Concierge Email Address
          </label>
          <input
            type="email"
            value={settings.salon_email || ''}
            onChange={(e) => handleChange('salon_email', e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1C1917] mb-1">
            Physical Atelier Address
          </label>
          <input
            type="text"
            value={settings.salon_address || ''}
            onChange={(e) => handleChange('salon_address', e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1C1917] mb-1">
            Hours Overview Text (Footer & Contact page)
          </label>
          <input
            type="text"
            value={settings.salon_hours || ''}
            onChange={(e) => handleChange('salon_hours', e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#E8DEC9] rounded-xl"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#1C1917] text-white hover:bg-[#B8976C] text-xs font-semibold rounded-xl transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4 text-[#B8976C]" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

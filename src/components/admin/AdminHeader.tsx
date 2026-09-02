'use client';

import { Bell, Calendar, User, Search } from 'lucide-react';
import { siteConfig } from '@/lib/config';

interface AdminHeaderProps {
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="bg-white border-b border-[#E8DEC9] px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-soft">
      <div>
        <h2 className="font-serif text-xl font-bold text-[#1C1917]">
          {siteConfig.name} Portal
        </h2>
        <div className="flex items-center space-x-2 text-xs text-[#78716C]">
          <Calendar className="w-3.5 h-3.5 text-[#B8976C]" />
          <span>{todayFormatted}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Pill */}
        <div className="flex items-center space-x-3 bg-[#FAFAF7] border border-[#E8DEC9] px-3.5 py-1.5 rounded-full">
          <div className="w-7 h-7 rounded-full bg-[#1C1917] text-[#FAFAF7] flex items-center justify-center font-serif text-xs font-bold">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="text-left text-xs">
            <div className="font-bold text-[#1C1917]">{user?.name || 'Salon Manager'}</div>
            <div className="text-[10px] text-[#B8976C] font-semibold uppercase">{user?.role || 'ADMIN'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

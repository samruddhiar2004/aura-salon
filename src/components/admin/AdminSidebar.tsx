'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Scissors,
  Users,
  UserCheck,
  Tag,
  Image as ImageIcon,
  Clock,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { siteConfig } from '@/lib/config';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
    { href: '/admin/appointments', label: 'Appointments', icon: CalendarDays },
    { href: '/admin/services', label: 'Services Catalogue', icon: Scissors },
    { href: '/admin/staff', label: 'Staff & Stylists', icon: UserCheck },
    { href: '/admin/customers', label: 'Customer Directory', icon: Users },
    { href: '/admin/availability', label: 'Availability & Schedule', icon: Clock },
    { href: '/admin/offers', label: 'Promotional Offers', icon: Tag },
    { href: '/admin/gallery', label: 'Gallery Management', icon: ImageIcon },
    { href: '/admin/settings', label: 'Salon Settings', icon: Settings },
  ];

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-[#1C1917] text-[#FAFAF7] flex flex-col justify-between min-h-screen border-r border-[#292524] shrink-0">
      <div className="p-6 space-y-6">
        {/* Brand */}
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#B8976C] text-[#1C1917] flex items-center justify-center font-serif font-bold">
            A
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-[#FAFAF7] block leading-none">
              AURA
            </span>
            <span className="text-[9px] tracking-[0.2em] font-semibold text-[#B8976C] uppercase">
              Management Portal
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1.5 pt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-[#B8976C] text-white shadow-soft'
                    : 'text-[#A8A29E] hover:bg-[#292524] hover:text-[#FAFAF7]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#B8976C]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-[#292524] space-y-3">
        <Link
          href="/"
          target="_blank"
          className="w-full py-2 px-3 bg-[#292524] text-[#D5C4A3] hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B8976C]" />
          <span>View Live Customer Website</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full py-2 px-3 border border-rose-900/50 text-rose-400 hover:bg-rose-950/30 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

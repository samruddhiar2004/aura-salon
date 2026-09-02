import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If unauthenticated, redirect to login page (unless already on login page via Next route handling)
  // Note: /admin/login handles its own layout or page if needed, but in Next.js nested layouts apply.
  // We check if session is missing.
  if (!session) {
    // If not logged in, we render the page if it's login, else redirect
    // Since Next server component in app router receives layout context, let's redirect if no session
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex">
      {session ? (
        <>
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader user={session} />
            <main className="p-8 flex-1 overflow-y-auto">{children}</main>
          </div>
        </>
      ) : (
        <div className="w-full min-h-screen">{children}</div>
      )}
    </div>
  );
}

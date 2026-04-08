'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#6B21A8] flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-xl">B</span>
          </div>
          <Loader2 size={28} className="animate-spin text-[#7C3AED]" />
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'ADMIN') return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed sidebar — full viewport height */}
      <AdminSidebar />

      {/* Main content — offset by sidebar width on desktop */}
      <div className="flex-1 w-full lg:pl-64 min-h-screen overflow-x-hidden">
        <div className="min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}

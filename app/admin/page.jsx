'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/Admin/AdminSidebar';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (!loading && user && user.role !== 'admin' && user.role !== 'owner') {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  if (user.role !== 'admin' && user.role !== 'owner') return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar role={user.role} />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
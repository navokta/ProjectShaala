'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import Header from '@/components/Header';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div>Loading...</div>;

  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    router.push('/');
    return null;
  }

  return (
    <>
      <Header isDashboard={true} />
      <div className="flex">
        <AdminSidebar role={user.role} />
        <main className="flex-1 ml-64 pt-20 p-8 bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </>
  );
}
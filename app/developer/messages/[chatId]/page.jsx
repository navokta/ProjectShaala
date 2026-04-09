'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DeveloperHeader from '@/components/DevDashboard/DeveloperHeader';
import DeveloperSidebar from '@/components/DevDashboard/DeveloperSidebar';
import Footer from '@/components/Footer';
import ChatRoom from '@/components/Messages/ChatRoom';
import { use } from 'react';

export default function DeveloperMessageRoomPage({ params }) {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const resolvedParams = use(params);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex font-inter text-gray-900">
        <DeveloperSidebar developer={user} onLogout={logout} />
        <div className="flex-1 lg:ml-0 flex flex-col">
          <DeveloperHeader developer={user} />
          <main className="max-w-5xl mx-auto w-full px-6 sm:px-10 py-10 flex-1">
             <ChatRoom user={user} chatId={resolvedParams.chatId} />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

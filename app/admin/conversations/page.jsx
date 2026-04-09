'use client';

import ConversationsList from '@/components/Admin/ConversationsList';

export default function AdminConversationsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 font-poppins">Message Monitoring</h1>
        <p className="text-gray-500 mt-1">Monitor platform-wide communications and restrict abusive chats.</p>
      </div>
      <ConversationsList />
    </div>
  );
}

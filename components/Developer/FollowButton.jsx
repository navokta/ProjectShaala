'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function FollowButton({ username, initialFollowing }) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleFollow = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/developer/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, action: following ? 'unfollow' : 'follow' }),
      });
      if (res.ok) setFollowing(!following);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
        following
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-gray-900 text-white hover:bg-gray-800'
      }`}
    >
      {loading ? '...' : following ? 'Unfollow' : 'Follow'}
    </button>
  );
}
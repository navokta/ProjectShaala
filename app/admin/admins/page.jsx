// \app\admin\admins\page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ManageAdminsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  // Redirect if not owner
  useEffect(() => {
    if (!loading && (!user || user.role !== 'owner')) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  // Fetch list of admins only when user is owner
  useEffect(() => {
    if (user?.role === 'owner') {
      fetchAdmins();
    }
  }, [user]);

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    setError('');
    try {
      const res = await fetch('/api/admin/manage-admins');
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Failed to load admins: ${err.message}`);
    } finally {
      setLoadingAdmins(false);
    }
  };

  const searchUser = async () => {
    if (!searchEmail) return;
    setError('');
    setSearchResult(null);
    try {
      const res = await fetch(`/api/admin/users?email=${encodeURIComponent(searchEmail)}`);
      if (res.status === 404) {
        setError('User not found');
        return;
      }
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      setError('Error searching user');
    }
  };

  const addAdmin = async (userId) => {
    try {
      const res = await fetch('/api/admin/manage-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Failed to add admin');
      fetchAdmins();
      setSearchResult(null);
      setSearchEmail('');
    } catch (err) {
      setError('Could not add admin');
    }
  };

  const removeAdmin = async (userId) => {
    if (!confirm('Remove admin privileges?')) return;
    try {
      const res = await fetch('/api/admin/manage-admins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Failed to remove');
      fetchAdmins();
    } catch (err) {
      setError('Could not remove admin');
    }
  };

  // Wait for auth to load, then redirect if needed
  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return null;
  if (user.role !== 'owner') return null;

  return (
    <div className="max-w-4xl mx-auto p-6 text-black bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Admins</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="mb-8 bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Add New Admin</h2>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="User email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-400"
          />
          <button
            onClick={searchUser}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Search
          </button>
        </div>
        {searchResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p><strong>Name:</strong> {searchResult.name}</p>
            <p><strong>Email:</strong> {searchResult.email}</p>
            <p><strong>Username:</strong> {searchResult.username}</p>
            <p><strong>Current Role:</strong> {searchResult.role}</p>
            {searchResult.role === 'admin' ? (
              <p className="text-yellow-600">Already an admin</p>
            ) : searchResult.role === 'owner' ? (
              <p className="text-red-600">Cannot change owner</p>
            ) : (
              <button
                onClick={() => addAdmin(searchResult._id)}
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Make Admin
              </button>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Current Admins</h2>
        {loadingAdmins ? (
          <p>Loading...</p>
        ) : admins.length === 0 ? (
          <p>No admins found.</p>
        ) : (
          <div className="space-y-3">
            {admins.map((admin) => (
              <div key={admin._id} className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium">{admin.name}</p>
                  <p className="text-sm text-gray-500">{admin.email} • @{admin.username}</p>
                  <p className="text-xs text-gray-400">Since {new Date(admin.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => removeAdmin(admin._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
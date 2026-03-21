'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ManageAdminsPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const res = await fetch('/api/admin/manage-admins');
    const data = await res.json();
    setAdmins(data);
  };

  const searchUser = async () => {
    if (!searchEmail) return;
    setLoading(true);
    const res = await fetch(`/api/admin/users?email=${encodeURIComponent(searchEmail)}`);
    const data = await res.json();
    setSearchResult(data);
    setLoading(false);
  };

  const addAdmin = async (userId) => {
    const res = await fetch('/api/admin/manage-admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      fetchAdmins();
      setSearchResult(null);
      setSearchEmail('');
    } else {
      alert('Failed to add admin');
    }
  };

  const removeAdmin = async (userId) => {
    if (!confirm('Remove admin privileges?')) return;
    const res = await fetch('/api/admin/manage-admins', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      fetchAdmins();
    } else {
      alert('Failed to remove admin');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Admins</h1>

      <div className="mb-8 bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-3">Add New Admin</h2>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="User email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <button
            onClick={searchUser}
            className="px-4 py-2 bg-gray-900 text-white rounded-md"
          >
            Search
          </button>
        </div>
        {loading && <p>Searching...</p>}
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
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
              >
                Make Admin
              </button>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Current Admins</h2>
        {admins.length === 0 ? (
          <p>No admins found.</p>
        ) : (
          <div className="space-y-3">
            {admins.map((admin) => (
              <div key={admin._id} className="bg-white p-4 rounded-lg border flex justify-between items-center">
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
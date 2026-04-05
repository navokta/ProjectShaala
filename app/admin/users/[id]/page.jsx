// \app\admin\users\[id]\page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminUserDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch user');
      
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (e) => {
    const newRole = e.target.value;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update role');
      
      fetchUser();
      alert('Role updated successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete user');
      }
      
      router.push('/admin/users');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-black bg-white">Loading user details...</div>;
  if (error) return <div className="p-8 text-red-600 bg-white">Error: {error}</div>;
  if (!user) return <div className="p-8 text-black bg-white">User not found</div>;

  return (
    <div className='text-black bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-8'>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
        <Link href="/admin/users" className="text-blue-600 hover:text-blue-800 transition">
          &larr; Back to Users
        </Link>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase mb-1">Name</p>
            <p className="text-lg font-medium text-gray-900">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase mb-1">Email</p>
            <p className="text-lg font-medium text-gray-900">{user.email}</p>
            <p className="text-xs text-green-600 mt-1">Verified: {user.emailVerified ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase mb-1">Username</p>
            <p className="text-lg font-medium text-gray-900">@{user.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase mb-1">Joined Date</p>
            <p className="text-lg font-medium text-gray-900">{new Date(user.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Role Management</h2>
        <div className="flex items-center gap-4">
          <label className="font-semibold text-gray-700">Current Role:</label>
          <select 
            value={user.role} 
            onChange={handleRoleChange}
            disabled={user.role === 'owner'}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="buyer">Buyer</option>
            <option value="developer">Developer</option>
            <option value="admin">Admin</option>
            <option value="owner" disabled>Owner</option>
          </select>
          {user.role === 'owner' && <span className="text-red-500 text-sm">Cannot change role of owners.</span>}
        </div>
      </div>

      {(user.headline || user.bio || user.skills?.length > 0) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Profile Information</h2>
          {user.headline && <p className="mb-2"><strong>Headline:</strong> {user.headline}</p>}
          {user.bio && <p className="mb-2"><strong>Bio:</strong> {user.bio}</p>}
          {user.skills && user.skills.length > 0 && <p className="mb-2"><strong>Skills:</strong> {user.skills.join(', ')}</p>}
        </div>
      )}

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
        <h2 className="text-xl font-bold text-red-700 mb-2">Danger Zone</h2>
        <p className="text-sm text-red-600 mb-4">Deleting a user will permanently remove them from the system. This cannot be undone.</p>
        <button 
          onClick={handleDelete}
          disabled={user.role === 'owner'}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
        >
          Delete User
        </button>
      </div>

    </div>
  );
}

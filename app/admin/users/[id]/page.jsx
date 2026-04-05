'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminUserDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { credentials: 'include' });
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
    if (currentUser?.role !== 'owner' && newRole === 'admin') {
      alert('Only owners can assign admin role');
      return;
    }
    if (user.role === 'owner' && currentUser?.role !== 'owner') {
      alert('You cannot change the owner role');
      return;
    }
    try {
      setUpdating(true);
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update role');
      fetchUser();
      alert('Role updated successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    if (user.role === 'owner') {
      alert('Cannot delete the owner');
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
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

  if (loading) return <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error: {error}</div>;
  if (!user) return <div className="text-gray-500">User not found</div>;

  return (
    <div className="max-w-4xl text-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
        <Link href="/admin/users" className="text-blue-600 hover:text-blue-800 transition">
          &larr; Back to Users
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
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
        <div className="flex items-center gap-4 flex-wrap">
          <label className="font-semibold text-gray-700">Current Role:</label>
          <select
            value={user.role}
            onChange={handleRoleChange}
            disabled={updating || (user.role === 'owner' && currentUser?.role !== 'owner')}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
          >
            <option value="buyer">Buyer</option>
            <option value="developer">Developer</option>
            {currentUser?.role === 'owner' && <option value="admin">Admin</option>}
            {user.role === 'owner' && <option value="owner" disabled>Owner</option>}
          </select>
          {user.role === 'owner' && currentUser?.role !== 'owner' && (
            <span className="text-red-500 text-sm">Cannot change role of owner.</span>
          )}
          {updating && <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />}
        </div>
      </div>

      {(user.headline || user.bio || (user.skills?.length > 0) || user.location) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Profile Information</h2>
          {user.headline && <p className="mb-2"><strong>Headline:</strong> {user.headline}</p>}
          {user.bio && <p className="mb-2"><strong>Bio:</strong> {user.bio}</p>}
          {user.location && <p className="mb-2"><strong>Location:</strong> {user.location}</p>}
          {user.skills && user.skills.length > 0 && <p className="mb-2"><strong>Skills:</strong> {user.skills.join(', ')}</p>}
        </div>
      )}

      {user.role !== 'owner' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-red-700 mb-2">Danger Zone</h2>
          <p className="text-sm text-red-600 mb-4">Deleting a user will permanently remove them from the system. This cannot be undone.</p>
          <button
            onClick={handleDelete}
            disabled={updating}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            Delete User
          </button>
        </div>
      )}
    </div>
  );
}
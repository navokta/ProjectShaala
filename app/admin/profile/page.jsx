'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    avatar: '',
    title: '',
    location: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'owner')) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/profile', { credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          username: data.username || '',
          phone: data.phone || '',
          avatar: data.avatar || '',
          title: data.title || '',
          location: data.location || '',
          bio: data.bio || '',
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to load profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Update failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    setUpdatingPassword(true);
    setPasswordMessage(null);
    try {
      const res = await fetch('/api/admin/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch (err) {
      setPasswordMessage({ type: 'error', text: 'Network error' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'owner')) return null;

  return (
    <div className="max-w-3xl mx-auto text-gray-900">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-poppins text-gray-900">Admin Profile</h1>
        <p className="text-gray-500 mt-1">View and edit your profile information</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title / Role</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Platform Administrator" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
          <input type="url" name="avatar" value={formData.avatar} onChange={handleChange} placeholder="https://example.com/avatar.jpg" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
          {formData.avatar && <img src={formData.avatar} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover border" />}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" placeholder="Tell something about yourself..." className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg resize-none" />
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Password Change Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
        {passwordMessage && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {passwordMessage.text}
          </div>
        )}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={updatingPassword} className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">
              {updatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
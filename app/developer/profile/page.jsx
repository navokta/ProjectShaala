'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import DeveloperSidebar from '@/components/DevDashboard/DeveloperSidebar';

export default function EditProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    location: '',
    hourlyRate: 0,
    availability: true,
    bio: '',
    skills: [],
    social: { github: '', linkedin: '', twitter: '', website: '' },
    portfolio: [],
    privacySettings: {
      name: true,
      avatar: true,
      title: true,
      location: true,
      hourlyRate: true,
      availability: true,
      bio: true,
      skills: true,
      portfolio: true,
      social: true,
      stats: true,
    },
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'developer')) {
      router.push('/');
      return;
    }
    if (user) {
      // Fetch current profile
      const fetchProfile = async () => {
        const res = await fetch('/api/developer/profile');
        const data = await res.json();
        setFormData({
          name: data.name || '',
          title: data.title || '',
          location: data.location || '',
          hourlyRate: data.hourlyRate || 0,
          availability: data.availability !== undefined ? data.availability : true,
          bio: data.bio || '',
          skills: data.skills || [],
          social: data.social || { github: '', linkedin: '', twitter: '', website: '' },
          portfolio: data.portfolio || [],
          privacySettings: data.privacySettings || formData.privacySettings,
        });
      };
      fetchProfile();
    }
  }, [user, loading]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      social: { ...prev.social, [name]: value },
    }));
  };

  const handlePrivacyToggle = (field) => {
    setFormData(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [field]: !prev.privacySettings[field],
      },
    }));
  };

  const handleSkillAdd = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };
  const handleSkillRemove = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/developer/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Update failed');
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'developer') return null;

  return (
    <div className="min-h-screen bg-gray-50 flex text-black">
      <DeveloperSidebar developer={user} stats={{}} onLogout={() => {}} />
      <div className="flex-1">
        <main className="max-w-4xl mx-auto py-10 px-6">
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title (e.g., Full-stack Developer)</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="availability"
                    checked={formData.availability}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <label className="text-sm">Available for work</label>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills.map(skill => (
                  <span key={skill} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {skill}
                    <button type="button" onClick={() => handleSkillRemove(skill)} className="text-red-500">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g., React)"
                  id="newSkill"
                  className="flex-1 border rounded-md px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('newSkill');
                    if (input.value.trim()) {
                      handleSkillAdd(input.value.trim());
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-gray-900 text-white rounded-md"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Social Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">GitHub</label>
                  <input
                    type="url"
                    name="github"
                    value={formData.social.github}
                    onChange={handleSocialChange}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.social.linkedin}
                    onChange={handleSocialChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Twitter</label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.social.twitter}
                    onChange={handleSocialChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.social.website}
                    onChange={handleSocialChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Portfolio */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Portfolio Items</h2>
              <p className="text-sm text-gray-500 mb-2">(Simple list; edit/delete not implemented here)</p>
              {formData.portfolio.map((item, idx) => (
                <div key={idx} className="border p-3 rounded mb-2">
                  <p><strong>{item.title}</strong></p>
                  {item.description && <p>{item.description}</p>}
                  {item.link && <a href={item.link} className="text-blue-500">View</a>}
                </div>
              ))}
              {/* Add portfolio form would go here (with image upload) */}
            </div>

            {/* Privacy Settings */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Privacy Settings (Who can see what)</h2>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(formData.privacySettings).map(field => (
                  <label key={field} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.privacySettings[field]}
                      onChange={() => handlePrivacyToggle(field)}
                    />
                    <span className="text-sm capitalize">{field}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            {message && <p className="text-center text-sm text-green-600">{message}</p>}
          </form>
        </main>
        <Footer />
      </div>
    </div>
  );
}
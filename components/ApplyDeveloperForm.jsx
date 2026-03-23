'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const ApplyDeveloperForm = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    githubProfile: '',
    portfolioLink: '',
    topProjects: [''],
    skills: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleProjectChange = (index, value) => {
    const newProjects = [...formData.topProjects];
    newProjects[index] = value;
    setFormData({ ...formData, topProjects: newProjects });
  };

  const addProject = () => {
    setFormData({ ...formData, topProjects: [...formData.topProjects, ''] });
  };

  const removeProject = (index) => {
    const newProjects = formData.topProjects.filter((_, i) => i !== index);
    setFormData({ ...formData, topProjects: newProjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Check if user has phone number
  if (!user.phone) {
    setError('You must add your phone number to your profile before applying to become a developer. Please go to your profile settings and add your phone number.');
    return;
  }

    // Filter out empty project URLs
    const projects = formData.topProjects.filter(p => p.trim() !== '');

    if (projects.length === 0) {
      setError('Please provide at least one project link');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/users/apply-developer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubProfile: formData.githubProfile,
          portfolioLink: formData.portfolioLink,
          topProjects: projects,
          skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
          bio: formData.bio,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('Application submitted! An admin will review it soon.');
      setTimeout(() => router.push('/dashboard'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'buyer') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Only buyers can apply to become a developer.</p>
        <p className="text-gray-500 mt-2">Please sign up as a buyer first.</p>
      </div>
    );
  }

  if (user.developerApplication?.status === 'pending') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Your application is pending review. We'll notify you once it's processed.</p>
      </div>
    );
  }

  if (user.role === 'developer') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">You are already a developer! Access your developer dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-black">
      <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-2">Apply to Become a Developer</h1>
      <p className="text-gray-600 mb-6">Showcase your skills and portfolio to start earning on ProjectShaala.</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700 mb-1">GitHub Profile URL *</label>
          <input
            type="url"
            value={formData.githubProfile}
            onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Portfolio Website URL *</label>
          <input
            type="url"
            value={formData.portfolioLink}
            onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Top Projects (Links) *</label>
          {formData.topProjects.map((project, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="url"
                value={project}
                onChange={(e) => handleProjectChange(idx, e.target.value)}
                placeholder="https://github.com/username/project"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              {formData.topProjects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addProject}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            + Add another project
          </button>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Skills (comma separated)</label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="React, Node.js, Python, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Short Bio</label>
          <textarea
            rows="3"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about your experience and what you love building..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplyDeveloperForm;
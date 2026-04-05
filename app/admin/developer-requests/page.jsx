'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/admin/developer-applications', {
        credentials: 'include',
      });
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    setProcessingId(userId);
    try {
      const res = await fetch('/api/admin/developer-applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
        credentials: 'include',
      });
      if (res.ok) {
        fetchApplications();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to process');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Developer Applications</h1>
      {applications.length === 0 ? (
        <p className="text-gray-500">No pending applications.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{app.name}</h3>
                  <p className="text-gray-500">@{app.username}</p>
                  <p className="text-gray-600 mt-2">{app.email}</p>
                  {app.phone && <p className="text-gray-600">{app.phone}</p>}
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">GitHub:</span> <a href={app.developerApplication.githubProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{app.developerApplication.githubProfile}</a></p>
                    <p><span className="font-medium">Portfolio:</span> <a href={app.developerApplication.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{app.developerApplication.portfolioLink}</a></p>
                    <p><span className="font-medium">Projects:</span></p>
                    <ul className="list-disc list-inside pl-4">
                      {app.developerApplication.topProjects?.map((p, i) => (
                        <li key={i}><a href={p} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{p}</a></li>
                      ))}
                    </ul>
                    {app.developerApplication.skills?.length > 0 && (
                      <p><span className="font-medium">Skills:</span> {app.developerApplication.skills.join(', ')}</p>
                    )}
                    {app.developerApplication.bio && (
                      <p><span className="font-medium">Bio:</span> {app.developerApplication.bio}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleAction(app._id, 'approve')}
                    disabled={processingId === app._id}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(app._id, 'reject')}
                    disabled={processingId === app._id}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">Submitted: {new Date(app.developerApplication.submittedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
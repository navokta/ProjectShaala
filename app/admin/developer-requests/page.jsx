// \app\admin\developer-requests\page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const res = await fetch('/api/admin/developer-applications');
    const data = await res.json();
    setApplications(data);
    setLoading(false);
  };

  const handleAction = async (userId, action) => {
    const res = await fetch('/api/admin/developer-applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action }),
    });
    if (res.ok) {
      fetchApplications(); // refresh list
    } else {
      alert('Failed to process');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='text-black bg-white'>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Developer Applications</h1>
      {applications.length === 0 ? (
        <p className="text-gray-500">No pending applications.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{app.name}</h3>
                  <p className="text-gray-500">@{app.username}</p>
                  <p className="text-gray-600 mt-2">{app.email}</p>
                  <p className="text-gray-600">{app.phone}</p>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">GitHub:</span> <a href={app.developerApplication.githubProfile} target="_blank" className="text-blue-600 hover:underline">{app.developerApplication.githubProfile}</a></p>
                    <p><span className="font-medium">Portfolio:</span> <a href={app.developerApplication.portfolioLink} target="_blank" className="text-blue-600 hover:underline">{app.developerApplication.portfolioLink}</a></p>
                    <p><span className="font-medium">Projects:</span></p>
                    <ul className="list-disc list-inside pl-4">
                      {app.developerApplication.topProjects?.map((p, i) => (
                        <li key={i}><a href={p} target="_blank" className="text-blue-600 hover:underline">{p}</a></li>
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
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAction(app._id, 'approve')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(app._id, 'reject')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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
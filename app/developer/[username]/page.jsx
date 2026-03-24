'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FollowButton from '@/components/Developer/FollowButton';
import { useAuth } from '@/context/AuthContext';
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe } from 'react-icons/fa';

export default function DeveloperPublicProfile() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/developer/${username}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchProfile();
  }, [username]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!profile) return <div className="text-center py-12">Developer not found</div>;

  const socialLinks = profile.social || {};
  const hasSocial = Object.values(socialLinks).some(v => v);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10 text-black">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex items-center gap-4">
              <img
                src={profile.avatar || 'https://placehold.co/100/111827/ffffff?text=U'}
                alt={profile.name || 'Developer'}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h1 className="text-2xl font-bold">{profile.name || 'Anonymous'}</h1>
                {profile.title && <p className="text-gray-600">{profile.title}</p>}
                {profile.location && <p className="text-sm text-gray-500">{profile.location}</p>}
                {profile.hourlyRate && <p className="text-sm font-semibold">₹{profile.hourlyRate}/hr</p>}
              </div>
            </div>
            {currentUser && currentUser.username !== profile.username && (
              <FollowButton username={profile.username} initialFollowing={profile.isFollowing} />
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="text-gray-700 mt-1 whitespace-pre-line">{profile.bio}</p>
            </div>
          )}

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Skills</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio */}
          {profile.portfolio?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {profile.portfolio.map((item, i) => (
                  <div key={i} className="border rounded-lg p-3 hover:shadow-sm transition">
                    {item.image && <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded-md mb-2" />}
                    <h3 className="font-medium">{item.title}</h3>
                    {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm inline-flex items-center gap-1 mt-2">
                        View Project →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {hasSocial && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Connect</h2>
              <div className="flex flex-wrap gap-3 mt-2">
                {socialLinks.github && (
                  <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                    <FaGithub className="w-5 h-5" /> GitHub
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                    <FaLinkedin className="w-5 h-5" /> LinkedIn
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                    <FaTwitter className="w-5 h-5" /> Twitter
                  </a>
                )}
                {socialLinks.website && (
                  <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                    <FaGlobe className="w-5 h-5" /> Website
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          {profile.stats && (
            <div className="mt-6 grid grid-cols-3 gap-4 text-center border-t pt-6">
              <div>
                <span className="block text-2xl font-bold">{profile.stats.completedProjects}</span>
                <span className="text-sm text-gray-500">Projects</span>
              </div>
              <div>
                <span className="block text-2xl font-bold">₹{profile.stats.totalEarnings}</span>
                <span className="text-sm text-gray-500">Earned</span>
              </div>
              <div>
                <span className="block text-2xl font-bold">{profile.stats.profileViews}</span>
                <span className="text-sm text-gray-500">Views</span>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
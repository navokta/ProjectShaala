// components/Home/TrendingProjectsWrapper.jsx
'use server';

import TrendingProjectsClient from './TrendingProjectsClient';

async function getTrendingProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects?sort=downloads`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Fetch error:', await res.text());
      return [];
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch trending projects:', error);
    return [];
  }
}

export default async function TrendingProjectsWrapper() {
  const projects = await getTrendingProjects();

  return <TrendingProjectsClient projects={projects} />;
}
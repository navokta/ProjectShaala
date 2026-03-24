"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState({ projects: [], messages: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }
    const fetchResults = async () => {
      const res = await fetch(`/api/developer/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
      setLoading(false);
    };
    fetchResults();
  }, [q]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Search results for "{q}"</h1>
      <div>
        <h2 className="text-xl font-semibold mt-6">Projects</h2>
        {results.projects.length === 0 ? <p>No projects found.</p> : (
          <ul className="space-y-4 mt-2">
            {results.projects.map(p => (
              <li key={p._id} className="border p-4 rounded-lg">
                <Link href={`/projects/${p._id}`} className="text-blue-600 hover:underline font-medium">
                  {p.title}
                </Link>
                <p className="text-sm text-gray-600">{p.description}</p>
                <p className="text-sm text-gray-500">Budget: ₹{p.budget}</p>
              </li>
            ))}
          </ul>
        )}
        <h2 className="text-xl font-semibold mt-6">Messages</h2>
        {results.messages.length === 0 ? <p>No messages found.</p> : (
          <ul className="space-y-4 mt-2">
            {results.messages.map(m => (
              <li key={m._id} className="border p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <img src={m.sender?.avatar} className="w-8 h-8 rounded-full" />
                  <span className="font-medium">{m.sender?.name}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{m.content}</p>
                <Link href={`/messages?thread=${m._id}`} className="text-xs text-blue-500">View conversation</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
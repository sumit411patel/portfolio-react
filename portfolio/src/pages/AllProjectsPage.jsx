import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, FolderGit2 } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { API_URL } from '../config/api';

export default function AllProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
    window.scrollTo(0, 0);
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Failed to fetch projects from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(term);
    const descMatch = p.description.toLowerCase().includes(term);
    const toolsMatch = Array.isArray(p.tools)
      ? p.tools.some((t) => t.toLowerCase().includes(term))
      : false;
    return nameMatch || descMatch || toolsMatch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-zinc-900 dark:text-white tracking-tight">
              All Projects <span className="text-accent text-2xl">({filteredProjects.length})</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-xl">
              A complete show-case of full-stack web applications, web design systems, REST APIs, and software built by Sumit Patel.
            </p>
          </div>

          {/* Search box */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by tech or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
            <FolderGit2 className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-xl text-zinc-700 dark:text-zinc-300">No projects found</h3>
            <p className="text-zinc-500 text-sm mt-1">Try clearing your search keyword.</p>
          </div>
        )}
      </div>
    </div>
  );
}

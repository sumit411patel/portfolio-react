import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from './ProjectCard';

export default function WorkSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopProjects();
  }, []);

  const fetchTopProjects = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Failed to fetch projects for index page:', err);
    } finally {
      setLoading(false);
    }
  };

  // Only take 3 projects for index page
  const indexProjects = projects.slice(0, 3);

  return (
    <section id="work" className="py-24 bg-zinc-50 dark:bg-zinc-900/40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <p className="reveal text-xs font-medium text-accent tracking-widest uppercase mb-3">Portfolio</p>
            <h2 className="reveal d1 font-display font-bold text-4xl md:text-5xl text-zinc-900 dark:text-white">
              Selected work
            </h2>
          </div>

          {/* All projects link targeting /projects */}
          <Link
            to="/projects"
            className="reveal d1 text-sm font-semibold text-accent hover:text-accent-light transition-colors self-start sm:self-auto flex items-center gap-1 group"
          >
            All projects
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-zinc-200 dark:bg-zinc-800/60 rounded-2xl" />
            ))}
          </div>
        ) : indexProjects.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {indexProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500">
            No projects available yet.
          </div>
        )}
      </div>
    </section>
  );
}

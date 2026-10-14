import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { API_URL } from '../config/api';

export default function WorkSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopProjects();
  }, []);

  const fetchTopProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects`);
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
        <div className="mb-14">
          <p className="reveal text-xs font-medium text-accent tracking-widest uppercase mb-3">Portfolio</p>
          <h2 className="reveal d1 font-display font-bold text-4xl md:text-5xl text-zinc-900 dark:text-white">
            Selected work
          </h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-zinc-200 dark:bg-zinc-800/60 rounded-2xl" />
            ))}
          </div>
        ) : indexProjects.length > 0 ? (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              {indexProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Bottom Bubble Button: All projects */}
            <div className="mt-14 flex justify-center">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-accent hover:bg-accent-light text-white font-medium text-sm sm:text-base shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shimmer"
              >
                <span>All projects</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-white/30 transition-all duration-300">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </span>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-zinc-500">
            No projects available yet.
          </div>
        )}
      </div>
    </section>
  );
}

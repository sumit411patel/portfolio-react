import React from 'react';
import { ExternalLink, Code2 } from 'lucide-react';
import { API_URL } from '../config/api';

export default function ProjectCard({ project }) {
  // Ensure image URL correctly resolves to backend host if relative
  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${API_URL}${url}`;
  };

  const toolsList = Array.isArray(project.tools)
    ? project.tools
    : typeof project.tools === 'string'
    ? JSON.parse(project.tools || '[]')
    : [];

  return (
    <article className="card-h group rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-accent flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl">
      <div>
        {/* 1. Project Image */}
        <div className="pf w-full h-52 sm:h-60 overflow-hidden relative">
          <img
            src={getImageUrl(project.image)}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-6">
          {/* 2. Tools & Technologies Pills */}
          {toolsList.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {toolsList.map((tool, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                    idx === 0
                      ? 'bg-accent/10 text-accent border border-accent/20'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60'
                  }`}
                >
                  {tool}
                </span>
              ))}
            </div>
          )}

          {/* 3. Project Name in Strong Bold Font */}
          <h3 className="font-display font-extrabold text-xl md:text-2xl text-zinc-900 dark:text-white mb-2.5 group-hover:text-accent transition-colors tracking-tight leading-snug">
            {project.name}
          </h3>

          {/* 4. Description of Project */}
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3 mb-5">
            {project.description}
          </p>
        </div>
      </div>

      {/* 5. GitHub and Live Link Buttons at Bottom */}
      <div className="px-6 pb-6 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-3">
        {project.githubLink ? (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white hover:bg-accent transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub Code
          </a>
        ) : null}

        {project.liveLink ? (
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-accent text-white hover:bg-accent/90 transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live Preview
          </a>
        ) : null}

        {!project.githubLink && !project.liveLink && (
          <span className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-accent" /> Internal Project
          </span>
        )}
      </div>
    </article>
  );
}

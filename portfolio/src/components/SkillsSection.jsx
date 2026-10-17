import React from 'react';

export default function SkillsSection() {
  const leftCategoryGroups = [
    {
      title: 'Core Languages',
      subgroups: [
        { label: 'PROFICIENT', skills: ['Python', 'Javascript', 'C#'], type: 'proficient' },
      ],
    },
    {
      title: 'Frontend',
      subgroups: [
        { skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'Bootstrap CSS'], type: 'proficient' },
      ],
    },
    {
      title: 'Database',
      subgroups: [
        { skills: ['MongoDB', 'PostgreSQL', 'SQLite', 'MySQL'], type: 'proficient' },
      ],
    },
    {
      title: 'Version Control & DevOps',
      subgroups: [
        { skills: ['Git', 'GitHub', 'Docker'], type: 'proficient' },
      ],
    },
  ];

  const rightCategoryGroups = [
    {
      title: 'Backend',
      subgroups: [
        { skills: ['Django', 'Express.js', 'Node.js', '.NET'], type: 'proficient' },
      ],
    },
    {
      title: 'Cloud & Deployment',
      subgroups: [
        { skills: ['Render', 'Netlify', 'Vercel', 'Hostinger'], type: 'proficient' },
      ],
    },
    {
      title: 'Tools',
      subgroups: [
        {
          skills: ['VS Code', 'Jupyter Notebook', 'Postman', 'Pycham'],
          type: 'proficient',
        },
      ],
    },
  ];

  const renderCategoryCard = (category, index) => (
    <div key={index} className="space-y-3 pb-6 border-b border-zinc-200/60 dark:border-zinc-800/80 last:border-b-0">
      <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white tracking-tight">
        {category.title}
      </h3>
      {category.subgroups.map((group, gIdx) => (
        <div key={gIdx} className="space-y-2">
          {group.label && (
            <p className={`text-[11px] font-bold tracking-widest uppercase ${
              group.type === 'learning' ? 'text-rose-500 dark:text-rose-400' : 'text-zinc-400 dark:text-zinc-500'
            }`}>
              {group.label}
            </p>
          )}
          <div className="flex flex-wrap gap-2.5">
            {group.skills.map((skill, sIdx) => {
              const isLearning = group.type === 'learning';
              return (
                <span
                  key={sIdx}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isLearning
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/40 hover:border-rose-500 shadow-sm'
                      : 'bg-zinc-100 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/60 hover:border-accent hover:text-accent dark:hover:text-accent hover:shadow-md'
                  }`}
                >
                  {skill}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section id="skills" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="reveal text-xs font-medium text-accent tracking-widest uppercase mb-3">Expertise</p>
          <h2 className="reveal d1 font-display font-bold text-4xl md:text-5xl text-zinc-900 dark:text-white mb-4">
            Skills
          </h2>
          <p className="reveal d2 text-zinc-600 dark:text-zinc-400 text-base md:text-lg max-w-3xl leading-relaxed">
            Proficient in building responsive, scalable full-stack web applications using modern technologies. My core expertise spans <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Django, React.js, Node.js, and Express.js</strong>, backed by solid knowledge of relational and non-relational databases. I'm continuously expanding my toolkit — from cloud deployment to API integration — with a focus on clean code, performance, and real-world problem solving.
          </p>
        </div>

        <div className="reveal d3 grid md:grid-cols-2 gap-12 lg:gap-16 items-start bg-zinc-50 dark:bg-zinc-900/60 p-8 md:p-12 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
          {/* Left Column */}
          <div className="space-y-8">
            {leftCategoryGroups.map((cat, idx) => renderCategoryCard(cat, idx))}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {rightCategoryGroups.map((cat, idx) => renderCategoryCard(cat, idx))}
          </div>
        </div>
      </div>
    </section>
  );
}

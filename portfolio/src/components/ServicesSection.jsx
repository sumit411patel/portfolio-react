import React from 'react';
import { Globe, ServerIcon, Monitor } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      icon: <Globe className="w-6 h-6 text-accent" />,
      title: 'Full Stack Web Development',
      description:
        'End-to-end web application development using Django, React.js, Node.js, and Express.js. I build scalable, production-ready apps with clean architecture — from user authentication and database design to deployment and API integration.',
      highlight: false,
      delay: 'd1',
    },
    {
      icon: <ServerIcon className="w-6 h-6 text-accent" />,
      title: 'Backend & API Development',
      description:
        'Robust server-side development using Django and Node.js/Express.js. I design RESTful APIs, handle complex business logic, and structure efficient databases using MySQL, PostgreSQL, and MongoDB — tested and documented with Postman.',
      highlight: true,
      delay: 'd2',
    },
    {
      icon: <Monitor className="w-6 h-6 text-accent" />,
      title: 'Frontend & UI Development',
      description:
        'Responsive, pixel-perfect frontend interfaces built with React.js, Tailwind CSS, and Bootstrap. I focus on fast load times, cross-browser compatibility, and intuitive UX — bringing designs to life with clean, maintainable code.',
      highlight: false,
      delay: 'd3',
    },
  ];

  return (
    <section id="services" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <p className="reveal text-xs font-medium text-accent tracking-widest uppercase mb-3">What I do</p>
          <h2 className="reveal d1 font-display font-bold text-4xl md:text-5xl text-zinc-900 dark:text-white">
            Services
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((item, idx) => (
            <article
              key={idx}
              className={`reveal ${item.delay} card-h group rounded-2xl p-8 border ${
                item.highlight
                  ? 'bg-zinc-900 dark:bg-zinc-800 border-zinc-800 text-white hover:border-accent'
                  : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-accent'
              }`}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl mb-6 transition-colors ${
                  item.highlight
                    ? 'bg-zinc-800 dark:bg-zinc-700 group-hover:bg-accent/20'
                    : 'bg-orange-50 dark:bg-zinc-800 group-hover:bg-accent/10'
                }`}
              >
                {item.icon}
              </div>
              <h3
                className={`font-display font-bold text-xl mb-3 ${
                  item.highlight ? 'text-white' : 'text-zinc-900 dark:text-white'
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  item.highlight ? 'text-zinc-400' : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-zinc-200/50 dark:bg-zinc-800/30 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div>
            <p className="reveal text-sm font-medium text-accent tracking-widest uppercase mb-4">Available for work</p>
            <h1 className="reveal d1 font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-zinc-900 dark:text-white mb-6">
              Hi, I'm <span className="text-accent">Sumit</span>
            </h1>
            <p className="reveal d2 text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-light leading-relaxed max-w-md mb-10">
              Freelance <strong className="font-medium text-zinc-700 dark:text-zinc-300">Web Development &amp; Fullstack Developer</strong>. I build web applications that people love to use — fast, reliable, and accessible.
            </p>
            <div className="reveal d3 flex flex-wrap gap-4">
              <a href="#work" className="shimmer inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium px-7 py-3.5 rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors text-sm">
                View my work
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium px-7 py-3.5 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm">
                Get in touch
              </a>
            </div>
          </div>

          <div className="reveal d2 flex justify-center md:justify-end">
            {/* Target Container for Animated Profile Image */}
            <div id="hero-img-target" className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 mx-auto md:mx-0">
              <div className="w-full h-full rounded-3xl border-2 border-dashed border-accent/20 dark:border-zinc-800/80 bg-zinc-100/30 dark:bg-zinc-900/30 flex items-center justify-center">
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">Sumit Patel</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

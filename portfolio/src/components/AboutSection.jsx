import React from 'react';

export default function AboutSection() {

  return (
    <section id="about" className="py-24 bg-zinc-50 dark:bg-zinc-900/40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div className="reveal order-1 md:order-1 flex justify-center md:justify-start mb-8 md:mb-0">
            {/* Target Container for Animated Profile Image */}
            <div id="about-img-target" className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-3xl relative mx-auto md:mx-0">
              <div className="w-full h-full rounded-3xl border-2 border-dashed border-accent/20 dark:border-zinc-800/80 bg-zinc-100/30 dark:bg-zinc-900/30 flex items-center justify-center">
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">About Profile</span>
              </div>
            </div>
          </div>

          <div className="order-2 md:order-2">
            <p className="reveal text-xs font-medium text-accent tracking-widest uppercase mb-3">About me</p>
            <h2 className="reveal d1 font-display font-bold text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight mb-6">
              A bit about<br />who I am
            </h2>
            <p className="reveal d2 text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
              I'm Sumit Patel, an aspiring Full Stack Web Developer, I completed <strong className="font-medium text-zinc-700 dark:text-zinc-300">Master of Computer Applications (MCA)</strong> at <strong className="font-medium text-zinc-700 dark:text-zinc-300">Gujarat Technological Univesity (GTU)</strong>, Ahmedabad, Gujarat. With hands-on experience from internships at CipherByte Technologies and CreArt Solution, I've built and deployed real-world web applications from the ground up — combining clean front-end design with robust back-end logic.
            </p>
            <p className="reveal d3 text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              I specialize in building responsive, scalable web applications using <strong className="font-medium text-zinc-700 dark:text-zinc-300">Django, React.js, Node.js, and Express.js</strong>. I've shipped projects like a full-featured e-commerce platform for Panachandbhai Farsan Mart and Town Taskers — a service marketplace connecting users with local providers. I thrive on solving real problems with clean code and a keen eye for user experience.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

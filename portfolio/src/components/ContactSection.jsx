import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', email: '', subject: '', message: '' });
        }, 6000);
      } else {
        setErrorMsg(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Inquiry submit error:', err);
      setErrorMsg('Server connection error. Please make sure backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-zinc-900 dark:bg-zinc-800 rounded-3xl p-10 md:p-16 relative overflow-hidden">
          {/* Accent glow effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true"></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-start">

            <div>
              <p className="reveal text-xs font-medium text-accent tracking-widest uppercase mb-3">Get in touch</p>
              <h2 className="reveal d1 font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">
                Let's work<br />together
              </h2>
              <p className="reveal d2 text-zinc-400 leading-relaxed mb-8">
                I'm open to full-stack web development projects, internships, and freelance opportunities — short or long-term. Whether it's building a web app from scratch, developing a REST API backend, or crafting a responsive frontend with React.js — let's connect and make it happen.
              </p>

              <div className="reveal d3 flex flex-col gap-4">
                <a
                  href="mailto:sumit411patel@gmail.com"
                  className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
                >
                  <span className="w-9 h-9 flex items-center justify-center bg-zinc-800 rounded-lg group-hover:bg-accent/20 transition-colors shrink-0">
                    <Mail className="w-4 h-4 text-zinc-300 group-hover:text-accent" />
                  </span>
                  <span className="text-sm">sumit411patel@gmail.com</span>
                </a>

                <a
                  href="https://linkedin.com/in/sumit-04-patel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
                >
                  <span className="w-9 h-9 flex items-center justify-center bg-zinc-800 rounded-lg group-hover:bg-accent/20 transition-colors shrink-0">
                    <svg className="w-4 h-4 text-zinc-300 group-hover:text-accent fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </span>
                  <span className="text-sm">linkedin.com/in/sumit-04-patel</span>
                </a>

                <a
                  href="https://github.com/sumit411patel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
                >
                  <span className="w-9 h-9 flex items-center justify-center bg-zinc-800 rounded-lg group-hover:bg-accent/20 transition-colors shrink-0">
                    <svg className="w-4 h-4 text-zinc-300 group-hover:text-accent fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </span>
                  <span className="text-sm">github.com/sumit411patel</span>
                </a>
              </div>
            </div>

            <div className="reveal d2">
              {submitted ? (
                <div className="bg-zinc-800/80 border border-zinc-700 p-8 rounded-2xl text-center flex flex-col items-center justify-center min-h-[340px]">
                  <CheckCircle2 className="w-12 h-12 text-accent mb-4 animate-bounce" />
                  <h3 className="font-display font-bold text-2xl text-white mb-2">Message Sent!</h3>
                  <p className="text-zinc-400 text-sm max-w-sm">
                    Thank you for reaching out, {formData.name || 'there'}. I'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fname" className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Name <span aria-hidden="true" className="text-accent">*</span>
                        </label>
                        <input
                          type="text"
                          id="fname"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Jane Smith"
                          required
                          autoComplete="name"
                          className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-3 placeholder-zinc-600 focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="femail" className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Email <span aria-hidden="true" className="text-accent">*</span>
                        </label>
                        <input
                          type="email"
                          id="femail"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="jane@company.com"
                          required
                          autoComplete="email"
                          className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-3 placeholder-zinc-600 focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="fsubject" className="block text-xs font-medium text-zinc-400 mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="fsubject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Project inquiry"
                        className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-3 placeholder-zinc-600 focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="fmessage" className="block text-xs font-medium text-zinc-400 mb-1.5">
                        Message <span aria-hidden="true" className="text-accent">*</span>
                      </label>
                      <textarea
                        id="fmessage"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Tell me about your project..."
                        required
                        className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-3 placeholder-zinc-600 focus:outline-none focus:border-accent transition-colors resize-none"
                      ></textarea>
                    </div>
                    {errorMsg && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-2.5 rounded-xl">
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="shimmer w-full bg-accent text-white font-display font-bold text-sm py-3.5 rounded-xl hover:bg-accent-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? 'Sending Message...' : 'Send message →'}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

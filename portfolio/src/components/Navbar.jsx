import React from 'react';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ dark, setDark, activeSection, mobileMenuOpen, setMobileMenuOpen, scrolled }) {
  const navItems = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Work', href: '#work', id: 'work' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-sm shadow-black/5' : ''
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" aria-label="Main navigation">
        <a href="#hero" className="font-display font-bold text-xl tracking-tight relative z-10">
          <span className="text-zinc-900 dark:text-white">Sum</span>
          <span className="text-accent">it</span>
        </a>

        {/* Desktop Task Bar Menu */}
        <ul className="hidden md:flex items-center gap-8 text-sm" role="list">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className={`nl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors ${
                  activeSection === item.id ? 'on !text-zinc-900 dark:!text-white' : ''
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            aria-label={dark ? 'Light mode' : 'Dark mode'}
          >
            {dark ? (
              <Sun className="w-4 h-4 text-zinc-300" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          {/* Hire Me CTA Button */}
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 shimmer bg-accent text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-accent-light transition-colors"
          >
            Hire me{' '}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 animate-fadeIn">
          <ul className="flex flex-col px-6 py-5 gap-4 text-sm font-medium" role="list">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block transition-colors ${
                    activeSection === item.id
                      ? 'text-accent font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:text-accent'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2 border-t border-zinc-100 dark:border-zinc-900">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex shimmer bg-accent text-white font-medium text-sm px-5 py-2.5 rounded-full"
              >
                Hire me →
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

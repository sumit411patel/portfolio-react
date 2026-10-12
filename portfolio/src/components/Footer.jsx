import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-100 dark:border-zinc-900">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-400">
          © {currentYear} Sumit. All rights reserved.{' '}
          <br className="sm:hidden" />
          Developed by{' '}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:text-accent transition-colors"
          >
            Sumit Patel
          </a>{' '}
        </p>
        <p className="text-xs text-zinc-500">
          Built with{' '}
          <a
            href="https://tailwindcss.com"
            rel="noopener noreferrer"
            target="_blank"
            className="hover:text-accent transition-colors"
          >
            Tailwind CSS
          </a>{' '}
          &amp;{' '}
          <a
            href="https://react.dev"
            rel="noopener noreferrer"
            target="_blank"
            className="hover:text-accent transition-colors"
          >
            React JS
          </a>
        </p>
      </div>
    </footer>
  );
}

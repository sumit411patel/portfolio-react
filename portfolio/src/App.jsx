import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ServicesSection from './components/ServicesSection';
import WorkSection from './components/WorkSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import FloatingProfileImage from './components/FloatingProfileImage';
import AllProjectsPage from './pages/AllProjectsPage';
import AdminPage from './pages/AdminPage';

// Main Portfolio Layout for User Site
function MainPortfolio() {
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync dark mode class on html tag
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  // Scroll listener for Navbar background blur & Active section scroll-spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section scroll spy calculation
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 60;
      if (atBottom) {
        setActiveSection('contact');
        return;
      }

      const sections = ['contact', 'work', 'services', 'skills', 'about', 'hero'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el && window.scrollY >= el.offsetTop - 150) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for reveal on scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-accent selection:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Floating Animated Profile Image & Path Line */}
      <FloatingProfileImage />

      <Navbar
        dark={dark}
        setDark={setDark}
        activeSection={activeSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrolled={scrolled}
      />
      <main>
        {/* Hero section */}
        <HeroSection />

        {/* About section */}
        <AboutSection />

        {/* Skills section (Before Services) */}
        <SkillsSection />

        {/* Services section */}
        <ServicesSection />

        {/* Work section (3 projects max) */}
        <WorkSection />

        {/* Contact section */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  // Track visitor hits on route change
  useEffect(() => {
    try {
      fetch('http://localhost:5000/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: location.pathname })
      }).catch(() => {});
    } catch (e) {}
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<MainPortfolio />} />
      <Route path="/projects" element={<AllProjectsPage />} />
      <Route path="/sp-04" element={<AdminPage />} />
    </Routes>
  );
}

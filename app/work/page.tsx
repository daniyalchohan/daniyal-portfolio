'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaGlobe, FaMobileAlt, FaBuilding, FaRobot } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Image from 'next/image'

interface ProjectType {
  title: string;
  year: string;
  category: string;
  description: string;
  link: string;
}
interface SectionType {
  title: string;
  description: string;
  projects: ProjectType[];
}

const sidebarSections: { id: keyof typeof sectionContent; label: string; icon: React.ReactNode }[] = [
  { id: 'websites', label: 'Websites', icon: <FaGlobe /> },
  { id: 'apps', label: 'App Design', icon: <FaMobileAlt /> },
  { id: 'enterprise', label: 'Enterprise Solutions', icon: <FaBuilding /> },
  { id: 'ai', label: 'AI Experience', icon: <FaRobot /> },
]

const sectionContent: Record<string, SectionType> = {
  websites: {
    title: 'Websites',
    description: 'I design responsive websites using no-code platforms like Wix, WordPress, and Framer—ideal for portfolios, e-commerce, and blogs.',
    projects: [
      { title: 'My Portfolio', year: '2025', category: 'Portfolio', description: 'Currently Viewing', link: '#' },
      { title: 'School', year: '2024', category: 'School', description: 'School', link: '#' },
      { title: 'Blog', year: '2025', category: 'Green Earth', description: 'Green Solutions for Global Impact', link: '#' },
      { title: 'Ecommerce', year: '2024', category: 'Watches', description: 'Ecommerce', link: '#' },
    ]
  },
  apps: {
    title: 'App Design',
    description: 'Designing intuitive mobile and web applications that users love.',
    projects: [
      { title: 'Fitness Tracker', year: '2024', category: 'Health & Fitness', description: 'A comprehensive fitness tracking app with social features.', link: '#' },
      { title: 'Productivity App', year: '2024', category: 'Productivity', description: 'A productivity app for teams and individuals.', link: '#' },
    ]
  },
  enterprise: {
    title: 'Enterprise Solutions',
    description: 'Building powerful enterprise-grade applications and dashboards.',
    projects: [
      { title: 'Analytics Dashboard', year: '2024', category: 'Enterprise', description: 'A comprehensive analytics dashboard for business metrics.', link: '#' },
      { title: 'Admin Panel', year: '2024', category: 'Admin', description: 'A robust admin panel for managing users and data.', link: '#' },
    ]
  },
  ai: {
    title: 'AI Experience',
    description: 'Creating innovative AI-powered interfaces and experiences.',
    projects: [
      { title: 'AI Chat Interface', year: '2024', category: 'AI/ML', description: 'An intuitive chat interface powered by advanced AI.', link: '#' },
      { title: 'AI Automation Tool', year: '2024', category: 'Automation', description: 'A tool for automating workflows with AI.', link: '#' },
    ]
  },
}

// Animation variants (copied from home page)
const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4,0,0.2,1] } }
};
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};
const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4,0,0.2,1] } }
};

export default function Work() {
  const [activeSection, setActiveSection] = useState<keyof typeof sectionContent>('websites')
  const [isMounted, setIsMounted] = useState(false)
  const connectText = "Let's Connect".split("")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Refs for scrollspy
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  // Scrollspy logic
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = sidebarSections.map(s => s.id);
      let found = activeSection;
      for (let id of sectionIds) {
        const el = sectionRefs.current[id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) {
            found = id;
            break;
          }
        }
      }
      if (found !== activeSection) setActiveSection(found);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  if (!isMounted) {
    return null
  }

  return (
    <>
      <div className="work-page">
        {/* Navigation */}
        <Navbar />
        <div className="work-scroll-layout">
          {/* Fixed Sidebar */}
          <aside className="work-scroll-sidebar hide-on-mobile" style={{
            position: 'fixed',
            top: '20vh',
            left: 80,
            zIndex: 100,
          }}>
            <nav className="work-scroll-nav">
              {sidebarSections.map(section => (
                <button
                  key={section.id}
                  className={`work-scroll-link${activeSection === section.id ? ' active' : ''}`}
                  onClick={() => {
                    const el = sectionRefs.current[section.id]
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                >
                  <span className="sidebar-icon">{section.icon}</span>
                  <span className="sidebar-label">{section.label}</span>
                </button>
              ))}
            </nav>
          </aside>
          {/* Scrollable Content */}
          <div className="work-scroll-content" style={{ maxWidth: 900, margin: '0 auto', paddingLeft: 0 }}>
            <div style={{ maxWidth: 900, margin: '120px auto 2.5rem auto', textAlign: 'center' }}>
              <h1 className="work-title" style={{ marginBottom: '1.2rem' }}>Portfolio</h1>
              <p className="work-description">
                Welcome to my portfolio, where you can explore a curated selection of my work across web design, app design, enterprise solutions, and AI experience. Each project demonstrates my commitment to delivering high-quality, creative solutions tailored to meet the unique needs of each client.
              </p>
            </div>
            {sidebarSections.map((section, idx) => (
              <motion.section
                key={section.id}
                id={section.id}
                ref={el => { sectionRefs.current[section.id] = el; }}
                style={{ padding: `80px 0 ${idx === sidebarSections.length - 1 ? '20px' : '60px'} 0`, borderBottom: '1px solid #23232a' }}
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <motion.h2 className="section-title" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ display: 'inline-block' }}>
                  {sectionContent[section.id].title.split("").map((char, i) => (
                    <motion.span key={i} variants={staggerItem} style={{ display: 'inline-block' }}>{char === ' ' ? '\u00A0' : char}</motion.span>
                  ))}
                </motion.h2>
                <p className="section-description">{sectionContent[section.id].description}</p>
                <div className="projects-grid work-projects-grid">
                  {sectionContent[section.id].projects.map((project: ProjectType, idx: number) => (
                    <div className="project-card" key={idx}>
                      <div className="project-image-placeholder">
                        <div className="placeholder-content">
                          <span className="placeholder-icon">📱</span>
                          <span className="placeholder-text">Project Preview</span>
                        </div>
                      </div>
                      <div className="project-info">
                        <div className="project-meta">
                          <span className="project-year">{project.year}</span>
                          <span className="project-category">{project.category}</span>
                        </div>
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-description">{project.description}</p>
                        <a href={project.link} className="project-link">View Project →</a>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <footer className="footer-root">
        <div className="footer-glow"></div>
        <div className="footer-main-row">
          <div className="footer-profile-col">
            <Image src="/daniyal-portfolio/profile.png" alt="Daniyal Ali" className="footer-profile-pic" width={48} height={48} />
            <span className="footer-profile-name">Daniyal Ali</span>
          </div>
          <div className="footer-links-col">
            <div className="footer-nav-group">
              <div className="footer-nav-title">Navigation</div>
              <a href="#">Home</a>
              <a href="#about">About</a>
              <a href="#work">Work</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-connect-group">
              <div className="footer-nav-title">Let&apos;s Connect</div>
              <div className="footer-email-row">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="footer-mail-icon">
                  <path d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z" stroke="#fff" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 7L13.03 12.7C12.7213 12.8934 12.3643 12.996 12 12.996C11.6357 12.996 11.2787 12.8934 10.97 12.7L2 7" stroke="#fff" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <a href="mailto:daniyalc47@gmail.com" className="footer-email">daniyalc47@gmail.com</a>
              </div>
              <div className="footer-social-row">
                <a href="https://linkedin.com/in/daniyalali" target="_blank" rel="noopener" className="footer-social-icon" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24"><rect width="48" height="48" rx="8" fill="none"/><path fill="#fff" d="M12 19h5v17h-5V19z M14.485,17h-0.028C12.965,17,12,15.888,12,14.499C12,13.08,12.995,12,14.514,12 c1.521,0,2.458,1.08,2.486,2.499C17,15.887,16.035,17,14.485,17z M36,36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698 c-1.501,0-2.313,1.012-2.707,1.99C24.957,25.543,25,26.511,25,27v9h-5V19h5v2.616C25.721,20.5,26.85,19,29.738,19 c3.578,0,6.261,2.25,6.261,7.274L36,36L36,36z"/></svg>
                </a>
                <a href="https://x.com/daniyalali" target="_blank" rel="noopener" className="footer-social-icon" aria-label="X">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="24" height="24"><path fill="#fff" d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom-row">
          &copy; 2025 Daniyal Ali. All rights reserved.
        </div>
      </footer>
    </>
  )
} 
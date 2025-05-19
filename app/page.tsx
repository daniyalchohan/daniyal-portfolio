'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion';
import Blob3D from './Blob3D'
import Navbar from './components/Navbar'
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
  
  const roles = useMemo(() => ["UX Designer", "Product Manager", "UX Engineer"], [])
  const projectRowsRef = useRef<(HTMLDivElement | null)[]>([])
  const projectsSectionRef = useRef<HTMLDivElement | null>(null)

  // Footer glow animation logic
  const footerRef = useRef(null);
  const [footerGlowVisible, setFooterGlowVisible] = useState(false);

  // Animation variants
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

  // Parallax for Services
  const servicesRef = useRef(null);
  const { scrollYProgress: servicesScroll } = useScroll({ target: servicesRef, offset: ['start end', 'end start'] });
  const servicesY = useTransform(servicesScroll, [0, 1], [0, -60]);

  // Parallax for Let's Connect
  const connectRef = useRef(null);
  const { scrollYProgress: connectScroll } = useScroll({ target: connectRef, offset: ['start end', 'end start'] });
  const connectY = useTransform(connectScroll, [0, 1], [0, -60]);

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const currentRole = roles[currentRoleIndex]
    const typingSpeed = 100 // Speed for typing
    const deletingSpeed = 50 // Speed for deleting
    const pauseTime = 1000 // Time to pause when word is complete

    let timeout: NodeJS.Timeout

    if (!isDeleting) {
      // Typing
      if (displayText.length < currentRole.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length + 1))
        }, typingSpeed)
      } else {
        // Word is complete, wait before starting to delete
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, pauseTime)
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, deletingSpeed)
      } else {
        // Word is deleted, move to next word
        setIsDeleting(false)
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentRoleIndex, roles])

  useEffect(() => {
    // Subtle horizontal scroll effect
    const handleScroll = () => {
      const section = projectsSectionRef.current
      if (!section) return
      const sectionRect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY || window.pageYOffset
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      // Only a gentle shift, not a full scroll
      const progress = Math.min(Math.max((scrollY + windowHeight - sectionTop) / (sectionHeight + windowHeight), 0), 1)
      projectRowsRef.current.forEach((row, idx) => {
        if (!row) return
        const direction = idx % 2 === 0 ? 1 : -1
        const maxShift = 200 // px, subtle but more noticeable shift
        const translateX = direction * maxShift * progress
        row.style.transform = `translateX(${-translateX}px)`
      })
    }
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)
    setTimeout(handleScroll, 100)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setFooterGlowVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!isMounted) {
    return null
  }

  const connectText = "Let's Connect".split("")

  return (
    <>
      <main>
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <motion.section className="hero hero-custom"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="hero-main-text">
            <motion.div className="design-tag" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {"Design in Detail".split("").map((char, i) => (
                <motion.span key={i} variants={staggerItem} style={{ display: 'inline-block' }}>{char === ' ' ? '\u00A0' : char}</motion.span>
              ))}
            </motion.div>
            <div className="hero-digital sora-font">
              Daniyal Ali is a
              <div className="dynamic-role-container">
                <span className="dynamic-role">{displayText}</span><span className="cursor">|</span>
              </div>
            </div>
          </div>
          <div className="hero-description">
            <div className="hero-intro">Crafting intuitive digital experiences that bridge human needs with innovative solutions. Specializing in user-centered product design with a focus on clarity and purpose.</div>
            <div className="hero-collab">Open to collaborative opportunities worldwide. Creating meaningful digital products that resonate across cultures, industries, and platforms.</div>
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          className="projects-section"
          ref={projectsSectionRef}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="projects-section-overlay">
            <div className="about-content">
              <div className="about-tag">About me</div>
              <p className="about-paragraph">
                Hi There! <br />
                I&apos;m Daniyal Ali, a passionate product designer with expertise in visual storytelling and a sharp eye for detail. Since 2021, I&apos;ve honed my skills in crafting designs that balance creativity and precision, mastering design principles while staying adept with the latest tools and trends.
              </p>
            </div>
          </div>
          {[0, 1, 2].map((rowIdx) => (
            <div
              className={`project-row ${rowIdx % 2 === 0 ? 'scroll-left' : 'scroll-right'}`}
              key={rowIdx}
              ref={el => { projectRowsRef.current[rowIdx] = el; }}
            >
              {[...Array(4)].map((_, imgIdx) => (
                <div className="project-mockup" key={imgIdx}>
                  <Image src={`https://via.placeholder.com/420x280?text=Project+${rowIdx * 4 + imgIdx + 1}`} alt={`Project ${rowIdx * 4 + imgIdx + 1}`} width={420} height={280} />
                </div>
              ))}
            </div>
          ))}
        </motion.section>

        {/* Portfolio Links Section */}
        <motion.section className="portfolio-links-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="portfolio-links-container">
            {[
              { label: 'Website Design', href: '#website-design' },
              { label: 'App Design', href: '#app-design' },
              { label: 'Enterprise solutions', href: '#saas' },
              { label: 'AI Experience', href: '#ai' },
              { label: 'View All', href: '#all' },
            ].map((link, idx) => (
              <Link key={link.label} href={link.href} className="portfolio-link" legacyBehavior>
                <a>
                  <span className="portfolio-link-ticker">
                    {[...Array(6)].map((_, i) => (
                      <span key={i}>{link.label}&nbsp;&nbsp;</span>
                    ))}
                  </span>
                  <span className="portfolio-link-label">{link.label}</span>
                </a>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Website Design Section */}
        <motion.section className="website-design-section no-bg"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="website-design-content">
            <div className="website-design-tag gradient-title">Case Studies</div>
            <h2 className="website-design-title">Impress, Engage, and Perform.</h2>
            <p className="website-design-desc">
              Explore a curated selection of in-depth case studies showcasing my design process, problem-solving, and the impact of my work across various industries and platforms.
            </p>
            <div className="bento-header-row">
              <span className="bento-featured-label">Featured Case Studies</span>
            </div>
            <div className="bento-grid">
              {/* Top row: 4 featured website cards */}
              <div className="bento-card featured">
                <div className="bento-card-year">2025</div>
                <div className="bento-card-title">My Portfolio</div>
                <Image src="/portfolio-mock.png" alt="Portfolio Website" width={420} height={280} />
                <div className="bento-card-sub">Currently Viewing</div>
                <div className="bento-card-links">
                  <a href="#" className="bento-card-link">Live Site</a>
                  <span className="bento-card-link-icon">🌐</span>
                </div>
              </div>
              <div className="bento-card featured">
                <div className="bento-card-year">2024</div>
                <div className="bento-card-title">School</div>
                <Image src="/school-mock.png" alt="School Website" width={420} height={280} />
                <div className="bento-card-sub">School</div>
                <div className="bento-card-links">
                  <a href="#" className="bento-card-link">Live Site</a>
                  <span className="bento-card-link-icon">🌐</span>
                </div>
              </div>
              <div className="bento-card featured">
                <div className="bento-card-year">2025</div>
                <div className="bento-card-title">Blog</div>
                <Image src="/blog-mock.png" alt="Blog Website" width={420} height={280} />
                <div className="bento-card-sub">Green Earth</div>
                <div className="bento-card-links">
                  <a href="#" className="bento-card-link">Live Site</a>
                  <span className="bento-card-link-icon">🌐</span>
                </div>
              </div>
              <div className="bento-card featured">
                <div className="bento-card-year">2024</div>
                <div className="bento-card-title">Ecommerce</div>
                <Image src="/ecommerce-mock.png" alt="Ecommerce Website" width={420} height={280} />
                <div className="bento-card-sub">Watches</div>
                <div className="bento-card-links">
                  <a href="#" className="bento-card-link">Live Site</a>
                  <span className="bento-card-link-icon">🌐</span>
                </div>
              </div>
              {/* Bottom row: platform icons (colSpan=2), collaborate, navigation */}
              <div className="bento-card platform-icons-bento" style={{ gridColumn: '1 / span 2' }}>
                <div className="platform-icons-row">
                  <div className="icon-section">
                    <Image src="/framer.avif" alt="Framer" width={48} height={48} />
                  </div>
                  <div className="icon-section">
                    <Image src="/webflow.avif" alt="Webflow" width={48} height={48} />
                  </div>
                  <div className="icon-section">
                    <Image src="/figma.avif" alt="Figma" width={48} height={48} />
                  </div>
                </div>
              </div>
              <div className="bento-card info collaborate">
                <div className="bento-info-title">Collaborate</div>
                <div className="bento-info-desc">Designing spaces where ideas meet and collaboration thrives.</div>
                <button className="bento-collab-btn">Devansh</button>
              </div>
              <div className="bento-card info navigation">
                <div className="bento-info-title">Navigation</div>
                <div className="bento-info-desc">Visually structure your pages and link to them with a few clicks.</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Projects Tag Section */}
        <motion.div className="projects-tag-container"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="projects-tag gradient-projects-tag" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {"Projects".split("").map((char, i) => (
              <motion.span key={i} variants={staggerItem} style={{ display: 'inline-block' }}>{char === ' ' ? '\u00A0' : char}</motion.span>
            ))}
          </motion.div>
          <div className="projects-tag-underline"></div>
        </motion.div>
        {/* Headline and description below Projects tag */}
        <div className="projects-headline-section">
          <h2 className="website-design-title" style={{ marginTop: '0.5rem', marginBottom: '1.2rem', textAlign: 'center' }}>
            Solving Real Problems, Creating Real Impact.
          </h2>
          <p className="website-design-desc" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 2.5rem auto' }}>
            A curated collection of my best work across industries and platforms. Each project represents a unique challenge solved through research, design thinking, and collaborative iteration.
          </p>
        </div>

        {/* Projects Sections */}
        {[
          { title: 'App Design', id: 'app-design' },
          { title: 'SaaS Dashboards', id: 'saas-dashboards' },
          { title: 'AI Application', id: 'ai-application' },
          { title: 'Brand Guidelines', id: 'brand-guidelines' },
        ].map(section => (
          <motion.section className="project-section" id={section.id} key={section.id}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="project-section-header">
              <motion.span className="project-section-title" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {section.title.split("").map((char, i) => (
                  <motion.span key={i} variants={staggerItem} style={{ display: 'inline-block' }}>{char === ' ' ? '\u00A0' : char}</motion.span>
                ))}
              </motion.span>
              <div className="project-section-row">
                <span className="project-featured-label">Featured Projects</span>
                <Link className="project-all-link" href="#" legacyBehavior><a>All Projects <span>&rarr;</span></a></Link>
              </div>
            </div>
            <div className="project-cards-row">
              {[1,2,3,4].map(i => (
                <div className="project-card" key={i}>
                  <div className="project-card-image-placeholder"></div>
                  <div className="project-card-title-placeholder">Project {i}</div>
                </div>
              ))}
            </div>
          </motion.section>
        ))}

        {/* Services Section */}
        <section className="services-section">
          <div className="services-bg-text">SERVICES</div>
          <div className="services-cards-row">
            <div className="service-card">
              <div className="service-title">Website Design</div>
              <ul className="service-list">
                <li>Landing Pages</li>
                <li>E-commerce</li>
                <li>Portfolio</li>
                <li>Blogs</li>
                <li>Corporate Websites</li>
                <li>UI/UX Design</li>
                <li>Responsive Design</li>
              </ul>
            </div>
            <div className="service-card">
              <div className="service-title">App Design</div>
              <ul className="service-list">
                <li>iOS & Android Apps</li>
                <li>Web Applications</li>
                <li>Prototyping</li>
                <li>User Flows</li>
                <li>Wireframing</li>
                <li>Interaction Design</li>
                <li>Design Systems</li>
              </ul>
            </div>
            <div className="service-card">
              <div className="service-title">Enterprise solutions</div>
              <ul className="service-list">
                <li>Analytics Dashboards</li>
                <li>Admin Panels</li>
                <li>Data Visualization</li>
                <li>Custom Widgets</li>
                <li>Multi-tenant Platforms</li>
              </ul>
            </div>
            <div className="service-card">
              <div className="service-title">AI Experience</div>
              <ul className="service-list">
                <li>AI-powered Interfaces</li>
                <li>Chatbots &amp; Assistants</li>
                <li>Automation Tools</li>
                <li>Prompt Engineering</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Let's Connect Section */}
        <section className="connect-section" style={{ position: 'relative', zIndex: 2, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="services-bg-text">LET&apos;S CONNECT</div>
          <div className="connect-card-row">
            <div className="connect-card glassy">
              <h2 className="connect-heading">Connect with me</h2>
              <form className="connect-form">
                <div className="connect-form-row">
                  <div className="connect-form-group">
                    <label htmlFor="firstName">First name *</label>
                    <input type="text" id="firstName" name="firstName" placeholder="First name" required />
                  </div>
                  <div className="connect-form-group">
                    <label htmlFor="lastName">Last name</label>
                    <input type="text" id="lastName" name="lastName" placeholder="Last name" />
                  </div>
                </div>
                <div className="connect-form-row">
                  <div className="connect-form-group">
                    <label htmlFor="email">Email *</label>
                    <input type="email" id="email" name="email" placeholder="Email" required />
                  </div>
                  <div className="connect-form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" placeholder="Phone" />
                  </div>
                </div>
                <div className="connect-form-group">
                  <label>Your Requirement</label>
                  <div className="connect-requirement-options">
                    <button type="button" className="requirement-btn">Website</button>
                    <button type="button" className="requirement-btn">Graphics</button>
                    <button type="button" className="requirement-btn">Video</button>
                    <button type="button" className="requirement-btn">3D</button>
                  </div>
                </div>
                <div className="connect-form-group">
                  <label htmlFor="message">How can I help?</label>
                  <textarea id="message" name="message" placeholder="Feel free to outline your ideas or needs..." rows={4}></textarea>
                </div>
                <button type="submit" className="connect-submit-btn">Submit</button>
              </form>
            </div>
            <div className="connect-card glassy connect-orb-col">
              {/* 3D Blob using react-three-fiber */}
              <Blob3D />
            </div>
          </div>
        </section>
        {/* Back to Top link below Let's Connect, right aligned */}
        <div className="backtotop-row">
          <Link href="#" className="backtotop-link" legacyBehavior><a>Back to Top &uarr;</a></Link>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="footer-root">
        <div className="footer-glow"></div>
        <div className="footer-main-row">
          <div className="footer-profile-col">
            <Image src="/profile.png" alt="Daniyal Ali" className="footer-profile-pic" width={48} height={48} />
            <span className="footer-profile-name">Daniyal Ali</span>
          </div>
          <div className="footer-links-col">
            <div className="footer-nav-group">
              <div className="footer-nav-title">Navigation</div>
              <Link href="#" legacyBehavior><a>Home</a></Link>
              <Link href="#about" legacyBehavior><a>About</a></Link>
              <Link href="#work" legacyBehavior><a>Work</a></Link>
              <Link href="#contact" legacyBehavior><a>Contact</a></Link>
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
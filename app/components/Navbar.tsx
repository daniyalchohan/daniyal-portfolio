'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface NavbarProps {
  variant?: 'default' | 'mobile'
}

const containerVariants = {
  initial: {},
  hover: {
    transition: {
      staggerChildren: 0.04,
    },
  },
}

const letterVariants = {
  initial: { y: 0 },
  hover: {
    y: [0, -12, 0],
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

export default function Navbar({ variant = 'default' }: NavbarProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const connectText = "Let's Connect".split("")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <Image src="/profile.png" alt="Profile" className="navbar-profile" width={44} height={44} />
            <span className="navbar-title">Daniyal Ali</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/work" className="nav-link">Work</Link>
          <Link href="/#about" className="nav-link">About</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Connect Button with stagger hover effect */}
        <motion.a
          href="/#connect"
          className="connect-btn"
          variants={containerVariants}
          initial="initial"
          whileHover="hover"
        >
          {connectText.map((char, i) => (
            <motion.span key={i} variants={letterVariants}>
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.a>

        {/* Mobile Menu */}
        <motion.div 
          className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -20 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} legacyBehavior><a>Home</a></Link>
          <Link href="/work" onClick={() => setIsMobileMenuOpen(false)} legacyBehavior><a>Work</a></Link>
          <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} legacyBehavior><a>About</a></Link>
          <Link href="/#connect" onClick={() => setIsMobileMenuOpen(false)} className="nav-link" legacyBehavior><a>Let&apos;s Connect</a></Link>
        </motion.div>
      </div>
    </nav>
  )
} 
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';

type NavigationProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export const Navigation = ({ currentPage, onNavigate }: NavigationProps) => {

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-close menu when scrolling to top
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    // Track if we've been deep in the page
    // Activation threshold: > 150px
    let hasScrolledDown = window.scrollY > 150;

    const handleAutoClose = () => {
      // If user scrolls down past 150px, mark as having scrolled down
      if (window.scrollY > 150) {
        hasScrolledDown = true;
      }

      // If we've been down and now we're near the top (< 100px), close it
      if (hasScrolledDown && window.scrollY < 100) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleAutoClose);
    return () => window.removeEventListener('scroll', handleAutoClose);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { id: 'about', name: '關於我們' },
    { id: 'blog', name: '部落格' },
    { id: 'join', name: '參與計畫' },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-background/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="relative z-50 focus:outline-none"
          aria-label="返回首頁"
        >
          <img
            src="/logo.svg"
            alt="Unload 標誌"
            width={140}
            height={40}
            className="h-10 w-[140px] object-contain"
          />
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-12">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`text-sm tracking-wide transition-all duration-300 relative group ${
                currentPage === link.id ? 'text-primary font-normal' : 'text-primary-light hover:text-primary font-light'
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-2 left-0 w-full h-[2px] bg-primary origin-left transition-transform duration-300 ${
                  currentPage === link.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              ></span>
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-primary z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
        </button>

        {/* Mobile Menu Overlay */}
        {mounted && createPortal(
          <div className={`fixed inset-0 bg-[#FDFCF8] z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-2xl tracking-wider ${currentPage === link.id ? 'text-primary font-normal' : 'text-primary-light font-light'
                  }`}
              >
                {link.name}
              </button>
            ))}
          </div>,
          document.body
        )}
      </div>
    </nav>
  );
};
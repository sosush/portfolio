import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants';
import type { NavLink } from '../types';

interface HeaderProps {
  isVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ isVisible }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-black/80 shadow-lg shadow-green-500/10 backdrop-blur-sm' : 'bg-transparent'} ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-white group font-mono">
          <span className="text-green-400">&lt;</span>
          <span className="group-hover:text-green-400 transition-colors">sosush</span>
          <span className="text-green-400"> /&gt;</span>
        </a>
        <ul className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link: NavLink, index: number) => (
            <li key={link.name}>
              <a href={link.href} className="text-green-400 hover:text-white transition-colors duration-300 font-mono">
                <span className="text-white">0{index + 1}.</span> {link.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  // Page-wide glitch effect
  useEffect(() => {
    if (!hasEntered) return;

    const intervalId = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => {
        setIsGlitching(false);
      }, 800); // Duration of the glitch animation
    }, Math.random() * 6000 + 4000); // Random interval between 4s and 10s

    return () => clearInterval(intervalId);
  }, [hasEntered]);
  
  // Lock scroll until user enters
  useEffect(() => {
    if (hasEntered) {
      document.body.style.overflow = 'auto';
    } else {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [hasEntered]);
  
  const handleEnter = () => {
    setHasEntered(true);
  };

  return (
    <div className={`bg-black text-white min-h-screen font-sans relative ${isGlitching ? 'glitch-active' : ''}`}>
      <Header isVisible={hasEntered} />
      <main>
        <Hero onEnter={handleEnter} />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  );
};

export default App;
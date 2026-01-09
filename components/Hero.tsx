import React, { useState, useEffect, useRef } from 'react';
import resume from '../Sohini_Banerjee_Resume.pdf';

// Hacker Lock SVG
const HackerLockIcon: React.FC<{ isUnlocking: boolean }> = ({ isUnlocking }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-48 h-48 md:w-64 md:h-64"
  >
    <defs>
      <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g 
      filter="url(#neon-glow)"
      stroke="#0dff00" // --neon-green
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path 
        d="M7 11V7a5 5 0 0 1 10 0v4"
        className={isUnlocking ? 'unlock-animation' : ''}
      ></path>
      {/* Smaller Keyhole */}
      <circle cx="12" cy="16.5" r="1"></circle>
      <path d="M12 17.5v2"></path>
    </g>
  </svg>
);


// Matrix Rain component logic
const MatrixRain: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const englishAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const fontSize = 16;
        
        let columns: number;
        let drops: number[];

        const setup = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            columns = Math.floor(canvas.width / fontSize);
            drops = Array(columns).fill(1).map(() => Math.random() * canvas.height);
        };

        setup();
        window.addEventListener('resize', setup);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = englishAlphabet.charAt(Math.floor(Math.random() * englishAlphabet.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const animate = () => {
            draw();
            animationFrameId = window.requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', setup);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 opacity-40" />;
};

interface HeroProps {
  onEnter: () => void;
}

// Main Hero Component
const Hero: React.FC<HeroProps> = ({ onEnter }) => {
  const [entered, setEntered] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleEnter = () => {
    if (entered || isUnlocking) return;
    setIsUnlocking(true);

    // Wait for unlock animation to finish
    setTimeout(() => {
      setEntered(true);
      onEnter();
    }, 500); // Duration of the unlock animation
  };

  return (
    <section className="min-h-screen flex items-center justify-center text-center bg-black relative px-6 cursor-pointer" onClick={handleEnter}>
      <MatrixRain />
      
      {/* Pre-landing view */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center z-20 transition-opacity duration-1000 ${entered ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <HackerLockIcon isUnlocking={isUnlocking} />
          <p className="mt-8 font-mono text-lg text-green-400 animate-pulse">
            {isUnlocking ? 'Unlocking...' : 'Click anywhere to enter'}
          </p>
      </div>

      {/* Main content view */}
      <div className={`z-10 flex flex-col items-center max-w-4xl mx-auto transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-green-400 font-mono text-lg mb-4">Hi, my name is</p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 font-mono leading-tight">
          Sohini Banerjee
        </h1>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-300/80 mb-8 font-mono">
          I like building things
        </h2>
        <p className="text-lg text-green-300 leading-relaxed font-mono mb-10">
          I'm a computer science engineering student. I build websites for fun when I'm bored aka vibe coding. On a more serious note I am studying to be a Machine Learning Engineer.</p>
        <div className="flex gap-4">
          <a 
            href="mailto:son20apakhi05@gmail.com" 
            onClick={(e) => e.stopPropagation()}
            className="border border-green-500 text-green-500 font-semibold py-3 px-8 rounded-sm hover:bg-green-500/10 transition-all duration-300 font-mono text-lg"
          >
            Let's Connect
          </a>
          <a 
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="bg-green-500 text-black font-semibold py-3 px-8 rounded-sm hover:bg-green-600 transition-all duration-300 font-mono text-lg"
          >
            My Resume
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;

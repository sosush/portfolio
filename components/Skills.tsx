import React, { useState, useEffect } from 'react';
import { SKILLS } from '../constants';
import type { Skill } from '../types';

const TypingHeading: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = text;
      const currentText = displayedText;
      
      if (isDeleting) {
        setDisplayedText(currentText.substring(0, currentText.length - 1));
        setSpeed(100);
      } else {
        setDisplayedText(fullText.substring(0, currentText.length + 1));
        setSpeed(150);
      }
      
      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
      }
    };
    
    const timer = setTimeout(handleTyping, speed);
    
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, text, speed]);
  
  return (
    <h2 className="text-4xl font-bold text-center mb-12 text-white font-mono h-12">
      <span className="text-green-400">~$</span> {displayedText}
      <span className="text-green-400 cursor-blink">|</span>
    </h2>
  );
};

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-24">
      <div className="container mx-auto px-6">
        <TypingHeading text="My Arsenal" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {SKILLS.map((skill: Skill) => (
            <div 
              key={skill.name}
              className="flex flex-col items-center justify-center p-6 bg-transparent rounded-lg shadow-lg shadow-green-900/20 border border-green-800 hover:border-green-500 hover:-translate-y-2 transition-all duration-300 hover:bg-green-900/10"
            >
              <div className="h-14 w-14 flex items-center justify-center">
                {skill.icon}
              </div>
              <p className="mt-4 text-center font-semibold text-green-300 font-mono">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
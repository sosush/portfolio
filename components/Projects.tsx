import React, { useState, useEffect } from 'react';
import { PROJECTS, SOCIAL_LINKS } from '../constants';
import type { Project } from '../types';

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

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="bg-transparent p-6 rounded-lg shadow-2xl shadow-green-900/20 border border-green-800 flex flex-col h-full hover:-translate-y-2 transition-transform duration-300 hover:bg-green-900/10">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold text-white font-mono">{project.title}</h3>
      <div className="flex items-center space-x-4 text-green-400">
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            {SOCIAL_LINKS.github}
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            {SOCIAL_LINKS.external}
          </a>
        )}
      </div>
    </div>
    <p className="text-green-300 mb-4 flex-grow font-mono">{project.description}</p>
    <div className="flex flex-wrap gap-2">
      {project.tags.map(tag => (
        <span key={tag} className="bg-green-900/50 text-green-400 text-xs font-mono px-2 py-1 rounded-sm">
          {tag}
        </span>
      ))}
    </div>
  </div>
);


const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6">
        <TypingHeading text="Things I've Built" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project: Project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
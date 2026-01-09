import React, { useState, useEffect, useRef } from 'react';
import { SOCIAL_LINKS, SKILLS, PROJECTS } from '../constants';
import type { Project } from '../types';
import resume from '../Sohini_Banerjee_Resume.pdf';

interface CommandHistory {
  command: string;
  output: React.ReactNode;
}

const Contact: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const hasRunCommand = history.length > 0;

  // Focus the input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to the bottom of the terminal on new output
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);
  
  const handleCommand = (command: string) => {
    const newHistory: CommandHistory = { command, output: '' };
    const args = command.split(' ').filter(arg => arg !== '');
    const cmd = (args[0] || '').toLowerCase();

    switch (cmd) {
      case 'help':
      case '-h':
        newHistory.output = (
          <div>
            <p className="text-green-400">Available commands:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><span className="text-white font-semibold">ls -s</span> - List all skills.</li>
              <li><span className="text-white font-semibold">ls -p</span> - List all project titles.</li>
              <li><span className="text-white font-semibold">cd &lt;section&gt;</span> - Navigate to a section (about, skills, projects).</li>
              <li><span className="text-white font-semibold">cd "[project name]"</span> - Show details for a specific project.</li>
              <li><span className="text-white font-semibold">xdg-open resume.pdf</span> - Open my resume in a new tab.</li>
              <li><span className="text-white font-semibold">sudo -c</span> - Display email.</li>
              <li><span className="text-white font-semibold">sudo -s</span> - List social media links.</li>
              <li><span className="text-white font-semibold">clear</span> - Clear the terminal history.</li>
              <li><span className="text-white font-semibold">-h or help</span> - Show available commands list.</li>
            </ul>
          </div>
        );
        break;
      case 'ls':
        const flag = args[1];
        if (flag === '-s') {
            newHistory.output = (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4">
                    {SKILLS.map(skill => <p key={skill.name}>{skill.name}</p>)}
                </div>
            );
        } else if (flag === '-p') {
            newHistory.output = (
                <ul className="list-disc list-inside">
                    {PROJECTS.map(project => <li key={project.title}>{project.title}</li>)}
                </ul>
            );
        } else {
            newHistory.output = "Usage: ls [-s | -p]\n  -s: list skills\n  -p: list projects";
        }
        break;
      case 'cd':
        const targetName = args.slice(1).join(' ').replace(/^"|"$/g, '');

        if (['about', 'skills', 'projects'].includes(targetName.toLowerCase())) {
          newHistory.output = `Navigating to ${targetName}...`;
          document.getElementById(targetName.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
        } else {
            const project = PROJECTS.find(p => p.title.toLowerCase() === targetName.toLowerCase());
            if (project) {
                newHistory.output = (
                    <div>
                        <p><span className="text-white font-semibold">Title:</span> {project.title}</p>
                        <p><span className="text-white font-semibold">Description:</span> {project.description}</p>
                        <p><span className="text-white font-semibold">Tags:</span> {project.tags.join(', ')}</p>
                        <div className="flex items-center space-x-4 mt-2">
                            {project.repoUrl && (
                                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-white transition-colors">
                                    {SOCIAL_LINKS.github} GitHub
                                </a>
                            )}
                            {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-white transition-colors">
                                    {SOCIAL_LINKS.external} Live Site
                                </a>
                            )}
                        </div>
                    </div>
                );
            } else if (targetName) {
                newHistory.output = `cd: no such section or project: ${targetName}`;
            } else {
                newHistory.output = `cd: missing operand. Try 'cd about' or 'cd "Project Title"'.`;
            }
        }
        break;
      case 'xdg-open':
        if (args[1] === 'resume.pdf') {
            newHistory.output = 'Opening resume...';
            // Replace this URL with the actual URL of your resume PDF
            window.open(resume, '_blank');
        } else {
            newHistory.output = `xdg-open: file not found: ${args[1] || ''}`;
        }
        break;
      case 'sudo':
        if (args[1] === '-c') {
            newHistory.output = 'son20apakhi05@gmail.com';
        } else if (args[1] === '-s') {
            newHistory.output = (
                <div className="flex items-center space-x-4">
                    <a href="https://github.com/sosush" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-white transition-colors">
                        {SOCIAL_LINKS.github} GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/sohini-banerjee-12882731b/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-white transition-colors">
                        {SOCIAL_LINKS.linkedin} LinkedIn
                    </a>
                </div>
            )
        } else {
            newHistory.output = `sudo: invalid option ${args[1] || ''}`;
        }
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return; // Exit early to avoid adding to history
      case '':
        // Add a new line for an empty command, but don't add to commandHistory
        setHistory([...history, newHistory]);
        setInput('');
        return;
      default:
        newHistory.output = `command not found: ${command}`;
    }
    setHistory([...history, newHistory]);
    if (command) {
        setCommandHistory(prev => [command, ...prev]);
    }
    setHistoryIndex(-1);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0) {
            const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
            setHistoryIndex(newIndex);
            setInput(commandHistory[newIndex]);
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex >= 0) {
            const newIndex = Math.max(historyIndex - 1, -1);
            setHistoryIndex(newIndex);
            setInput(newIndex === -1 ? '' : commandHistory[newIndex]);
        }
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <div 
          className="w-full h-[450px] bg-black/80 rounded-lg shadow-2xl shadow-green-900/40 border border-green-800 backdrop-blur-sm flex flex-col"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div className="bg-gray-800/50 p-3 flex items-center gap-2 rounded-t-lg border-b border-green-800 flex-shrink-0">
            <div className="w-3.5 h-3.5 bg-red-500 rounded-full"></div>
            <div className="w-3.5 h-3.5 bg-yellow-500 rounded-full"></div>
            <div className="w-3.5 h-3.5 bg-green-500 rounded-full"></div>
            <p className="text-sm text-gray-300 ml-4 font-mono">bash</p>
          </div>
          
          {/* Terminal Body */}
          <div ref={terminalBodyRef} className="p-4 flex-grow overflow-y-auto font-mono text-sm" style={{ minHeight: 0 }}>
            {/* Initial View */}
            {!hasRunCommand && (
                <div>
                    <p className="text-green-400">Type '-h' or 'help' for a list of available commands.</p>
                </div>
            )}
            
            {/* Command History */}
            {history.map((item, index) => (
                <div key={index} className="mb-2">
                <div className="flex items-baseline gap-2">
                    <span className="text-green-400">sosush@terminal:~$</span>
                    <span className="text-white">{item.command}</span>
                </div>
                <div className="text-green-300">{item.output}</div>
                </div>
            ))}

            {/* Input Prompt */}
            <div className={`flex items-baseline gap-2 ${!hasRunCommand ? 'mt-2' : ''}`}>
                <span className="text-green-400">sosush@terminal:~$</span>
                <form onSubmit={handleSubmit} className="flex-grow">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent border-none text-white w-full focus:outline-none"
                        autoFocus
                        autoComplete="off"
                    />
                </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
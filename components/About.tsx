import React, { useState, useEffect } from 'react';
import MyImage from './gh-img.jpeg';

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
        // Pause at the end
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

const About: React.FC = () => {
  const staticBio = "Hey there! I'm a computer science student on a mission to turn ideas into reality through code. Machine Learning is my playground—I love teaching computers to learn and predict—but I also get a kick out of crafting dynamic, interactive web interfaces that make users go 'wow!'. I’m endlessly curious about the intersection of AI and web development, exploring how smart tech can make everyday experiences smoother and more fun. To me, coding isn’t just work—it’s a creative adventure, a way to experiment, solve problems, and build the future one quirky line at a time. When I’m not buried in code, you’ll find me geeking out over new tech trends, experimenting with side projects, or dreaming up the next big idea!";



  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-6">
        <TypingHeading text="About Me" />
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-2/3">
            <div className="bg-transparent p-8 rounded-lg shadow-2xl shadow-green-900/20 border border-green-800">
              <p className="text-green-300 leading-relaxed text-lg whitespace-pre-wrap font-mono">{staticBio}</p>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="w-64 h-64 rounded-none overflow-hidden relative group border-4 border-green-500/50">
              <img 
                src={MyImage} 
                alt="Profile" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-green-500/20 group-hover:bg-transparent transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
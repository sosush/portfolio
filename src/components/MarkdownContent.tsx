import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, className = '' }) => (
  <div className={`markdown-content ${className}`}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-2xl font-black text-white mt-8 mb-4 first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold text-white mt-7 mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-white mt-5 mb-2">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-gray-300 text-base leading-relaxed mb-4">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1.5 pl-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1.5 pl-1">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-gray-300 leading-relaxed">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-[#01cdfe]/60 pl-4 my-5 text-gray-400 italic">
            {children}
          </blockquote>
        ),
        code: ({ className, children }) => {
          const isBlock = className?.includes('language-');
          if (isBlock) {
            return (
              <code className="block bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-mono text-[#05ffa1] overflow-x-auto my-4 whitespace-pre">
                {children}
              </code>
            );
          }
          return (
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-[#01cdfe]">
              {children}
            </code>
          );
        },
        pre: ({ children }) => <pre className="my-4">{children}</pre>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#01cdfe] hover:underline"
          >
            {children}
          </a>
        ),
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt ?? ''}
            className="rounded-xl border border-white/10 my-5 w-full max-w-full"
            loading="lazy"
          />
        ),
        hr: () => <hr className="border-white/10 my-8" />,
        strong: ({ children }) => (
          <strong className="font-bold text-white">{children}</strong>
        ),
        em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

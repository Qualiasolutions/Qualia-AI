import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { User, Bot, BookCopy } from 'lucide-react';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const [displayedContent, setDisplayedContent] = useState(isUser ? message.content : '');
  const [isTyping, setIsTyping] = useState(!isUser);
  const typingSpeed = 15; // Milliseconds per character
  
  // Function to handle copying code to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.replace(/\n$/, ''));
  };

  // Typewriter effect for AI responses
  useEffect(() => {
    if (isUser) {
      setDisplayedContent(message.content);
      return;
    }

    let currentIndex = 0;
    const fullContent = message.content;
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (currentIndex < fullContent.length) {
        setDisplayedContent(fullContent.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [message.content, isUser]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`py-6 ${isUser ? 'border-t border-qualia-border' : 'border-none'}`}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-8 h-8 rounded-md flex items-center justify-center ${
              isUser 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                : 'bg-gradient-to-br from-qualia-primary to-qualia-accent'
            }`}
          >
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </motion.div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className={`text-sm font-medium ${isUser ? 'text-indigo-300' : 'text-qualia-accent'}`}>
              {isUser ? 'You' : 'Qualia Solutions'}
            </h3>
            <span className="ml-2 text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {!isUser && isTyping && (
              <span className="ml-2 text-xs text-qualia-accent">typing...</span>
            )}
          </div>
          
          {isUser ? (
            <p className="text-white">{displayedContent}</p>
          ) : (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  a: (props) => (
                    <a 
                      {...props} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-qualia-accent hover:underline" 
                    />
                  ),
                  code: (props) => {
                    const { children, className } = props;
                    const match = /language-(\w+)/.exec(className || '');
                    const codeText = String(children).replace(/\n$/, '');
                    
                    // Check if this is an inline code block (no language specified)
                    if (!match) {
                      return (
                        <code 
                          className="px-1.5 py-0.5 rounded-md bg-qualia-secondary text-qualia-accent text-sm" 
                          {...props}
                        />
                      );
                    }
                    
                    // This is a block code element
                    return (
                      <div className="relative group my-4">
                        <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => copyToClipboard(codeText)}
                            className="p-1 bg-qualia-secondary rounded text-xs text-gray-400 hover:text-white"
                            title="Copy code"
                          >
                            <BookCopy className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                        <code 
                          className={`${className} block p-4 rounded-lg bg-qualia-darker border border-qualia-border overflow-x-auto`} 
                          {...props}
                        />
                      </div>
                    );
                  }
                }}
              >
                {displayedContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 
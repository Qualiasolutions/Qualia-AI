import { useState, FormEvent, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import { Search, Send, Globe, ArrowRight, Mic, Sparkles, Image } from 'lucide-react';

interface ChatInputProps {
  isLoading: boolean;
  onSubmit: (message: string) => void;
}

export default function ChatInput({ isLoading, onSubmit }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSubmit(input.trim());
    setInput('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 left-0 right-0 flex justify-center items-center px-4 pb-4 z-20"
    >
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-2xl pl-60 mx-auto"
      >
        <motion.div 
          animate={{ 
            boxShadow: isFocused 
              ? '0 0 0 2px rgba(0, 194, 203, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3)' 
              : '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
          transition={{ duration: 0.2 }}
          className={`relative flex items-center rounded-2xl overflow-hidden ${
            isFocused ? 'bg-qualia-inputbg border-qualia-accent/30' : 'bg-qualia-inputbg' 
          } border border-qualia-border glass`}
        >
          <div className="flex-1 relative">
            <TextareaAutosize
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask anything..."
              className="w-full py-3.5 pl-4 pr-12 focus:outline-none text-white resize-none bg-transparent"
              maxRows={5}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          
          <div className="flex items-center pr-3">
            <div className="flex items-center gap-1.5">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 text-gray-400 hover:text-white rounded-md transition-colors"
              >
                <Mic className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 text-gray-400 hover:text-white rounded-md transition-colors"
              >
                <Image className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 text-gray-400 hover:text-white rounded-md transition-colors"
              >
                <Globe className="w-5 h-5" />
              </motion.button>
              
              <div className="w-px h-6 bg-qualia-border mx-1"></div>
              
              <motion.button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-xl ${!input.trim() 
                  ? 'text-gray-500 cursor-not-allowed bg-qualia-secondary/30' 
                  : 'text-white bg-gradient-to-r from-qualia-primary to-qualia-accent hover:opacity-90'} transition-all duration-200`}
                whileHover={input.trim() ? { scale: 1.05 } : {}}
                whileTap={input.trim() ? { scale: 0.95 } : {}}
              >
                {isLoading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="mt-2 text-center text-xs text-gray-500"
        >
          <span>Powered by <span className="text-qualia-accent">Qualia Solutions</span> • Made with modern tools and techniques</span>
        </motion.div>
      </form>
    </motion.div>
  );
} 
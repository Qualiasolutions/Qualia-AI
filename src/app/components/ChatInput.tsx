import { useState } from 'react';
import { motion } from 'framer-motion';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (input: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSubmit, isLoading = false }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSubmit(input);
    setInput('');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 pl-60">
      <div className="mx-auto max-w-3xl px-4 pb-4">
        <motion.form 
          onSubmit={handleSubmit}
          className="relative"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full p-4 pr-12 rounded-xl bg-qualia-secondary/70 border border-qualia-border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-qualia-accent/50"
            disabled={isLoading}
          />
          
          <motion.button
            type="submit"
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg ${
              isLoading || !input.trim()
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-qualia-accent hover:bg-qualia-accent/20'
            } transition-all duration-200`}
            disabled={isLoading || !input.trim()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SendHorizontal className="w-5 h-5" />
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
} 
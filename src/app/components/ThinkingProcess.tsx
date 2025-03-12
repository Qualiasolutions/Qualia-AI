import { motion } from 'framer-motion';
import { ThinkingStep as ThinkingStepType } from '../types';
import { Bot } from 'lucide-react';

interface ThinkingProcessProps {
  steps: ThinkingStepType[];
  isComplete: boolean;
}

export default function ThinkingProcess({ steps, isComplete }: ThinkingProcessProps) {
  if (steps.length === 0 && !isComplete) {
    return (
      <div className="py-4">
        <div className="flex items-center mb-2">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-6 h-6 rounded-full bg-qualia-accent/30 flex items-center justify-center mr-2"
          >
            <Bot className="w-3 h-3 text-qualia-accent" />
          </motion.div>
          <span className="text-sm text-gray-400">Qualia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              className="w-2 h-2 bg-qualia-accent/80 rounded-full mr-1"
            />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
              className="w-2 h-2 bg-qualia-accent/80 rounded-full mr-1"
            />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
              className="w-2 h-2 bg-qualia-accent/80 rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  if (steps.length === 0 && isComplete) {
    return null;
  }

  return (
    <div className="py-4">
      <div className="flex items-center mb-2">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="w-6 h-6 rounded-full bg-qualia-accent/30 flex items-center justify-center mr-2"
        >
          <Bot className="w-3 h-3 text-qualia-accent" />
        </motion.div>
        <span className="text-sm text-gray-400">Qualia</span>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-gray-400 space-y-2"
      >
        {steps.map((step, index) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {step.content}
          </motion.div>
        ))}
        
        {!isComplete && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                className="w-2 h-2 bg-qualia-accent/80 rounded-full mr-1"
              />
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
                className="w-2 h-2 bg-qualia-accent/80 rounded-full mr-1"
              />
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
                className="w-2 h-2 bg-qualia-accent/80 rounded-full"
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
} 
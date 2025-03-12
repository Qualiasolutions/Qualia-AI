import { motion } from 'framer-motion';
import { SearchResult as SearchResultType } from '../types';
import { ExternalLink } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResultType[];
}

function SearchResultItem({ result, index }: { result: SearchResultType; index: number }) {
  return (
    <motion.a 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      href={result.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block px-4 py-3 rounded-lg hover:bg-qualia-secondary transition-all border border-transparent hover:border-qualia-border"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-qualia-accent flex-1">{result.title}</h3>
        <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
      </div>
      <p className="text-xs text-gray-500 mt-1 truncate">{result.url}</p>
      <p className="text-sm text-gray-400 mt-1.5">{result.snippet}</p>
    </motion.a>
  );
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-4 pt-4 border-t border-qualia-border"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-3 px-4"
      >
        <span className="text-sm text-gray-400">Sources</span>
      </motion.div>
      <div className="space-y-1">
        {results.map((result, index) => (
          <SearchResultItem key={index} result={result} index={index} />
        ))}
      </div>
    </motion.div>
  );
} 
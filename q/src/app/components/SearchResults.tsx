import { SearchResult } from '../types';
import { ExternalLink } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (!results.length) return null;

  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-sm font-medium text-qualia-text/60">Search Results</h3>
      <div className="grid gap-4">
        {results.map((result, index) => (
          <a
            key={index}
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg border border-qualia-border bg-qualia-secondary/20 hover:bg-qualia-secondary/30 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="font-medium text-qualia-accent truncate">{result.title}</h4>
              <ExternalLink className="w-4 h-4 text-qualia-text/60" />
            </div>
            <p className="text-sm text-qualia-text/80 line-clamp-2">{result.snippet}</p>
          </a>
        ))}
      </div>
    </div>
  );
} 
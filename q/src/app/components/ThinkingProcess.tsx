import { ThinkingStep } from '../types';
import { Search, Loader2, CheckCircle } from 'lucide-react';

interface ThinkingProcessProps {
  steps: ThinkingStep[];
  isComplete?: boolean;
}

export default function ThinkingProcess({ steps, isComplete = false }: ThinkingProcessProps) {
  return (
    <div className="space-y-2 mb-4">
      {steps.map((step) => (
        <div key={step.id} className="flex items-start gap-2 text-sm text-qualia-text/80">
          {step.type === 'thinking' && <Loader2 className="w-4 h-4 animate-spin" />}
          {step.type === 'search' && <Search className="w-4 h-4" />}
          {step.type === 'result' && <CheckCircle className="w-4 h-4 text-green-500" />}
          <p className="whitespace-pre-wrap">{step.content}</p>
        </div>
      ))}
      {steps.length === 0 && !isComplete && (
        <div className="flex items-start gap-2 text-sm text-qualia-text/80">
          <Loader2 className="w-4 h-4 animate-spin" />
          <p>Thinking...</p>
        </div>
      )}
    </div>
  );
}
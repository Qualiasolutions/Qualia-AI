import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] p-4 rounded-xl ${
        message.role === 'user' 
          ? 'bg-qualia-accent text-white' 
          : 'bg-qualia-secondary/20 border border-qualia-border text-white'
      }`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className="mt-2 text-xs opacity-50">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
} 
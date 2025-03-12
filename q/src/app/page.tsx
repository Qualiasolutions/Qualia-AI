'use client';

import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Brain, Star, Zap, Cpu } from 'lucide-react';
import Header from '@/app/components/Header';
import ChatInput from '@/app/components/ChatInput';
import Message from '@/app/components/Message';
import ThinkingProcess from '@/app/components/ThinkingProcess';
import SearchResults from '@/app/components/SearchResults';
import { Message as MessageType, ThinkingStep, SearchResult } from '@/app/types';
import api from '@/app/api/perplexity';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.warn('Supabase credentials not found. Chat history will not be persisted.');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on component mount
  useEffect(() => {
    if (supabase) {
      loadChatHistory();
    }
  }, []);

  const loadChatHistory = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        setMessages(data.map((msg: { 
          id: string; 
          role: 'user' | 'assistant'; 
          content: string; 
          timestamp: string; 
        }) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatMessage = async (message: MessageType) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('chat_history')
        .insert({
          id: message.id,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp.toISOString()
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinkingSteps]);

  const handleSubmit = async (input: string) => {
    if (!input.trim()) return;

    const userMessage: MessageType = {
      id: uuidv4(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    await saveChatMessage(userMessage);
    setIsLoading(true);
    setThinkingSteps([]);
    setSearchResults([]);

    try {
      const response = await api.search(input);

      const aiMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      await saveChatMessage(aiMessage);
      setSearchResults(response.searchResults);
    } catch (error) {
      const errorMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      await saveChatMessage(errorMessage);
      console.error('Error processing query:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Featured questions with icons
  const featuredQuestions = [
    {
      text: "Πες μου για τα προϊόντα καθαρισμού για επιχειρήσεις",
      icon: Star,
      color: "from-blue-500 to-cyan-600"
    },
    {
      text: "Ποια είναι τα καλύτερα χαρτικά για επαγγελματική χρήση;",
      icon: Zap,
      color: "from-amber-500 to-orange-600"
    },
    {
      text: "Σύγκρινε τα διαφορετικά προϊόντα καθαρισμού",
      icon: Brain,
      color: "from-emerald-500 to-teal-600"
    },
    {
      text: "Προτείνετε προϊόντα για βελτίωση της επιχειρηματικής παραγωγικότητας",
      icon: Cpu,
      color: "from-indigo-500 to-purple-600"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-qualia-dark">
      <Header />
      <main className="pl-60 flex-1 overflow-y-auto">
        <div className="flex justify-center items-start min-h-full">
          <div className="w-full max-w-3xl px-4 pb-40 pt-8">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
                <div className="text-center">
                  <div className="flex flex-col items-center mb-6 mx-auto">
                    <div className="w-24 h-24 rounded-2xl bg-black flex items-center justify-center text-white font-bold text-4xl shadow-glow mx-auto mb-4 overflow-hidden">
                      <Image 
                        src="/images/Untitled+design+-+2025-01-19T070746.544.png"
                        alt="Tzironis Logo"
                        width={64}
                        height={64}
                        priority
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          if (target) {
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.textContent = 'TZ';
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="w-48 h-2 bg-gradient-to-r from-qualia-primary to-qualia-accent rounded-full opacity-50" />
                  </div>
                  
                  <h1 className="text-5xl font-bold gradient-text mb-4">
                    Γεια σου Tzironis!
                  </h1>
                  
                  <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
                    Είμαι η Qualia, η προσωπική σου βοηθός. Τι θα ήθελες να αναζητήσουμε σήμερα;
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full max-w-2xl mx-auto">
                    {featuredQuestions.map(suggestion => (
                      <button
                        key={suggestion.text}
                        onClick={() => handleSubmit(suggestion.text)}
                        className="w-full p-4 text-left rounded-xl border border-qualia-border bg-qualia-secondary/20 hover:bg-qualia-secondary/40 text-white flex items-center gap-3 transition-all duration-300"
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${suggestion.color} flex items-center justify-center shadow-md`}>
                          <suggestion.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-medium">{suggestion.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    <Message message={message} />
                    {message.role === 'user' && messages[messages.length - 1].id === message.id && isLoading && (
                      <ThinkingProcess steps={thinkingSteps} isComplete={false} />
                    )}
                    {message.role === 'assistant' && messages[messages.length - 1].id === message.id && (
                      <SearchResults results={searchResults} />
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </main>
      <ChatInput isLoading={isLoading} onSubmit={handleSubmit} />
    </div>
  );
} 
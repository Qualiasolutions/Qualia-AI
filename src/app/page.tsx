'use client';

import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Brain, Star, Zap, Cpu } from 'lucide-react';
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import Message from './components/Message';
import ThinkingProcess from './components/ThinkingProcess';
import SearchResults from './components/SearchResults';
import { Message as MessageType, ThinkingStep, SearchResult } from './types';
import api from './api/perplexity';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
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

  const addThinkingStep = (step: Omit<ThinkingStep, 'id' | 'timestamp'>) => {
    const newStep: ThinkingStep = {
      ...step,
      id: uuidv4(),
      timestamp: new Date(),
    };
    setThinkingSteps((prev) => [...prev, newStep]);
  };

  const simulateThinking = async (query: string) => {
    // Reset thinking steps
    setThinkingSteps([]);
    
    // Initial thinking step
    addThinkingStep({
      content: `Analyzing your query: "${query}"`,
      type: 'thinking',
    });

    await new Promise((resolve) => setTimeout(resolve, 800));

    // Processing step
    addThinkingStep({
      content: `Processing information about "${query}"`,
      type: 'thinking',
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Search step
    addThinkingStep({
      content: `Searching the web for relevant information about "${query}"`,
      type: 'search',
    });

    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Analyzing results
    addThinkingStep({
      content: 'Analyzing search results',
      type: 'thinking',
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Found sources
    addThinkingStep({
      content: 'Found several reliable sources with information',
      type: 'result',
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Formulating response
    addThinkingStep({
      content: 'Formulating my response based on the gathered information',
      type: 'thinking',
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

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
      await simulateThinking(input);
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
      text: "Tell me about AI-powered solutions for business automation",
      icon: Star,
      color: "from-blue-500 to-cyan-600"
    },
    {
      text: "What are the best practices for implementing AI in business workflows?",
      icon: Zap,
      color: "from-amber-500 to-orange-600"
    },
    {
      text: "Compare different AI models for natural language processing",
      icon: Brain,
      color: "from-emerald-500 to-teal-600"
    },
    {
      text: "Suggest AI tools for improving business productivity",
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
                  <div className="mb-6 mx-auto">
                    <div className="w-24 h-24 rounded-2xl bg-black flex items-center justify-center text-white font-bold text-4xl shadow-glow mx-auto mb-4 overflow-hidden">
                      <Image 
                        src="/images/Untitled+design+-+2025-01-19T070746.544.png"
                        alt="Qualia Logo"
                        width={64}
                        height={64}
                        priority
                        onError={(e) => {
                          // Fallback to a text representation if image fails to load
                          const target = e.target as HTMLElement;
                          if (target) {
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.textContent = 'Q';
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="w-48 h-2 bg-gradient-to-r from-qualia-primary to-qualia-accent rounded-full mx-auto opacity-50" />
                  </div>
                  
                  <h1 className="text-5xl font-bold gradient-text mb-4">
                    Welcome to Qualia!
                  </h1>
                  
                  <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
                    I&apos;m your Qualia AI Assistant. How can I help you today?
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

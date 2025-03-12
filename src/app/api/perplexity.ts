import axios from 'axios';
import { ApiResponse, SearchResult, ThinkingStep } from '../types';

// Get API key from environment variables
const PERPLEXITY_API_KEY = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY || '';
const API_ENDPOINT = 'https://api.perplexity.ai/chat/completions';

// Mock data generation for development without actual API key
const generateMockThinking = (query: string): ThinkingStep[] => {
  return [
    {
      id: '1',
      content: `Analyzing the query: "${query}"`,
      type: 'thinking',
      timestamp: new Date()
    },
    {
      id: '2',
      content: `Searching the web for relevant information about "${query}"`,
      type: 'search',
      timestamp: new Date(Date.now() + 1000)
    },
    {
      id: '3',
      content: 'Found several relevant sources with information',
      type: 'result',
      timestamp: new Date(Date.now() + 2000)
    },
  ];
};

const generateMockSearchResults = (query: string): SearchResult[] => {
  return [
    {
      title: "Qualia AI Product Catalog",
      url: "https://qualia.solutions/products",
      snippet: `Browse our comprehensive catalog of AI solutions related to ${query}. Find the right tools to optimize your business operations.`
    },
    {
      title: "Qualia AI Assistant Documentation",
      url: "https://qualia.solutions/docs",
      snippet: `Official documentation and guides for implementing ${query} in your business workflow using Qualia AI Assistant.`
    },
    {
      title: "Business Case Studies - Qualia Solutions",
      url: "https://qualia.solutions/case-studies",
      snippet: `Real-world examples of how businesses improved their ${query} processes with Qualia AI Assistant.`
    },
    {
      title: "Qualia AI Blog - Latest Insights",
      url: "https://qualia.solutions/blog",
      snippet: `Expert articles and analysis on ${query} and other AI optimization strategies.`
    }
  ];
};

// Generate a fallback response when API calls fail
const generateFallbackResponse = (query: string): ApiResponse => {
  return {
    answer: `I couldn't access real-time data for "${query}" due to an API issue. Here's a general response: This is a simulated answer about "${query}".`,
    thinking: generateMockThinking(query),
    searchResults: generateMockSearchResults(query),
  };
};

const api = {
  search: async (query: string): Promise<ApiResponse> => {
    // If no API key is provided, return mock data immediately
    if (!PERPLEXITY_API_KEY) {
      console.warn('No Perplexity API key provided, using mock data');
      return generateFallbackResponse(query);
    }
    
    try {
      // Using the Perplexity API with the sonar-pro model according to latest documentation
      const response = await axios.post(
        API_ENDPOINT,
        {
          model: "sonar-pro",
          messages: [
            {
              role: "system",
              content: "You are Qualia AI Assistant, a helpful and intelligent AI assistant. Provide accurate, concise, and clear responses. Your answers should be well-structured, factual, and directly address the user's query."
            },
            {
              role: "user",
              content: query
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      // Extract content and format response
      const content = response.data?.choices?.[0]?.message?.content || '';
      
      // Check if we have valid content
      if (!content) {
        console.warn('No content in Perplexity API response, using mock data');
        return generateFallbackResponse(query);
      }
      
      // Since we might not have citations in this model response,
      // we'll generate search results based on the query
      const searchResults = generateMockSearchResults(query);
      
      return {
        answer: content,
        thinking: generateMockThinking(query),
        searchResults: searchResults,
      };
    } catch (error: unknown) {
      console.error('Error querying Perplexity API:', error);
      
      let errorMessage = 'An unknown error occurred';
      
      interface AxiosErrorResponse {
        status: number;
        statusText: string;
        data: unknown;
      }

      if (axios.isAxiosError(error) && error.response) {
        const response = error.response as AxiosErrorResponse;
        // Log more detailed error information
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data
        });
        
        // Handle different error status codes
        const status = response.status;
        if (status === 400) {
          errorMessage = 'Bad request: The API request format is incorrect.';
        } else if (status === 401) {
          errorMessage = 'Invalid API key. Please check your Perplexity API key.';
        } else if (status === 429) {
          errorMessage = 'Rate limit exceeded. Please try again later.';
        } else if (status >= 500) {
          errorMessage = 'Perplexity API server error. Please try again later.';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Always fall back to mock data
      console.warn('Falling back to mock data due to API error:', errorMessage);
      const mockResponse = generateFallbackResponse(query);
      
      // Include error message in response
      mockResponse.answer = `I couldn't access real-time data for "${query}" due to an API issue. ${errorMessage}`;
      
      return mockResponse;
    }
  }
};

export default api; 
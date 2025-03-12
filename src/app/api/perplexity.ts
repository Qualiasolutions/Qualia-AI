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
      title: "Tzironis Business Products Catalog",
      url: "https://tzironis.com/products",
      snippet: `Browse our comprehensive catalog of business solutions related to ${query}. Find the right tools to optimize your business operations.`
    },
    {
      title: "Tzironis Business Suite Documentation",
      url: "https://tzironis.com/docs",
      snippet: `Official documentation and guides for implementing ${query} in your business workflow using Tzironis Business Suite.`
    },
    {
      title: "Business Case Studies - Tzironis Solutions",
      url: "https://tzironis.com/case-studies",
      snippet: `Real-world examples of how businesses improved their ${query} processes with Tzironis Business Suite.`
    },
    {
      title: "Tzironis Business Blog - Latest Insights",
      url: "https://tzironis.com/blog",
      snippet: `Expert articles and analysis on ${query} and other business optimization strategies.`
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
              content: "You are Qualia Solutions, a helpful and intelligent AI assistant. Provide accurate, concise, and clear responses. Your answers should be well-structured, factual, and directly address the user's query."
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
    } catch (error: any) {
      console.error('Error querying Perplexity API:', error);
      
      let errorMessage = 'An unknown error occurred';
      if (axios.isAxiosError(error) && error.response) {
        // Log more detailed error information
        console.error('API Error Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
        
        // Handle different error status codes
        const status = error.response.status;
        if (status === 400) {
          errorMessage = 'Bad request: The API request format is incorrect.';
          console.error('Request payload that caused 400:', JSON.stringify({
            model: "sonar-pro", 
            messages: [
              {
                role: "system",
                content: "You are Qualia Solutions, a helpful and intelligent AI assistant. Provide accurate, concise, and clear responses. Your answers should be well-structured, factual, and directly address the user's query."
              },
              {
                role: "user",
                content: query
              }
            ],
            temperature: 0.7,
            max_tokens: 2000
          }));
        } else if (status === 401) {
          errorMessage = 'Invalid API key. Please check your Perplexity API key.';
        } else if (status === 429) {
          errorMessage = 'Rate limit exceeded. Please try again later.';
        } else if (status >= 500) {
          errorMessage = 'Perplexity API server error. Please try again later.';
        }
      } else if (error.request) {
        errorMessage = 'No response received from Perplexity API. Please check your internet connection.';
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
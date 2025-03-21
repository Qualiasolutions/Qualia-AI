import { SearchResult } from '../types';

const generateMockSearchResults = (query: string): SearchResult[] => {
  // Return business-relevant resources regardless of the query
  return [
    {
      title: `Tzironis Business Products Catalog`,
      url: `https://tzironis.gr/products`,
      snippet: `Browse our complete catalog of cleaning supplies, paper products, and professional cleaning equipment for businesses.`
    },
    {
      title: `Tzironis Business Solutions - Professional Cleaning Supplies`,
      url: `https://tzironis.gr/professional-cleaning`,
      snippet: `High-quality professional cleaning products and solutions for businesses of all sizes. Bulk ordering available.`
    },
    {
      title: `Tzironis Paper Products for Businesses`,
      url: `https://tzironis.gr/paper-products`,
      snippet: `Commercial-grade paper products including toilet paper, paper towels, napkins, and specialized paper products for businesses.`
    },
  ];
};

// Mock API response
const mockResponse = {
  answer: "Here's information about our business products and solutions...",
  searchResults: generateMockSearchResults("")
};

const api = {
  search: async (query: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return mockResponse;
  }
};

export default api; 
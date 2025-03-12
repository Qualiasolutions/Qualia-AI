# Qualia Solutions

A modern AI assistant powered by the Perplexity API using the sonar-pro model.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Key**
   Create a `.env.local` file in the root directory with your Perplexity API key:
   ```
   NEXT_PUBLIC_PERPLEXITY_API_KEY=your_api_key_here
   ```

3. **Running the Development Server**
   
   **Windows PowerShell:**
   ```
   .\run-dev.ps1
   ```
   
   **Windows Command Prompt:**
   ```
   start-dev.bat
   ```
   
   **Manual Start:**
   ```
   npm run dev
   ```

4. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Perplexity API Integration

This application uses the Perplexity AI `sonar-pro` model, which provides high-quality responses with a 200K token context length. The integration:

- Uses the Chat Completions API endpoint
- Implements proper error handling for API responses
- Falls back to mock data when API calls fail
- Maintains a conversational UI for seamless interaction

## Customization

- Modify the `sonar-pro` system prompt in `src/app/api/perplexity.ts`
- Adjust temperature and token settings in the API request
- Customize UI components in the `src/app/components` directory

## Troubleshooting

If you encounter issues with the Perplexity API:

1. Verify your API key in `.env.local`
2. Check console logs for detailed error messages
3. Ensure your API request format follows Perplexity's documentation
4. Verify your account has access to the `sonar-pro` model

## Resources

- Example files for Perplexity API usage are in the `public` directory:
  - `daily_knowledge_bot.py/ipynb`
  - `disease_qa_tutorial.py/ipynb`

## Features

- Modern, sleek UI with smooth animations
- Real-time "thinking" visualization
- Web search integration
- Code syntax highlighting
- Dark mode interface
- Responsive design

## Technologies

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Markdown rendering with syntax highlighting

## Project Structure

- `src/app/` - Main application code
  - `components/` - React components
  - `api/` - API integration
  - `types.ts` - TypeScript type definitions
  - `globals.css` - Global styles
  - `page.tsx` - Main page component

## Customization

You can customize the appearance by modifying:

- `tailwind.config.ts` - Theme colors and extensions
- `src/app/globals.css` - Global CSS styles

## License

MIT

---

Built with ❤️ using Perplexity API

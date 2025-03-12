# Qualia AI Assistant

A modern AI-powered assistant built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Perplexity API

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_PERPLEXITY_API_KEY=your_api_key_here
```

## Features

- 🤖 AI-powered conversations
- 🔍 Semantic search capabilities
- 💫 Smooth animations with Framer Motion
- 🎨 Modern UI with Tailwind CSS
- 📱 Fully responsive design
- 🌙 Dark mode support

## Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Create `.env.local` with required environment variables
4. Run `npm run dev` to start development server

## Deployment

This project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with `git push` to main branch

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── components/    # React components
│   ├── styles/        # Global styles
│   └── types/         # TypeScript types
├── public/            # Static assets
└── tests/            # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

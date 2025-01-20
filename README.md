# AI-Powered Travel Planner

Welcome to the AI-Powered Travel Planner! This application helps users plan their trips by providing personalized recommendations for places to visit, restaurants to try, and monuments to explore.

## Features

- 🔍 Search for destinations with smart suggestions
- 🍽️ Discover local restaurants and food experiences
- 🏛️ Explore monuments and historical sites
- 🌟 Get personalized recommendations
- 📱 Responsive design for all devices
- 🎨 Beautiful, modern UI with dark mode support
- 🔐 Google Authentication

## Tech Stack

- Next.js 13 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- NextAuth.js for authentication
- Lucide React icons

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your Google OAuth credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── api/
│   │   └── auth/
│   ├── auth/
│   │   └── signin/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── providers/
│   │   └── auth-provider.tsx
│   └── ui/
├── lib/
│   └── utils.ts
└── public/
```

## Authentication

The application uses NextAuth.js with Google OAuth for authentication. To set up authentication:

1. Create a Google Cloud Project
2. Configure OAuth consent screen
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google (development)
   - https://your-domain.com/api/auth/callback/google (production)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
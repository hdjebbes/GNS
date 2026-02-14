# GLOBAL NEXUS SOLUTIONS LLC - Corporate Website

A modern, multilingual corporate website built with React, TypeScript, and Tailwind CSS.

## Features

- 🌍 **Multilingual Support**: English, French, and Arabic with RTL support
- 🎨 **Modern UI**: Built with Tailwind CSS for a clean, responsive design
- 🚀 **React Router**: Client-side routing with proper URL management
- 📝 **Contact Form**: Integrated with Supabase for form submissions
- ♿ **Error Handling**: Comprehensive error boundary for graceful error management
- ✅ **Form Validation**: Real-time validation with user-friendly error messages
- 🔒 **Security**: Row Level Security (RLS) enabled on Supabase tables

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Supabase** - Backend and database
- **Lucide React** - Icons

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "project 3"
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Fill in your Supabase credentials in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run database migrations:
```bash
# Using Supabase CLI (if installed)
supabase db push

# Or manually run the migration file in your Supabase dashboard
# File: supabase/migrations/20251219201008_create_contact_submissions.sql
```

6. **(Production)** Deploy the contact Edge Function so the contact form works in production:
```bash
# Install Supabase CLI: https://supabase.com/docs/guides/cli
# Log in and link your project, then:
supabase functions deploy contact

# Set secrets in Supabase Dashboard > Edge Functions > contact > Secrets (or via CLI):
# - RESEND_API_KEY (optional, for email notifications)
```
If the function is not deployed, the form will show an error and suggest emailing you directly.

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
project 3/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── ErrorBoundary.tsx
│   ├── contexts/         # React contexts
│   │   └── LanguageContext.tsx
│   ├── i18n/            # Translations
│   │   └── translations.ts
│   ├── lib/             # Utilities and configurations
│   │   └── supabase.ts
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── Sectors.tsx
│   │   ├── Contact.tsx
│   │   ├── Legal.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── supabase/
│   ├── functions/       # Edge Functions (e.g. contact form)
│   │   └── contact/
│   └── migrations/      # Database migrations
└── public/              # Static assets
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## Database Schema

The application uses a single table `contact_submissions` to store form submissions:

- `id` (uuid) - Primary key
- `name` (text) - Submitter's name
- `email` (text) - Email address
- `message` (text) - Message content
- `language` (text) - Language code (en, fr, ar)
- `created_at` (timestamptz) - Submission timestamp
- `ip_address` (text, optional) - IP address for spam protection
- `user_agent` (text, optional) - Browser user agent

Row Level Security (RLS) is enabled:
- Public can INSERT submissions
- Only authenticated users (admins) can READ submissions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Copyright © 2024 GLOBAL NEXUS SOLUTIONS LLC. All rights reserved.

## Support

For support, contact:
- Email: k_messaoud@hotmail.com
- Phone: +968 79924362


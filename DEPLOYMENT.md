# Cadence Deployment Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/api-keys)

## Environment Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Deployment Platforms

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add `OPENAI_API_KEY` to Environment Variables
4. Deploy

### Other Platforms (Netlify, Railway, Render)

1. Set build command: `npm run build`
2. Set start command: `npm start`
3. Add `OPENAI_API_KEY` environment variable
4. Configure Node.js version: 18+

## Environment Variables

### Required
- `OPENAI_API_KEY` - Your OpenAI API key (required for AI features)

### Optional
- `NODE_ENV` - Set to `production` for production deployments (auto-set by most platforms)

## Project Structure

```
/app
  /onboarding          # Multi-step onboarding flow
  /dashboard           # Mission plan dashboard
  /benefits-scanner    # Benefits discovery tool
  /housing-finder      # Housing search tool
  /mos-translator      # MOS to civilian job translator
  /api
    /guide             # AI mission plan generation
    /scan-benefits     # Benefits scanning API
    /translate-mos     # MOS translation API
    /housing           # Housing search API
/lib                   # Utilities, types, schemas
/components            # Reusable UI components
/data                  # Static data (MOS crosswalks, BLS salaries, housing)
```

## Features

- **Onboarding Flow** - 9-step guided veteran transition assessment
- **AI Mission Planning** - Personalized checklists with OpenAI GPT-4
- **Benefits Scanner** - Federal, state, county, and nonprofit benefits discovery
- **NCO Guidance System** - Behavioral nudges for critical actions (discharge upgrades, disability claims, VA healthcare, GI Bill, VA loans, TSP)
- **MOS Career Explorer** - Military-to-civilian job translation with local salary data
- **Housing Finder** - Veteran-friendly apartment/home search
- **Dashboard** - Task management with progress tracking

## Data Sources

- O*NET MOS crosswalk (Army, Navy, Air Force)
- BLS wage data (CA, MS, TX, FL, NY, VA)
- ZIP to state/metro mapping
- Housing listings (demo data)

## Performance

- Static generation where possible
- API routes for dynamic AI features
- Client-side state with Zustand (persisted to localStorage)
- Optimized builds with Next.js 15

## Security Notes

- Never commit `.env.local` or API keys to version control
- API key validation in all OpenAI routes
- Rate limiting recommended for production (use Vercel Edge Config or similar)
- CORS handled by Next.js API routes

## Support

For issues or questions, refer to project documentation or contact the development team.

## License

Private - Not for redistribution

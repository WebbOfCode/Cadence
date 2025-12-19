# Cadence - Veteran Transition Tool

A production-grade web application helping veterans transition to civilian life with personalized AI-powered mission plans.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **Zod** for validation
- **react-hook-form** for form handling
- **OpenAI API** for intelligent mission planning

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Then add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
/app
  /onboarding          # Multi-step onboarding flow
    /components        # Step components
    page.tsx           # Main onboarding page
  /dashboard           # Personalized mission dashboard
    page.tsx
  /housing-finder      # Apartment & Home Finder
    page.tsx
  /api
    /guide             # AI mission plan generation
      route.ts
    /housing           # Housing search API
      route.ts
/lib
  types.ts             # TypeScript interfaces
  schemas.ts           # Zod validation schemas
  utils.ts             # Utility functions
  useOnboardingStore.ts # Zustand state management
/styles
  globals.css          # Global styles
```

## Features

### Onboarding Flow
- 9-step guided process
- Input validation with Zod
- Smooth animations with Framer Motion
- Progress tracking
- Mobile-responsive design

### AI Mission Planning
- Personalized transition checklists
- Branch and MOS-specific guidance
- Timeline-based task prioritization
- VA benefits integration
- Local resource recommendations

### Dashboard
- Task management with completion tracking
- Priority filtering
- Progress visualization
- Deadline tracking
- Clean, athletic design

### Housing Finder
- Veteran-friendly apartment and home search
- Filter by location, budget, bedrooms, pet-friendly, accessibility, and voucher support
- Results prioritized by affordability and match
- Route: `/housing-finder`

## Design Philosophy

Inspired by Nike Training Club:
- Clean white + black theme
- Bold, confident typography
- Subtle, purposeful motion
- Mobile-first responsive layout
- Large, accessible input fields

## API Routes

### POST `/api/guide`

Generates personalized transition mission plan.

**Request Body:**
```json
{
  "name": "John Smith",
  "etsDate": "2025-06-15",
  "branch": "Army",
  "mos": "11B",
  "goal": "career",
  "location": "Austin, TX",
  "disabilityClaim": true,
  "giBill": false
}
```

**Response:**
```json
{
  "veteranName": "John Smith",
  "etsDate": "2025-06-15",
  "overview": "Personalized transition overview...",
  "tasks": [
    {
      "id": "task-1",
      "title": "Enroll in VA healthcare",
      "description": "Complete enrollment...",
      "category": "healthcare",
      "deadline": "2025-05-15",
      "priority": "high",
      "completed": false
    }
  ],
  "generatedAt": "2025-01-15T10:00:00.000Z"
}
```

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)

## License

Private - Not for redistribution

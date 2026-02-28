# Cadence - Veteran Transition Tool

A production-grade web application helping veterans transition to civilian life with personalized AI-powered mission plans.

## Tech Stack

- **Next.js 15** (App Router with Turbopack)
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management (with localStorage persistence)
- **Zod** for validation
- **react-hook-form** for form handling
- **OpenAI API** for intelligent mission planning

---

## Quick Start

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file** (copy from `.env.example`):
   ```bash
   cp .env.example .env.local
   ```

3. **Add your OpenAI API key** to `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```
   Get your API key from: https://platform.openai.com/api-keys

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### NPM Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run TypeScript linting
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

---

## Project Structure

```
/app
  /onboarding              # Multi-step veteran assessment (11 steps)
    /components            # Individual step components
    page.tsx               # Main onboarding page
  /dashboard               # Mission plan dashboard & task manager
    /components
      EditGoalsModal.tsx    # Reconstruct mission plan modal
      TaskDetailDrawer.tsx  # Task detail panel
    page.tsx
  /benefits-scanner        # Federal/state benefits discovery
    page.tsx
  /housing-finder          # Veteran-friendly housing search
    page.tsx
  /mos-translator          # MOS career explorer with salary, certs, resume bullets
    page.tsx
  /api
    /guide                 # POST: AI mission plan generation
    /scan-benefits         # POST: Benefits discovery API
    /translate-mos         # POST: MOS translation API
    /housing               # GET: Housing search API
  layout.tsx               # Root layout
  page.tsx                 # Home page
/lib
  types.ts                 # TypeScript interfaces for all data
  schemas.ts               # Zod validation schemas
  utils.ts                 # Utility functions
  useOnboardingStore.ts    # Zustand state store (persisted)
  mosData.ts               # MOS data loaders
  mosHelpers.ts            # MOS translation helpers
  rankData.ts              # Military rank data by branch
  categoryIcons.tsx        # Task category icons
/components
  Header.tsx               # Navigation header with logo & menu
  BranchSwitcher.tsx       # Branch selection component
  ThemeProvider.tsx        # Theme setup
  ui/                      # Shadcn UI components
/data
  bls_oes_state.csv        # BLS wage data for states
  housing_listings.json    # Sample housing data
  onet_crosswalk.csv       # O*NET MOS crosswalk
  zip_state.csv            # ZIP code to state mapping
/styles
  globals.css              # Global TailwindCSS styles
/public
  branch-logos/            # Military branch logos
```

---

## Core Features

### 1. Onboarding Flow (11 Steps)
- Name, ETS date, branch, MOS
- Primary goal selection (career, education, housing, finance, wellness)
- Secondary goals and location
- VA disability claim & GI Bill status
- Discharge type & codes
- Awards & decorations tracking
- Real-time validation with visual feedback
- Mobile-responsive design

### 2. AI-Powered Mission Planning
- **Smart Task Generation** - OpenAI GPT-4 generates personalized transition checklists
- **Context-Aware** - Uses branch, MOS, discharge status, and personal goals
- **Behavioral Nudges** - NCO Guidance system for critical items:
  - Discharge upgrade requests (for non-honorable discharges)
  - VA healthcare enrollment (within 180 days of ETS)
  - VA disability claims filing
  - GI Bill education benefits
  - VA loan COE requests
  - TSP rollover planning
- **Actionable Steps** - Each task includes numbered steps with real resources and contact info

### 3. Dashboard & Task Management
- **Search & Filter** - Find tasks by keyword or priority (high/medium/low)
- **Task Details** - View full descriptions, deadlines, steps, and category
- **Progress Tracking** - Visual progress bars for completion percentage
- **Personal Notes** - Add/edit notes for each task, automatically saved
- **Task Completion** - Mark tasks and individual steps as complete
- **Export to JSON** - Download entire mission plan for offline access or sharing

### 4. Benefits Scanner
- Discover federal, state, county, and nonprofit benefits
- Search by keyword or category
- Veteran-specific benefit eligibility

### 5. Housing Finder
- Search veteran-friendly apartments and homes
- Filter by location, budget, bedrooms
- Pet-friendly, accessibility, and voucher support options
- Results sorted by affordability match

### 6. MOS Career Explorer
- Translate military MOS to civilian job equivalents
- View civilian job titles and descriptions
- Access real-time salary data (BLS)
- State-specific wage information
- Job qualifications and certifications

---

## API Routes

### POST `/api/guide`
Generates personalized transition mission plan.

**Request:**
```json
{
  "name": "Jane Smith",
  "etsDate": "2025-06-15",
  "branch": "Navy",
  "mos": "3414",
  "goal": "career",
  "disabilityClaim": true,
  "giBill": true,
  "dischargeType": "honorable",
  "hasAwards": true,
  "awards": ["Navy Commendation Medal"],
  "location": "San Diego, CA"
}
```

**Response:**
```json
{
  "veteranName": "Jane Smith",
  "etsDate": "2025-06-15",
  "overview": "Personalized transition overview based on your background...",
  "tasks": [
    {
      "id": "task-1",
      "title": "Enroll in VA healthcare",
      "description": "Complete VA healthcare enrollment...",
      "category": "healthcare",
      "deadline": "2025-05-15",
      "priority": "high",
      "completed": false,
      "steps": ["Step 1...", "Step 2...", ...],
      "notes": ""
    }
  ],
  "generatedAt": "2025-01-15T10:00:00.000Z"
}
```

### Other API Endpoints
- `POST /api/scan-benefits` - Discover benefits based on veteran profile
- `POST /api/translate-mos` - Translate military MOS to civilian equivalents with salary data
- `GET /api/housing` - Get veteran-friendly housing listings with filters

---

## Design Philosophy

Inspired by modern military training apps:
- **Clean, Confident Design** - White + black + green accent colors
- **Bold Typography** - Large, readable headings and labels
- **Purposeful Motion** - Smooth transitions but instant feedback
- **Mobile-First** - Fully responsive on all devices
- **Accessibility** - High contrast, large touch targets, semantic HTML

---

## Data Sources

- **O*NET Crosswalk** - Military to civilian job mappings (Army, Navy, Air Force)
- **BLS Wage Data** - State-specific average wages and salary projections
- **Housing Data** - Demo listings with veteran-friendly amenities
- **ZIP Code Database** - State and metro area classification

---

## State Management

Uses **Zustand** for persistent client-side state:
- Onboarding progress and data
- Generated mission plan and tasks
- Task completion status and notes
- All data automatically saved to localStorage
- Survives page refreshes and browser restarts

---

## Deployment

### Prerequisites
- Node.js v18+
- OpenAI API key

### Build for Production
```bash
npm run build
npm start
```

### Recommended Platforms
- **Vercel** (recommended, Next.js native)
- Netlify
- Railway
- Render

### Environment Setup
Set these on your hosting platform:
- `OPENAI_API_KEY` - Your API key
- `NODE_ENV` - Set to `production`

---

## Usage Tips

### Getting the Most Out of Cadence

1. **Complete Full Onboarding** - More detailed info = better mission plan
2. **Use Personal Notes** - Track communications, dates, and important details
3. **Start with High Priority** - Focus on critical tasks with early deadlines
4. **Check Deadlines Weekly** - Some VA benefits have time-sensitive deadlines
5. **Export Your Plan** - Save a copy to share with VSOs or mentors

### Task Categories
- **Admin** - Official paperwork (DD-214, discharge upgrade, etc.)
- **Healthcare** - VA healthcare and medical services
- **Career** - Job search and civilian job transition
- **Education** - GI Bill and educational benefits
- **Housing** - Home search and VA loan information
- **Finance** - TSP rollover, budgeting, VA benefits financing
- **Wellness** - Mental health, fitness, and family support

### Search Tips
- Search by task title or description
- Filter by priority level
- Combine search + filters for targeted results
- Use category names in search (e.g., search "career" for all career tasks)

---

## Security & Privacy

- **Local Storage** - Mission plans stored locally in your browser only
- **No Account Required** - Works without login or authentication
- **API Key Security** - Only used server-side for API calls
- **Export for Backup** - Download your plan anytime as JSON file
- **Data Deletion** - Clear browser data to remove all stored information

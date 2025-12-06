# Cadence Architecture

## System Overview

Cadence is a veteran transition tool built as a production Next.js application with three core components:

1. **Onboarding Flow** - Multi-step form collecting veteran data
2. **AI Guide API** - OpenAI-powered mission plan generation
3. **Dashboard** - Interactive task management interface

## Data Flow

```
User Input → Onboarding → Zustand Store → API Route → OpenAI → Mission Plan → Dashboard
```

### 1. Onboarding Flow

**Path:** `/app/onboarding/page.tsx`

The onboarding system uses a step-based wizard pattern:

- **State Management**: Zustand with localStorage persistence
- **Validation**: Zod schemas + react-hook-form per-step validation
- **Navigation**: Controlled step transitions with validation gates
- **Animation**: Framer Motion for slide transitions and progress bar

**Step Components:**
- Each step is isolated and reusable
- Props-based callbacks for navigation (`onNext`, `onBack`)
- Form validation blocks progression until valid
- Data is incrementally stored in Zustand on each step completion

**Why this approach:**
- Single responsibility per component
- Easy to add/remove/reorder steps
- Type-safe data flow through Zustand
- Smooth UX with controlled animations

### 2. Global State (Zustand)

**Path:** `/lib/useOnboardingStore.ts`

Central store manages:
- Current onboarding step index
- Partial onboarding data (progressively populated)
- Generated mission plan
- Step navigation functions

**Persistence:**
- Uses Zustand's `persist` middleware
- Stored in localStorage as `cadence-onboarding`
- Survives page refreshes
- Can be reset on logout/completion

**Why Zustand:**
- Lightweight (no Context boilerplate)
- TypeScript-first
- Built-in persistence
- Minimal re-renders

### 3. AI Guide API

**Path:** `/app/api/guide/route.ts`

Production-grade API route that:

**Input Processing:**
1. Validates incoming JSON with Zod schemas
2. Calculates timeline (days until ETS)
3. Builds rich context string for AI

**AI Generation:**
1. Calls OpenAI Chat Completions API (GPT-4 Turbo)
2. Uses structured system prompt for consistency
3. Enforces JSON response format
4. Temperature: 0.7 for balanced creativity

**Output Structuring:**
1. Parses AI response JSON
2. Adds task IDs, completion status
3. Validates output against mission plan schema
4. Returns typed, validated JSON

**Error Handling:**
- Zod validation errors → 400 with details
- OpenAI errors → 500 with message
- All errors logged server-side

**Why this design:**
- Input/output validation prevents bad data
- Structured prompts = predictable AI output
- JSON mode ensures parseable responses
- Type safety end-to-end

### 4. Mission Planning Logic

The AI generates tasks based on:

**Veteran-Specific Context:**
- Branch/MOS (military occupational specialty)
- Days until ETS (urgency/timeline)
- Primary goal (career, education, housing, etc.)
- Location (local resources)
- VA disability claim intent
- GI Bill usage

**Task Categories:**
- `admin` - DD-214, records, paperwork
- `healthcare` - VA enrollment, disability claims
- `career` - Resume, job search, networking
- `education` - GI Bill, school applications
- `housing` - VA home loan, relocation
- `finance` - Budget, benefits, TSP
- `wellness` - Mental health, fitness, community

**Task Prioritization:**
- `high` - Time-sensitive, required (TAP, healthcare enrollment)
- `medium` - Important but flexible timeline
- `low` - Beneficial but optional

**Real Examples (Not Placeholders):**
- "Schedule TAP counseling at least 90 days before ETS"
- "Request certified copy of DD-214 (Member 4) at separation"
- "Gather service medical records and buddy statements for disability claim"
- "Create targeted resume translating 11B infantry experience to operations management"
- "Apply to veteran hiring programs at Amazon, Union Pacific, JPMorgan Chase"

### 5. Dashboard

**Path:** `/app/dashboard/page.tsx`

Interactive mission control interface:

**Features:**
- Real-time progress tracking (X/Y tasks completed)
- Visual progress bar
- Priority filtering (all/high/medium/low)
- Click-to-toggle task completion
- Deadline display
- Category badges
- Days-until-ETS countdown

**UX Patterns:**
- Completed tasks fade and get strikethrough
- Stats cards at top (ETS countdown, progress, goal)
- Large clickable task cards
- Responsive grid layout
- Smooth animations on load/interactions

**State Management:**
- Reads from Zustand store
- Local state for task completion toggles
- Redirect to onboarding if no mission plan exists

### 6. Type System

**Files:** `/lib/types.ts`, `/lib/schemas.ts`

**Strategy:**
- **Types** for internal TypeScript usage
- **Schemas** for runtime validation (Zod)
- Inferred types from schemas where possible
- Shared across client and API

**Key Types:**
- `OnboardingData` - User input from onboarding
- `MissionPlan` - Complete AI-generated plan
- `MissionTask` - Individual actionable task
- `MilitaryBranch`, `TransitionGoal` - Enums as union types

**Benefits:**
- Compile-time safety
- Runtime validation
- Single source of truth
- Auto-complete in IDE

## Design System

**Inspiration:** Nike Training Club, Strava, Apple Health

**Colors:**
- Primary: Black (`#000000`)
- Background: White (`#FFFFFF`)
- Accent: Gray shades for hierarchy
- Semantic: Red (high priority), Yellow (medium), Green (low)

**Typography:**
- Font: Inter (clean, modern sans-serif)
- Sizes: Large headlines (text-5xl, text-6xl)
- Weight: Bold for emphasis, medium for body
- Tracking: Tight for headlines, wide for labels

**Components:**
- Large input fields (px-6 py-4)
- Border-first design (2px borders)
- Hover states on interactive elements
- Rounded corners (rounded-lg)
- Minimal shadows
- High contrast for accessibility

**Motion:**
- Framer Motion for all animations
- Slide transitions between steps (20px offset)
- Progress bar width animation
- Staggered list item reveals (50ms delay per item)
- No bounce or spring physics (professional, not playful)

## Performance Considerations

**Client-Side:**
- Code splitting via Next.js App Router
- Dynamic imports for heavy components
- Lazy loading images (if added later)
- Memoized expensive computations

**Server-Side:**
- API route caching headers (if applicable)
- OpenAI request timeout handling
- Streaming responses for long generations (future)

**State:**
- Zustand: minimal re-renders
- localStorage: efficient persistence
- Selective component updates

## Security

**API Route:**
- Server-side only (API key never exposed)
- Input validation with Zod
- Rate limiting (add middleware if needed)
- CORS configured through Next.js

**Data:**
- No PII sent to browser localStorage
- Mission plans generated on-demand
- No authentication yet (add later)

## Deployment Checklist

1. Set `OPENAI_API_KEY` in production env
2. Run `npm run build` to validate
3. Test onboarding flow end-to-end
4. Verify API route with real OpenAI key
5. Check mobile responsiveness
6. Validate analytics integration (if added)
7. Set up error monitoring (Sentry/similar)

## Future Enhancements

**Phase 2:**
- User authentication (Clerk, Auth0, or custom)
- Database persistence (Postgres + Prisma)
- Task editing/custom tasks
- Deadline reminders via email/SMS
- PDF export of mission plan
- Progress sharing with mentors

**Phase 3:**
- Resource library (articles, videos)
- Community forum for veterans
- Mentor matching system
- Integration with VA APIs
- Mobile app (React Native)

## Development Workflow

1. **Local Setup:**
   ```bash
   npm install
   npm run dev
   ```

2. **Environment:**
   - Create `.env.local` with OpenAI key
   - Test with mock data first

3. **Testing:**
   - Manual testing of each step
   - API route testing with Postman/curl
   - Validation schema testing

4. **Building:**
   ```bash
   npm run build
   npm start
   ```

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, font, metadata |
| `app/page.tsx` | Home page redirect logic |
| `app/onboarding/page.tsx` | Main onboarding orchestrator |
| `app/onboarding/components/*.tsx` | Individual step components |
| `app/dashboard/page.tsx` | Mission control interface |
| `app/api/guide/route.ts` | AI generation endpoint |
| `lib/useOnboardingStore.ts` | Global state management |
| `lib/types.ts` | TypeScript interfaces |
| `lib/schemas.ts` | Zod validation schemas |
| `lib/utils.ts` | Helper functions |
| `styles/globals.css` | TailwindCSS base styles |

---

**Built with production standards. No AI boilerplate. Real veteran transition support.**

# Nike Design System Implementation Guide

## 🎯 Overview
Complete Nike-inspired design system with global application, reusable components, and integrated bug reporting.

## 📦 Components Created

### Nike Component Library (`components/Nike/`)
1. **NikeButton** - Reusable button with variants
   - Variants: primary, secondary, outline-white, outline-black, white
   - Sizes: sm, md, lg
   - Features: rounded-full, hover:scale-105, disabled states

2. **NikeHeadline** - Typographic hierarchy component
   - Levels: h1, h2, h3, h4
   - Features: font-black, uppercase, tracking-tighter, leading-none
   - Auto-sized per responsive breakpoints

3. **NikeCard** - Full-bleed image cards with overlays
   - Features: Image overlays, numbered labels, text positioning
   - Responsive aspect ratios (4/3 desktop, square mobile)

4. **NikeSection** - Consistent section wrapper
   - Features: Consistent padding (py-32), max-width container
   - Options: darkMode, fullBleed

### Bug Report Feature (`components/`)
1. **BugReportButton** - Floating action button
   - Position: fixed bottom-right (bottom-8 right-8)
   - Icon: Lucide Bug icon
   - Hover: scale-110

2. **BugReportModal** - Form modal with accessibility
   - Fields: Description, Page URL (auto-filled), Screenshot upload, Email
   - Features: Focus trap, ESC to close, keyboard navigation
   - Success state: 3-second auto-close confirmation

3. **API Route** (`app/api/report-bug/route.ts`)
   - Handles form submissions
   - Validates required fields
   - Ready for EmailJS/Sendgrid integration

## 🎨 Global CSS Additions

### Spacing Standards
- `.section-spacing` - py-24 md:py-32 lg:py-40
- `.section-spacing-sm` - py-16 md:py-20
- `.section-spacing-lg` - py-32 md:py-40 lg:py-48

### Grid Utilities
- `.grid-7-5` - Asymmetric 7-5 split (large feature on left)
- `.grid-8-4` - Asymmetric 8-4 split

### Animation Presets
- `@keyframes slideUp/Down/Left/Right` - Direction-based animations
- `.animate-slide-*` - Ready-to-use animation classes
- Cubic-bezier easing: [0.16, 1, 0.3, 1]

### Interaction States
- `.hover-lift` - Translate up on hover
- `.hover-scale` - Scale 105% on hover
- `.image-zoom` - Image scales 110% on container hover

### Accessibility
- `.sr-only` - Screen reader only text
- `:focus-visible` states - Black outline with offset

## 🔧 Integration Steps

### 1. Root Layout (✅ DONE)
BugReportButton globally added to app/layout.tsx

### 2. Using Nike Components
```tsx
import { NikeButton, NikeHeadline, NikeCard, NikeSection } from '@/components/Nike';

// In your page:
<NikeSection>
  <NikeHeadline level="h2">Section Title</NikeHeadline>
  <div className="grid-7-5">
    <NikeCard title="Feature 1" number="01">...</NikeCard>
    <NikeCard title="Feature 2" number="02">...</NikeCard>
  </div>
</NikeSection>
```

### 3. Button Usage
```tsx
<NikeButton variant="primary" size="lg">
  Get Started
</NikeButton>

<NikeButton variant="outline-white">
  Learn More
</NikeButton>
```

## 📱 Responsive Behavior

### Mobile (< 768px)
- Headlines: text-4xl → text-6xl
- Section padding: py-16
- Grids: Single column stack
- Buttons: Full width (except inline link styles)

### Tablet (768px - 1024px)
- Headlines: text-5xl → text-6xl
- Section padding: py-24
- Grids: 2-column (asymmetric splits stay)
- Cards: Aspect ratio 4/3

### Desktop (> 1024px)
- Headlines: Full sizing (text-7xl - text-9xl)
- Section padding: py-32-40
- Grids: Asymmetric 7-5 / 8-4 splits
- Cards: Full featured layout with overlays

## 🐛 Bug Report Feature Details

### Floating Button
- **Position**: `fixed bottom-8 right-8 z-40`
- **Size**: `w-14 h-14` (circular)
- **Icon**: Lucide `Bug` icon (24px)
- **Hover**: `scale-110` transition

### Modal Form
- **Mobile**: Slides up from bottom
- **Desktop**: Centered modal (max-w-md)
- **Fields**:
  - Description (textarea, required, min 10 chars ideally)
  - Page URL (auto-filled from window.location.href)
  - Screenshot (optional, image/* accept)
  - Email (optional, for follow-up)

### Accessibility Features
- Focus trap (Tab cycles within modal)
- ESC key closes modal
- ARIA labels: role="dialog", aria-labelledby, aria-describedby
- Keyboard navigable form
- Focus visible styles

### Submission Flow
1. User fills form
2. Validates description field
3. Sends POST to `/api/report-bug`
4. Shows success message
5. Auto-closes after 3 seconds
6. Resets form

## 🔌 EmailJS Setup (Optional Enhancement)

To send emails to help@demarickwebb.dev:

```javascript
// Install: npm install @emailjs/browser
import emailjs from '@emailjs/browser';

// Initialize in your component
emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);

// Update BugReportModal.tsx to send emails instead of API
```

Environment variables needed:
```
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
NEXT_EMAILJS_SERVICE_ID=your_service_id
NEXT_EMAILJS_TEMPLATE_ID=your_template_id
```

## 📋 Checklist for Pages to Update

- [ ] `app/page.tsx` - HomePage (partially updated)
- [ ] `app/dashboard/page.tsx` - Dashboard
- [ ] `app/onboarding/page.tsx` - Onboarding
- [ ] `app/benefits-scanner/page.tsx` - Features
- [ ] `app/housing-finder/page.tsx` - Housing
- [ ] `app/support-groups/page.tsx` - Support
- [ ] `app/mos-translator/page.tsx` - MOS Tool
- [ ] Auth pages (login/signup if exists)
- [ ] Profile/Settings pages

## 🧪 Testing Checklist

- [ ] Bug report button visible on all pages
- [ ] Modal opens/closes properly
- [ ] Keyboard navigation works
- [ ] ESC closes modal
- [ ] Form submission to /api/report-bug
- [ ] Responsive on mobile/tablet/desktop
- [ ] Header scroll detection still works
- [ ] All buttons have proper hover states
- [ ] Focus visible outlines appear on keyboard nav
- [ ] Nike components render correctly

## 🚀 Future Enhancements

1. EmailJS integration for email delivery
2. Analytics tracking for bug reports
3. Bug report dashboard for admins
4. Image compression for screenshots
5. Rate limiting on bug submissions
6. User authentication for bug tracking
7. Bug status updates via email
8. Duplicate bug detection

## 📝 Notes

- All components use Tailwind CSS (no external UI libraries required)
- Fully accessible (WCAG 2.1 AA standard targeted)
- Mobile-first responsive design
- Animation performance optimized with will-change
- Compatible with Next.js 15.4.8
- Uses Framer Motion for complex animations
- Lucide React for all icons


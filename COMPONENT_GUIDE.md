# Nike Design System - Component & Implementation Guide

## 🎨 Common Usage Patterns

### Pattern 1: Hero Section
```tsx
<section className="hero-section">
  <div className="hero-content">
    <NikeHeadline level="h1" className="mb-8">
      YOUR MISSION CONTINUES
    </NikeHeadline>
    <p className="text-white/90 max-w-3xl mx-auto mb-12">
      Your subtitle text here.
    </p>
    <motion.div className="flex gap-4">
      <NikeButton variant="primary" size="lg">
        Primary CTA <ArrowRight className="ml-2" />
      </NikeButton>
      <NikeButton variant="outline-white" size="lg">
        Secondary CTA
      </NikeButton>
    </motion.div>
  </div>
</section>
```

### Pattern 2: Feature Grid Section
```tsx
<NikeSection>
  <NikeHeadline level="h2" className="mb-20">
    Our Features
  </NikeHeadline>
  
  <div className="grid-7-5">
    <NikeCard title="Large Feature" number="01" image="/hero.jpg">
      <p>Feature description here</p>
    </NikeCard>
    <NikeCard title="Feature 2" number="02" image="/feature.jpg" />
  </div>
</NikeSection>
```

### Pattern 3: Content Section
```tsx
<NikeSection darkMode>
  <div className="grid-8-4">
    <div>
      <NikeHeadline level="h2">Resources</NikeHeadline>
      <p className="text-gray-300 mt-6">Description...</p>
    </div>
  </div>
</NikeSection>
```

## 🔘 Button Variants

- `primary` - Black bg, white text (main CTAs)
- `secondary` - White outline, hover inverts
- `outline-white` - Transparent, white border
- `outline-black` - Transparent, black border
- `white` - Solid white

## 🚀 Quick Start New Page

```tsx
'use client';

import { NikeButton, NikeHeadline, NikeSection } from '@/components/Nike';

export default function NewPage() {
  return (
    <>
      <NikeSection>
        <NikeHeadline level="h2">Title</NikeHeadline>
      </NikeSection>

      <NikeSection darkMode>
        <NikeButton variant="white">Start Now</NikeButton>
      </NikeSection>
    </>
  );
}
```

## 📍 Files Created

- `components/Nike/NikeButton.tsx` - Button component
- `components/Nike/NikeHeadline.tsx` - Headline component  
- `components/Nike/NikeCard.tsx` - Card component
- `components/Nike/NikeSection.tsx` - Section wrapper
- `components/Nike/index.ts` - Barrel export
- `components/BugReportButton.tsx` - Floating bug button
- `components/BugReportModal.tsx` - Bug report form
- `app/api/report-bug/route.ts` - Bug API endpoint
- `NIKE_DESIGN_SYSTEM.md` - Full documentation

## ✅ What's Implemented

✅ Reusable Nike components (Button, Headline, Card, Section)  
✅ Bug report feature (floating button + modal form)  
✅ Global design system CSS utilities  
✅ Responsive grid systems (7-5 and 8-4 splits)  
✅ Animation presets and scroll reveals  
✅ Accessibility features (focus states, focus trap, ARIA)  
✅ Global BugReportButton in root layout  
✅ API endpoint for bug submissions  
✅ Zero compilation errors  

## 🔌 Next Steps

1. **Apply to other pages**: Dashboard, Onboarding, Resources
2. **Integrate EmailJS** (optional): For real bug email delivery
3. **Test bug button**: Submit a test report
4. **Verify responsive**: Mobile, tablet, desktop views
5. **Update nav links**: Ensure all pages use same header

See NIKE_DESIGN_SYSTEM.md for complete documentation.


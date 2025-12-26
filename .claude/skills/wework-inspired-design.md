# WeWork-Inspired Design Skill

Create distinctive, production-grade frontend interfaces with a WeWork-inspired design aesthetic - clean, modern, and welcoming with a professional edge.

## Design Philosophy

Craft interfaces that feel:
- **Professional yet approachable**: Clean layouts with warm, inviting colors
- **Spacious and breathable**: Generous whitespace and clear visual hierarchy
- **Modern and bold**: Strong typography with confident color choices
- **Human-centered**: Friendly, accessible, and intuitive

## Core Design System

### Color Palette

**Primary Colors:**
- Warm Coral: `#FF6B35` - Primary CTA and key accents
- Sunset Orange: `#F7931E` - Secondary accents
- Deep Navy: `#1E3A5F` - Primary text and headers
- Charcoal: `#2C3E50` - Body text

**Neutral Scale:**
- Pure White: `#FFFFFF` - Main backgrounds
- Light Gray: `#F8F9FA` - Secondary backgrounds
- Medium Gray: `#E9ECEF` - Borders and dividers
- Soft Gray: `#6C757D` - Muted text

**Semantic Colors:**
- Success Green: `#00D26A` - Positive states
- Alert Red: `#FF4757` - Warnings/errors
- Info Blue: `#3498DB` - Informational

### Typography

**Font Stack:**
```css
/* Primary - Korean */
font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

/* Fallback - English */
font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
```

**Type Scale:**
- Hero (Display): 64px / 4rem - 800 weight, -0.02em tracking
- H1: 48px / 3rem - 700 weight, -0.01em tracking
- H2: 36px / 2.25rem - 700 weight, normal tracking
- H3: 28px / 1.75rem - 600 weight
- H4: 24px / 1.5rem - 600 weight
- Body Large: 18px / 1.125rem - 400 weight, 1.6 line-height
- Body: 16px / 1rem - 400 weight, 1.5 line-height
- Body Small: 14px / 0.875rem - 400 weight
- Caption: 12px / 0.75rem - 400 weight

**Typography Principles:**
- Line height: 1.5-1.6 for readability
- Letter spacing: Slightly tight for headlines (-0.01em to -0.02em)
- Font weights: Bold headlines (700-800), regular body (400), medium for emphasis (500-600)

### Layout & Spacing

**Grid System:**
- Container max-width: 1280px
- Columns: 12-column grid
- Gutter: 24px (mobile), 32px (tablet), 48px (desktop)
- Section padding: 80px vertical (mobile), 120px (tablet+)

**Spacing Scale (Tailwind-based):**
- xs: 4px / 0.25rem
- sm: 8px / 0.5rem
- md: 16px / 1rem
- lg: 24px / 1.5rem
- xl: 32px / 2rem
- 2xl: 48px / 3rem
- 3xl: 64px / 4rem
- 4xl: 96px / 6rem

**Spacing Philosophy:**
- Generous whitespace between sections (3xl-4xl)
- Comfortable breathing room in components (lg-xl)
- Grouped elements use smaller spacing (sm-md)

### UI Components

**Buttons:**
```css
/* Primary Button */
background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
padding: 14px 32px;
border-radius: 12px;
font-size: 16px;
font-weight: 600;
box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);
transition: all 0.3s ease;

/* Hover */
transform: translateY(-2px);
box-shadow: 0 6px 16px rgba(255, 107, 53, 0.35);

/* Secondary Button */
background: transparent;
border: 2px solid #1E3A5F;
color: #1E3A5F;
```

**Cards:**
```css
background: #FFFFFF;
border-radius: 16px;
padding: 32px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
transition: all 0.3s ease;

/* Hover */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
transform: translateY(-4px);
```

**Inputs:**
```css
border: 2px solid #E9ECEF;
border-radius: 10px;
padding: 12px 16px;
font-size: 16px;
transition: border-color 0.2s;

/* Focus */
border-color: #FF6B35;
outline: none;
box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
```

### Visual Elements

**Border Radius:**
- Small elements (buttons, inputs): 10-12px
- Cards: 16px
- Large sections: 20-24px
- Circular: 50% / 9999px

**Shadows:**
- Subtle: `0 2px 8px rgba(0, 0, 0, 0.06)`
- Medium: `0 4px 16px rgba(0, 0, 0, 0.08)`
- Elevated: `0 8px 24px rgba(0, 0, 0, 0.12)`
- Accent glow: `0 4px 20px rgba(255, 107, 53, 0.25)`

**Animations:**
- Transitions: 0.3s ease for most interactions
- Micro-interactions: 0.2s ease for quick feedback
- Page transitions: 0.5s ease-in-out
- Use subtle transforms (translateY, scale) for depth

## Implementation Guidelines

### 1. Setup Typography

```typescript
// Add to layout.tsx or global CSS
import { Pretendard } from '@next/font/google';

const pretendard = Pretendard({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-pretendard',
});

// If using CDN:
// <link rel="stylesheet" as="style" crossorigin
//       href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
```

### 2. Color System in Tailwind

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: '#FF6B35',
          light: '#FF8A5C',
          dark: '#E65520',
        },
        orange: {
          DEFAULT: '#F7931E',
          light: '#FFB347',
          dark: '#E67E00',
        },
        navy: {
          DEFAULT: '#1E3A5F',
          light: '#2C4F7C',
          dark: '#152B47',
        },
        charcoal: '#2C3E50',
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'Pretendard', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'input': '10px',
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'coral-glow': '0 4px 20px rgba(255, 107, 53, 0.25)',
      },
    },
  },
};
```

### 3. Component Patterns

**Hero Section:**
- Large, bold typography (Hero or H1 size)
- Warm coral gradient for CTA buttons
- Generous padding (4xl vertical)
- Optional: Subtle background pattern or gradient

**Content Cards:**
- White background with subtle shadow
- 16px border radius
- Hover effect: lift and increase shadow
- Clear visual hierarchy with typography

**Navigation:**
- Clean, minimal design
- Sticky or fixed positioning
- Logo on left, menu on right
- Mobile: hamburger menu with smooth transitions

**Call-to-Action:**
- Coral gradient primary buttons
- Use sparingly for maximum impact
- Clear, action-oriented text
- Sufficient padding for easy clicking

### 4. Responsive Design

```css
/* Mobile First Approach */
/* xs: < 640px (default) */
padding: 16px;
font-size: 14px;

/* sm: 640px+ */
@media (min-width: 640px) {
  padding: 24px;
  font-size: 16px;
}

/* md: 768px+ */
@media (min-width: 768px) {
  padding: 32px;
}

/* lg: 1024px+ */
@media (min-width: 1024px) {
  padding: 48px;
}

/* xl: 1280px+ */
@media (min-width: 1280px) {
  padding: 64px;
}
```

### 5. Accessibility

- Maintain WCAG AA contrast ratios (minimum 4.5:1 for text)
- Use semantic HTML elements
- Include proper ARIA labels
- Keyboard navigation support
- Focus visible states with coral accent

## Design Principles

1. **Clarity Over Complexity**: Keep interfaces simple and intuitive
2. **Generous Spacing**: Let content breathe with ample whitespace
3. **Bold Typography**: Use large, confident type for headers
4. **Warm Professionalism**: Balance corporate polish with human warmth
5. **Purposeful Color**: Use coral/orange accents strategically, not everywhere
6. **Smooth Interactions**: All transitions should feel natural and intentional
7. **Mobile-First**: Design for small screens, enhance for larger ones

## Examples

### Hero Section
```tsx
<section className="relative bg-gradient-to-br from-white to-gray-50 py-20 md:py-32">
  <div className="container mx-auto px-4 max-w-6xl">
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-navy mb-6 tracking-tight">
      굿모닝 <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral to-orange">월가</span>
    </h1>
    <p className="text-xl md:text-2xl text-charcoal/80 mb-8 max-w-2xl leading-relaxed">
      매일 아침, 미국 주식 시장의 핵심을 한눈에
    </p>
    <button className="bg-gradient-to-r from-coral to-orange text-white px-8 py-4 rounded-button font-semibold text-lg shadow-coral-glow hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
      지금 시작하기
    </button>
  </div>
</section>
```

### Stock Card
```tsx
<div className="bg-white rounded-card p-8 shadow-subtle hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-2xl font-bold text-navy">AAPL</h3>
    <span className="text-lg font-semibold text-green">+2.5%</span>
  </div>
  <p className="text-charcoal/70 mb-6 leading-relaxed">
    Apple Inc.
  </p>
  <div className="h-40 mb-4">
    {/* Chart component */}
  </div>
  <button className="w-full border-2 border-navy text-navy py-3 rounded-button font-medium hover:bg-navy hover:text-white transition-all duration-300">
    상세 보기
  </button>
</div>
```

## Key Differentiators

This design system is inspired by WeWork's aesthetic but maintains originality through:
- Custom color combinations (coral-orange gradient vs WeWork's specific blue)
- Unique spacing ratios and component proportions
- Korean typography optimization with Pretendard
- Different shadow and border radius values
- Original component patterns and layouts

The result: A professional, modern interface that evokes WeWork's warm professionalism while remaining distinctly unique.

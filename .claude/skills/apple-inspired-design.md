# Apple-Inspired Design Skill

Create distinctive, production-grade frontend interfaces with an Apple-inspired design aesthetic - minimalist, elegant, and premium with exceptional attention to detail.

## Design Philosophy

Craft interfaces that feel:
- **Minimalist yet powerful**: Clean layouts with purposeful use of whitespace
- **Premium and refined**: Sophisticated typography and subtle interactions
- **Intuitive and seamless**: Effortless user experience with smooth transitions
- **Focused and clear**: Strong visual hierarchy with minimal distractions

## Core Design System

### Color Palette

**Primary Colors:**
- Pure White: `#FFFFFF` - Primary backgrounds
- Deep Black: `#1D1D1F` - Primary text and headers
- Space Gray: `#86868B` - Secondary text and subtle elements

**Accent Colors:**
- Apple Blue: `#0071E3` - Primary CTAs and links
- Vivid Blue: `#0077ED` - Hover states
- Dark Blue: `#0066CC` - Active states

**Neutral Scale:**
- Ultra Light: `#FBFBFD` - Subtle background variations
- Light Gray: `#F5F5F7` - Secondary backgrounds, cards
- Medium Gray: `#D2D2D7` - Borders and dividers
- Dark Gray: `#424245` - Muted text
- Near Black: `#1D1D1F` - Main text

**Semantic Colors:**
- Success Green: `#34C759` - Positive states
- Warning Orange: `#FF9500` - Caution
- Error Red: `#FF3B30` - Errors and alerts

### Typography

**Font Stack:**
```css
/* SF Pro Display for headlines - Apple's signature font */
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;

/* Fallback for Korean */
font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Pretendard Variable', system-ui, sans-serif;
```

**Type Scale:**
- Hero (Display): 80px / 5rem - 700 weight, -0.015em tracking
- H1: 64px / 4rem - 700 weight, -0.01em tracking
- H2: 48px / 3rem - 600 weight, -0.008em tracking
- H3: 40px / 2.5rem - 600 weight, -0.005em tracking
- H4: 32px / 2rem - 600 weight, normal tracking
- Large: 24px / 1.5rem - 400 weight, 1.4 line-height
- Body: 17px / 1.0625rem - 400 weight, 1.47 line-height (Apple's standard)
- Small: 14px / 0.875rem - 400 weight, 1.42 line-height
- Caption: 12px / 0.75rem - 400 weight, 1.33 line-height

**Typography Principles:**
- Line height: 1.4-1.5 for optimal readability
- Letter spacing: Tight for large headlines (-0.01em to -0.015em), normal for body
- Font weights: Semibold/bold headlines (600-700), regular body (400), medium for emphasis (500)
- Use system fonts for native feel and performance

### Layout & Spacing

**Grid System:**
- Container max-width: 1440px (wider for more premium feel)
- Columns: 12-column grid with flexible gutters
- Gutter: 20px (mobile), 40px (tablet), 60px (desktop)
- Section padding: 60px vertical (mobile), 100px (tablet), 140px (desktop)

**Spacing Scale:**
- 2xs: 2px / 0.125rem
- xs: 4px / 0.25rem
- sm: 8px / 0.5rem
- md: 12px / 0.75rem
- base: 16px / 1rem
- lg: 24px / 1.5rem
- xl: 32px / 2rem
- 2xl: 48px / 3rem
- 3xl: 64px / 4rem
- 4xl: 96px / 6rem
- 5xl: 128px / 8rem
- 6xl: 160px / 10rem

**Spacing Philosophy:**
- Exceptional whitespace - more is often better (4xl-6xl between major sections)
- Asymmetric spacing for visual interest
- Consistent rhythm within component groups (base-lg)
- Use breathing room to create premium feel

### UI Components

**Buttons:**
```css
/* Primary Button (Apple Blue) */
background: #0071E3;
padding: 12px 24px;
border-radius: 980px; /* Apple's pill-shaped buttons */
font-size: 17px;
font-weight: 400;
color: #FFFFFF;
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
border: none;

/* Hover */
background: #0077ED;
transform: scale(1.02);

/* Active */
background: #0066CC;

/* Secondary Button (Outlined) */
background: transparent;
border: 1px solid #0071E3;
color: #0071E3;

/* Ghost Button (Text only) */
background: transparent;
color: #0071E3;
padding: 12px 16px;
font-weight: 400;
```

**Cards:**
```css
background: #FFFFFF;
border-radius: 18px; /* Apple uses larger radius */
padding: 40px;
border: 1px solid rgba(0, 0, 0, 0.04);
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

/* Hover - very subtle */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
transform: translateY(-2px);
```

**Inputs:**
```css
border: 1px solid #D2D2D7;
border-radius: 12px;
padding: 14px 16px;
font-size: 17px;
background: #FBFBFD;
transition: all 0.2s ease;

/* Focus */
border-color: #0071E3;
outline: none;
box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
background: #FFFFFF;
```

### Visual Elements

**Border Radius:**
- Buttons: 980px (pill-shaped)
- Small components: 12px
- Cards: 18px
- Large sections: 24px
- Images: 12-18px
- Circular: 50%

**Shadows:**
- Minimal: `0 2px 8px rgba(0, 0, 0, 0.03)`
- Subtle: `0 4px 16px rgba(0, 0, 0, 0.04)`
- Medium: `0 8px 24px rgba(0, 0, 0, 0.08)`
- Elevated: `0 12px 32px rgba(0, 0, 0, 0.12)`
- Hero: `0 20px 60px rgba(0, 0, 0, 0.15)`

**Animations:**
- Standard easing: `cubic-bezier(0.4, 0, 0.2, 1)` - Apple's signature easing
- Fast interactions: 0.2s - Quick feedback
- Standard transitions: 0.3-0.4s - Smooth, polished
- Complex animations: 0.6s - Deliberate, premium
- Use subtle scale and opacity changes
- Avoid aggressive transforms

**Blur & Glass Effects:**
```css
/* Apple's frosted glass effect */
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
```

## Implementation Guidelines

### 1. Setup Typography

```typescript
// Add to layout.tsx or global CSS
// Use system fonts for native Apple feel
const config = {
  fontFamily: {
    sans: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Apple SD Gothic Neo',
      'Pretendard Variable',
      'SF Pro Display',
      'SF Pro Text',
      'system-ui',
      'sans-serif'
    ],
  },
};

// For web fonts alternative:
// import { Inter } from 'next/font/google';
// const inter = Inter({ subsets: ['latin'], display: 'swap' });
```

### 2. Color System in Tailwind

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#0071E3',
          'blue-hover': '#0077ED',
          'blue-active': '#0066CC',
          gray: '#86868B',
          'gray-light': '#F5F5F7',
          'gray-medium': '#D2D2D7',
          'gray-dark': '#424245',
          black: '#1D1D1F',
        },
        success: '#34C759',
        warning: '#FF9500',
        error: '#FF3B30',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['80px', { lineHeight: '1.05', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display': ['64px', { lineHeight: '1.08', letterSpacing: '-0.01em', fontWeight: '700' }],
        'xxl': ['48px', { lineHeight: '1.1', letterSpacing: '-0.008em', fontWeight: '600' }],
        'xl': ['40px', { lineHeight: '1.1', letterSpacing: '-0.005em', fontWeight: '600' }],
        'lg': ['24px', { lineHeight: '1.4', fontWeight: '400' }],
        'body': ['17px', { lineHeight: '1.47', fontWeight: '400' }],
      },
      borderRadius: {
        'apple': '12px',
        'apple-lg': '18px',
        'apple-button': '980px',
      },
      boxShadow: {
        'apple-minimal': '0 2px 8px rgba(0, 0, 0, 0.03)',
        'apple-subtle': '0 4px 16px rgba(0, 0, 0, 0.04)',
        'apple-medium': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'apple-elevated': '0 12px 32px rgba(0, 0, 0, 0.12)',
        'apple-hero': '0 20px 60px rgba(0, 0, 0, 0.15)',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        'apple': '20px',
      },
    },
  },
};
```

### 3. Component Patterns

**Hero Section:**
- Massive, bold typography (Hero size: 80px+)
- Minimal text, maximum impact
- Clean Apple Blue CTAs
- Generous vertical spacing (6xl)
- Often includes high-quality product imagery or video

**Product Cards:**
- White background with minimal shadow
- 18px border radius for premium feel
- Large, high-quality images
- Clear, concise copy
- Subtle hover effects (2px lift max)

**Navigation:**
- Ultra-clean, minimal design
- Frosted glass effect (backdrop-blur)
- Sticky positioning
- Logo centered or left-aligned
- Smooth dropdown animations
- Mobile: full-screen overlay menu

**Call-to-Action:**
- Apple Blue primary buttons (pill-shaped)
- Use sparingly - one primary CTA per section
- Clear, concise action text ("Buy", "Learn more", "Shop")
- Sufficient padding and touch targets (min 44px height)

**Link Styling:**
```css
color: #0071E3;
text-decoration: none;
transition: opacity 0.2s;

/* Hover */
opacity: 0.8;
```

### 4. Responsive Design

```css
/* Mobile First - Apple's approach */
/* xs: < 640px (default) */
.hero {
  font-size: 40px;
  padding: 40px 20px;
}

/* sm: 640px+ */
@media (min-width: 640px) {
  .hero {
    font-size: 56px;
    padding: 60px 40px;
  }
}

/* md: 768px+ */
@media (min-width: 768px) {
  .hero {
    font-size: 64px;
    padding: 80px 48px;
  }
}

/* lg: 1024px+ */
@media (min-width: 1024px) {
  .hero {
    font-size: 80px;
    padding: 100px 60px;
  }
}

/* xl: 1280px+ */
@media (min-width: 1280px) {
  .hero {
    font-size: 96px;
    padding: 140px 80px;
  }
}
```

### 5. Accessibility

- WCAG AAA contrast ratios where possible (7:1 for text)
- Semantic HTML5 elements
- Comprehensive ARIA labels and roles
- Full keyboard navigation support
- Focus states with Apple Blue accent ring
- Reduced motion support: `prefers-reduced-motion`
- Color contrast: #1D1D1F on #FFFFFF = 16.1:1 (excellent)

## Design Principles

1. **Less is Exponentially More**: Remove until it hurts, then remove one more thing
2. **Spacious by Design**: Whitespace is a premium design element, not empty space
3. **Typography First**: Large, confident type creates hierarchy without decoration
4. **Subtle Refinement**: Details matter - shadows, radius, easing all contribute to premium feel
5. **Purposeful Color**: Use color sparingly for maximum impact
6. **Performance Matters**: Smooth 60fps animations, optimized assets, system fonts
7. **Content is King**: Design serves content, never overshadows it
8. **Consistency**: Establish patterns and stick to them religiously

## Examples

### Hero Section
```tsx
<section className="relative bg-white py-16 md:py-24 lg:py-32 xl:py-40">
  <div className="container mx-auto px-6 md:px-12 max-w-7xl">
    <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-apple-black mb-6 tracking-tight leading-tight">
      굿모닝 <span className="text-apple-blue">월가</span>
    </h1>
    <p className="text-xl md:text-2xl lg:text-3xl text-apple-gray mb-10 max-w-3xl leading-snug font-normal">
      매일 아침, 미국 주식 시장의 핵심을 한눈에
    </p>
    <div className="flex flex-col sm:flex-row gap-4">
      <button className="bg-apple-blue text-white px-8 py-3.5 rounded-apple-button font-normal text-lg hover:bg-apple-blue-hover hover:scale-[1.02] transition-all duration-300 ease-apple">
        지금 시작하기
      </button>
      <button className="border border-apple-blue text-apple-blue px-8 py-3.5 rounded-apple-button font-normal text-lg hover:bg-apple-blue hover:text-white transition-all duration-300 ease-apple">
        자세히 알아보기
      </button>
    </div>
  </div>
</section>
```

### Stock Card
```tsx
<div className="bg-white rounded-apple-lg p-8 md:p-10 shadow-apple-subtle hover:shadow-apple-medium hover:-translate-y-0.5 transition-all duration-400 ease-apple border border-apple-gray-light/50">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-3xl font-semibold text-apple-black">AAPL</h3>
    <span className="text-xl font-medium text-success">+2.5%</span>
  </div>
  <p className="text-apple-gray text-lg mb-8 leading-relaxed">
    Apple Inc.
  </p>
  <div className="h-48 mb-8 rounded-apple overflow-hidden">
    {/* Chart component */}
  </div>
  <a
    href="#"
    className="inline-flex items-center text-apple-blue text-lg hover:opacity-80 transition-opacity duration-200"
  >
    상세 보기
    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </a>
</div>
```

### Navigation with Frosted Glass
```tsx
<nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-apple border-b border-apple-gray-light/50">
  <div className="container mx-auto px-6 max-w-7xl">
    <div className="flex items-center justify-between h-14">
      <div className="text-xl font-semibold text-apple-black">굿모닝 월가</div>
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-apple-black hover:opacity-60 transition-opacity duration-200 text-sm">
          대시보드
        </a>
        <a href="#" className="text-apple-black hover:opacity-60 transition-opacity duration-200 text-sm">
          브리핑
        </a>
        <a href="#" className="text-apple-black hover:opacity-60 transition-opacity duration-200 text-sm">
          종목
        </a>
        <button className="bg-apple-blue text-white px-5 py-2 rounded-apple-button text-sm hover:bg-apple-blue-hover transition-colors duration-200">
          로그인
        </button>
      </div>
    </div>
  </div>
</nav>
```

### Gradient Text (Apple Style)
```tsx
<h2 className="text-6xl font-bold">
  <span className="bg-gradient-to-r from-apple-blue via-purple-500 to-pink-500 bg-clip-text text-transparent">
    새로운 경험
  </span>
</h2>
```

## Key Differentiators from Apple.com

This design system is inspired by Apple's aesthetic but maintains originality through:
- Adapted color palette (keeping Apple Blue but different supporting colors)
- Korean-optimized typography with Pretendard fallback
- Custom spacing scale tailored for this specific use case
- Original component compositions and layouts
- Unique content presentation patterns
- Different animation timings and easing curves
- Custom shadow and blur values

The result: A minimalist, premium interface that evokes Apple's refined elegance while remaining distinctly unique and optimized for the "굿모닝 월가" brand and Korean audience.

## Performance Tips

1. **Use system fonts** - Instant load, native feel
2. **Optimize images** - WebP format, lazy loading, responsive images
3. **Minimize shadows** - Use CSS shadows sparingly for better performance
4. **Hardware acceleration** - Use `transform` and `opacity` for animations
5. **Debounce interactions** - Smooth scroll and resize handlers
6. **Code splitting** - Load components on demand
7. **CSS-in-JS optimization** - Use static extraction when possible

## Dark Mode Support

```css
/* Apple's dark mode approach */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #000000;
    --bg-secondary: #1C1C1E;
    --text-primary: #F5F5F7;
    --text-secondary: #86868B;
    --accent: #0A84FF; /* Brighter blue for dark mode */
    --border: #38383A;
  }
}
```

```tsx
// In components
className="bg-white dark:bg-black text-apple-black dark:text-apple-gray-light"
```

# NexusOS Component Architecture V2
## Agent Omega (Systems Architect) + Agent Aesthetic (Design Systems)

**Status:** Design Complete - Ready for Implementation  
**Date:** February 4, 2026  
**Branch:** designerv2

---

## ARCHITECTURE PRINCIPLES

### 1. Single Source of Truth
- One component library file per section type
- All variants in the same file (easier maintenance)
- Centralized style definitions

### 2. Predictable Data Flow
```
User Input (Modal) 
  → Sanitize & Validate 
  → Update State (DataContext) 
  → Component Receives Props 
  → Render with Styles
```

### 3. Style Prop Contract
```typescript
interface TypographyStyle {
  fontFamily: string;      // "font-inter", "font-playfair", etc.
  fontSize: string;        // "text-4xl", "text-lg", etc.
  fontWeight: string;      // "font-bold", "font-normal", etc.
  color: string;           // "text-white", "text-gray-900", etc.
  lineHeight?: string;     // "leading-tight", "leading-relaxed", etc.
  letterSpacing?: string;  // "tracking-wide", "tracking-normal", etc.
}

interface SectionStyle {
  heading?: TypographyStyle;
  subheading?: TypographyStyle;
  body?: TypographyStyle;
  button?: ButtonStyle;
  background?: BackgroundStyle;
  spacing?: SpacingStyle;
}
```

### 4. Component Responsibilities
- **Accept styles via props** (never hardcode)
- **Apply styles to final rendered elements** (not wrapper divs)
- **Provide sensible defaults** (works without styles prop)
- **Never mutate props** (immutable data flow)

---

## FILE STRUCTURE

```
components/
├── sections/
│   ├── HeroSections.tsx        (8 variants: Centered, Split, Video, etc.)
│   ├── HeaderSections.tsx      (5 variants: Standard, Centered, Mega, etc.)
│   ├── FooterSections.tsx      (4 variants: Standard, Minimal, Newsletter, etc.)
│   ├── FeatureSections.tsx     (6 variants: Grid, Alternating, Cards, etc.)
│   ├── ContentSections.tsx     (4 variants: Text, Image+Text, Quote, etc.)
│   ├── CTASections.tsx         (3 variants: Banner, Split, Centered)
│   └── SocialSections.tsx      (2 variants: Icons, Feed)
│
├── primitives/
│   ├── Text.tsx                (Base text component with style props)
│   ├── Heading.tsx             (Semantic heading component)
│   ├── Button.tsx              (Button with variants)
│   ├── Image.tsx               (Optimized image component)
│   └── Container.tsx           (Responsive container)
│
└── editor/
    ├── EditableText.tsx        (Inline editing wrapper)
    ├── EditableImage.tsx       (Image upload/edit wrapper)
    └── SectionControls.tsx     (Move, delete, duplicate controls)
```

---

## COMPONENT PATTERNS

### Pattern 1: Primitive Components (Foundation)

**Purpose:** Reusable, atomic components that handle style application correctly.

**Example: Text.tsx**
```typescript
interface TextProps {
  children: React.ReactNode;
  style?: TypographyStyle;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

export const Text: React.FC<TextProps> = ({ 
  children, 
  style, 
  className = '',
  as: Component = 'p' 
}) => {
  const classes = [
    style?.fontFamily || 'font-inter',
    style?.fontSize || 'text-base',
    style?.fontWeight || 'font-normal',
    style?.color || 'text-gray-900',
    style?.lineHeight,
    style?.letterSpacing,
    className
  ].filter(Boolean).join(' ');

  return <Component className={classes}>{children}</Component>;
};
```

**Example: Heading.tsx**
```typescript
interface HeadingProps {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  style?: TypographyStyle;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ 
  children, 
  level, 
  style,
  className = '' 
}) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  const defaultSizes = {
    1: 'text-5xl',
    2: 'text-4xl',
    3: 'text-3xl',
    4: 'text-2xl',
    5: 'text-xl',
    6: 'text-lg'
  };
  
  const classes = [
    style?.fontFamily || 'font-inter',
    style?.fontSize || defaultSizes[level],
    style?.fontWeight || 'font-bold',
    style?.color || 'text-gray-900',
    style?.lineHeight,
    style?.letterSpacing,
    className
  ].filter(Boolean).join(' ');

  return <Component className={classes}>{children}</Component>;
};
```

---

### Pattern 2: Editable Wrappers (Editor Mode)

**Purpose:** Wrap primitive components to enable inline editing.

**Example: EditableText.tsx**
```typescript
interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  style?: TypographyStyle;
  placeholder?: string;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  style,
  placeholder = 'Enter text...',
  as: Component = 'p',
  className = ''
}) => {
  const classes = [
    style?.fontFamily || 'font-inter',
    style?.fontSize || 'text-base',
    style?.fontWeight || 'font-normal',
    style?.color || 'text-gray-900',
    style?.lineHeight,
    style?.letterSpacing,
    className
  ].filter(Boolean).join(' ');

  return (
    <Component
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent || '')}
      className={classes}
    >
      {value || placeholder}
    </Component>
  );
};
```

---

### Pattern 3: Section Components (Composable Layouts)

**Purpose:** Combine primitives into complete sections with multiple variants.

**Example: HeroSections.tsx**
```typescript
interface HeroProps {
  variant: 'centered' | 'split' | 'video' | 'minimal' | 'fullscreen' | 'overlay' | 'animated' | 'gradient';
  content: {
    heading: string;
    subheading?: string;
    body?: string;
    cta?: { text: string; href: string; };
    image?: string;
    video?: string;
  };
  style?: SectionStyle;
  editMode?: boolean;
  onUpdate?: (content: any) => void;
}

export const HeroSection: React.FC<HeroProps> = ({
  variant,
  content,
  style,
  editMode = false,
  onUpdate
}) => {
  // Render different layouts based on variant
  switch (variant) {
    case 'centered':
      return <HeroCentered content={content} style={style} editMode={editMode} onUpdate={onUpdate} />;
    case 'split':
      return <HeroSplit content={content} style={style} editMode={editMode} onUpdate={onUpdate} />;
    // ... other variants
  }
};

// Individual variant components
const HeroCentered: React.FC<HeroProps> = ({ content, style, editMode, onUpdate }) => {
  const HeadingComponent = editMode ? EditableText : Heading;
  const TextComponent = editMode ? EditableText : Text;

  return (
    <section className="relative py-20 px-4">
      <Container className="text-center max-w-4xl mx-auto">
        <HeadingComponent
          level={1}
          style={style?.heading}
          value={content.heading}
          onChange={(heading) => onUpdate?.({ ...content, heading })}
        >
          {content.heading}
        </HeadingComponent>
        
        {content.subheading && (
          <TextComponent
            style={style?.subheading}
            className="mt-6"
            value={content.subheading}
            onChange={(subheading) => onUpdate?.({ ...content, subheading })}
          >
            {content.subheading}
          </TextComponent>
        )}
        
        {content.body && (
          <TextComponent
            style={style?.body}
            className="mt-4"
            value={content.body}
            onChange={(body) => onUpdate?.({ ...content, body })}
          >
            {content.body}
          </TextComponent>
        )}
        
        {content.cta && (
          <Button
            href={content.cta.href}
            style={style?.button}
            className="mt-8"
          >
            {content.cta.text}
          </Button>
        )}
      </Container>
    </section>
  );
};
```

---

## TYPOGRAPHY SYSTEM

### Font Families (Tailwind Classes)
```typescript
export const FONT_FAMILIES = {
  inter: 'font-inter',
  playfair: 'font-playfair',
  roboto: 'font-roboto',
  montserrat: 'font-montserrat',
  lora: 'font-lora',
  poppins: 'font-poppins',
  opensans: 'font-opensans',
  raleway: 'font-raleway',
} as const;
```

### Font Sizes (Tailwind Classes)
```typescript
export const FONT_SIZES = {
  xs: 'text-xs',      // 12px
  sm: 'text-sm',      // 14px
  base: 'text-base',  // 16px
  lg: 'text-lg',      // 18px
  xl: 'text-xl',      // 20px
  '2xl': 'text-2xl',  // 24px
  '3xl': 'text-3xl',  // 30px
  '4xl': 'text-4xl',  // 36px
  '5xl': 'text-5xl',  // 48px
  '6xl': 'text-6xl',  // 60px
  '7xl': 'text-7xl',  // 72px
  '8xl': 'text-8xl',  // 96px
  '9xl': 'text-9xl',  // 128px
} as const;
```

### Font Weights (Tailwind Classes)
```typescript
export const FONT_WEIGHTS = {
  thin: 'font-thin',          // 100
  extralight: 'font-extralight', // 200
  light: 'font-light',        // 300
  normal: 'font-normal',      // 400
  medium: 'font-medium',      // 500
  semibold: 'font-semibold',  // 600
  bold: 'font-bold',          // 700
  extrabold: 'font-extrabold', // 800
  black: 'font-black',        // 900
} as const;
```

### Colors (Tailwind Classes)
```typescript
export const TEXT_COLORS = {
  white: 'text-white',
  black: 'text-black',
  gray50: 'text-gray-50',
  gray100: 'text-gray-100',
  // ... all gray shades
  gray900: 'text-gray-900',
  blue500: 'text-blue-500',
  blue600: 'text-blue-600',
  // ... all brand colors
} as const;
```

---

## DATA FLOW ARCHITECTURE

### 1. Initial Page Load
```
Supabase → DataContext → AdminPanel → Storefront → Section Components
```

### 2. Style Modal Edit
```
User clicks "Edit Heading Styles" 
  → Modal opens with current styles
  → User changes font/size/weight/color
  → Modal calls updateSection()
  → DataContext updates state + Supabase
  → React re-renders components with new styles
  → Components apply new Tailwind classes
```

### 3. Content Edit (Inline)
```
User clicks text (editMode=true)
  → contentEditable activates
  → User types
  → onBlur triggers
  → Component calls onUpdate()
  → DataContext updates state + Supabase
  → Value updates in component
```

---

## TESTING STRATEGY (Agent Phoenix)

### Unit Tests
```typescript
describe('Heading Component', () => {
  it('renders with default styles', () => {
    const { container } = render(<Heading level={1}>Test</Heading>);
    expect(container.firstChild).toHaveClass('font-inter', 'text-5xl', 'font-bold');
  });

  it('applies custom styles from props', () => {
    const style = {
      fontFamily: 'font-playfair',
      fontSize: 'text-6xl',
      fontWeight: 'font-black',
      color: 'text-blue-600'
    };
    const { container } = render(<Heading level={1} style={style}>Test</Heading>);
    expect(container.firstChild).toHaveClass('font-playfair', 'text-6xl', 'font-black', 'text-blue-600');
  });

  it('overrides defaults with style props', () => {
    const style = { fontSize: 'text-3xl' };
    const { container } = render(<Heading level={1} style={style}>Test</Heading>);
    expect(container.firstChild).toHaveClass('text-3xl');
    expect(container.firstChild).not.toHaveClass('text-5xl');
  });
});
```

### Integration Tests
```typescript
describe('Hero Section Typography Flow', () => {
  it('updates heading styles when DataContext changes', () => {
    const { rerender, getByText } = render(
      <DataProvider>
        <HeroSection variant="centered" content={{ heading: 'Test' }} />
      </DataProvider>
    );
    
    // Initial render
    expect(getByText('Test')).toHaveClass('text-5xl');
    
    // Update context
    act(() => {
      updateSection('hero', { 
        style: { 
          heading: { fontSize: 'text-6xl' } 
        } 
      });
    });
    
    // Should re-render with new style
    expect(getByText('Test')).toHaveClass('text-6xl');
  });
});
```

---

## PERFORMANCE OPTIMIZATIONS

### 1. Component Memoization
```typescript
export const Heading = React.memo<HeadingProps>(({ ... }) => {
  // Component logic
});
```

### 2. Style Class Memoization
```typescript
const classes = useMemo(() => {
  return [
    style?.fontFamily || 'font-inter',
    style?.fontSize || defaultSizes[level],
    // ...
  ].filter(Boolean).join(' ');
}, [style, level]);
```

### 3. Lazy Loading Sections
```typescript
const HeroSection = lazy(() => import('./sections/HeroSections'));
const FeatureSection = lazy(() => import('./sections/FeatureSections'));

// In parent component
<Suspense fallback={<LoadingSpinner />}>
  <HeroSection {...props} />
</Suspense>
```

---

## ACCESSIBILITY REQUIREMENTS (Agent Aesthetic)

### 1. Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<section>`, `<article>`, `<nav>`, `<footer>` appropriately
- Use `<button>` for actions, `<a>` for navigation

### 2. ARIA Labels
```typescript
<section aria-label="Hero section">
  <Heading level={1} aria-describedby="hero-subtitle">
    Welcome to NexusOS
  </Heading>
  <Text id="hero-subtitle">Build your store in minutes</Text>
</section>
```

### 3. Keyboard Navigation
- All interactive elements must be keyboard accessible
- Focus indicators on all focusable elements
- Logical tab order

### 4. Color Contrast
- WCAG AA minimum: 4.5:1 for normal text, 3:1 for large text
- Automatically validate in style modal
- Warn users about poor contrast choices

---

## MIGRATION STRATEGY

### Phase 1: Build Primitives (Today)
- Create Text.tsx, Heading.tsx, Button.tsx, Image.tsx, Container.tsx
- Create EditableText.tsx, EditableImage.tsx wrappers
- Build and test typography system

### Phase 2: Build Section Components (Tomorrow)
- HeroSections.tsx with 3 initial variants
- HeaderSections.tsx with 2 initial variants
- Test data flow from modal → component

### Phase 3: Expand Variants (This Week)
- Add remaining hero variants (8 total)
- Add remaining header variants (5 total)
- Build FooterSections, FeatureSections, ContentSections
- Build CTASections, SocialSections

### Phase 4: Replace Legacy (Next Week)
- Update AdminPanel to use new components
- Update Storefront to use new components
- Remove all references to deleted libraries
- Full regression testing

---

## SUCCESS CRITERIA

### Technical
- ✅ Zero hardcoded styles in section components
- ✅ Typography changes in modal reflect immediately in preview
- ✅ All components pass accessibility audit (WCAG AA)
- ✅ Build size < 500KB (sections bundle)
- ✅ Lighthouse performance score > 95

### Developer Experience
- ✅ Adding a new section variant takes < 30 minutes
- ✅ Component API is intuitive (no docs needed for common tasks)
- ✅ TypeScript provides helpful autocomplete
- ✅ Clear error messages when props are incorrect

### User Experience
- ✅ Style changes feel instant (< 100ms)
- ✅ No style flashing or layout shifts
- ✅ Works on mobile, tablet, desktop
- ✅ Keyboard and screen reader accessible

---

## COMPONENT LIBRARY MANIFEST

### MVP Components (Week 1)
1. **HeroSections.tsx**
   - HeroCentered (text center, full-width background)
   - HeroSplit (image left, content right)
   - HeroMinimal (simple centered text, no background)

2. **HeaderSections.tsx**
   - HeaderStandard (logo left, nav right, inline)
   - HeaderCentered (logo center, nav below, stacked)

3. **FooterSections.tsx**
   - FooterStandard (multi-column links)

### Full Component Library (Month 1)
- 8 Hero variants
- 5 Header variants
- 4 Footer variants
- 6 Feature variants
- 4 Content variants
- 3 CTA variants
- 2 Social variants

**Total:** 32 production-ready section components

---

## NEXT STEPS

**Agent Phoenix:** Start building primitives (Text, Heading, Button, EditableText)  
**Agent Aesthetic:** Define design tokens and validate accessibility  
**Agent Omega:** Review architecture, provide feedback

**Timeline:** Primitives complete in 2 hours, first hero variant in 4 hours.

---

**Architecture Status:** ✅ APPROVED  
**Ready for Implementation:** YES  
**Estimated Completion:** 48 hours for MVP, 1 week for full library

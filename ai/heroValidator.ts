import { HeroData } from '../components/AiHeroLibrary';

type Variant = NonNullable<HeroData['variant']>;
type Animation = NonNullable<HeroData['animationType']>;

const VALID_VARIANTS: Variant[] = ['centered', 'split-left', 'diagonal', 'minimal-corner', 'bottom-aligned'];
const VALID_ANIMATIONS: Animation[] = ['fade-in', 'slide-up', 'zoom-in', 'glitch', 'float'];

const DEFAULTS: HeroData = {
  variant: 'centered',
  heading: 'Welcome to the Future',
  subheading: 'Elevate your brand with cinematic hero experiences',
  buttonText: 'Get Started',
  buttonLink: '#',
  backgroundImage: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2000&q=80',
  textColor: '#FFFFFF',
  buttonBackgroundColor: '#00FF00',
  buttonTextColor: '#000000',
  buttonHoverColor: '#00CC00',
  overlayColor: '#000000',
  overlayOpacity: 0.6,
  showSubheading: true,
  showButton: true,
  enableParticles: false,
  particleColor: '#FFFFFF',
  enableAnimation: false,
  animationType: 'fade-in',
  enableParallax: false,
  parallaxSpeed: 0.4,
  gradientOverlay: false,
  gradientColors: 'from-purple-900/70 to-pink-900/70'
};

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));
const isHex = (val?: string) => typeof val === 'string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val.trim());
const safeHex = (val: string | undefined, fallback: string) => (isHex(val) ? val!.trim() : fallback);
const safeUrl = (val?: string, fallback?: string) => {
  if (typeof val !== 'string') return fallback;
  try {
    const url = new URL(val);
    if (url.protocol === 'http:' || url.protocol === 'https:') return val;
    return fallback;
  } catch {
    return fallback;
  }
};

export function normalizeHeroData(raw: any, fallbackVariant: Variant = 'centered'): HeroData {
  const variant: Variant = VALID_VARIANTS.includes(raw?.variant) ? raw.variant : fallbackVariant;
  const animationType: Animation = VALID_ANIMATIONS.includes(raw?.animationType) ? raw.animationType : 'fade-in';

  return {
    variant,
    heading: typeof raw?.heading === 'string' && raw.heading.trim() ? raw.heading.trim() : DEFAULTS.heading,
    subheading: typeof raw?.subheading === 'string' ? raw.subheading.trim() : DEFAULTS.subheading,
    buttonText: typeof raw?.buttonText === 'string' && raw.buttonText.trim() ? raw.buttonText.trim() : DEFAULTS.buttonText,
    buttonLink: typeof raw?.buttonLink === 'string' && raw.buttonLink.trim() ? raw.buttonLink.trim() : DEFAULTS.buttonLink,
    backgroundImage: safeUrl(raw?.backgroundImage, DEFAULTS.backgroundImage),
    textColor: safeHex(raw?.textColor, DEFAULTS.textColor!),
    buttonBackgroundColor: safeHex(raw?.buttonBackgroundColor, DEFAULTS.buttonBackgroundColor!),
    buttonTextColor: safeHex(raw?.buttonTextColor, DEFAULTS.buttonTextColor!),
    buttonHoverColor: safeHex(raw?.buttonHoverColor, DEFAULTS.buttonHoverColor!),
    overlayColor: safeHex(raw?.overlayColor, DEFAULTS.overlayColor!),
    overlayOpacity: clamp(typeof raw?.overlayOpacity === 'number' ? raw.overlayOpacity : DEFAULTS.overlayOpacity!, 0, 1),
    showSubheading: Boolean(raw?.showSubheading ?? DEFAULTS.showSubheading),
    showButton: Boolean(raw?.showButton ?? DEFAULTS.showButton),
    enableParticles: Boolean(raw?.enableParticles ?? false),
    particleColor: safeHex(raw?.particleColor, DEFAULTS.particleColor!),
    enableAnimation: Boolean(raw?.enableAnimation ?? false),
    animationType,
    enableParallax: Boolean(raw?.enableParallax ?? false),
    parallaxSpeed: clamp(typeof raw?.parallaxSpeed === 'number' ? raw.parallaxSpeed : DEFAULTS.parallaxSpeed!, 0, 1),
    gradientOverlay: Boolean(raw?.gradientOverlay ?? false),
    gradientColors: typeof raw?.gradientColors === 'string' && raw.gradientColors.trim() ? raw.gradientColors.trim() : DEFAULTS.gradientColors,
  };
}

export function normalizeGeneratedHero(design: any, index: number) {
  const variant: Variant = VALID_VARIANTS.includes(design?.layout) ? design.layout : (VALID_VARIANTS.includes(design?.data?.variant) ? design.data.variant : 'centered');
  const data = normalizeHeroData(design?.data || {}, variant);

  return {
    id: `hero-${Date.now()}-${index}`,
    name: typeof design?.name === 'string' && design.name.trim() ? design.name.trim() : `Design ${index + 1}`,
    description: typeof design?.description === 'string' ? design.description.trim() : 'A unique hero design',
    layout: data.variant as Variant,
    data,
    exclusivePrice: typeof design?.exclusivePrice === 'number' ? design.exclusivePrice : 99,
    createdAt: new Date().toISOString()
  };
}

export type NormalizedHero = ReturnType<typeof normalizeGeneratedHero>;
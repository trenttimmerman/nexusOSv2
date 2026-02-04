// Header Section Components - 5 variants
// Agent Phoenix + Agent Aesthetic

import React from 'react';
import { Text, Heading, Button, Container, Section, Image, TypographyStyle, ButtonStyle } from '../primitives';
import { EditableText, EditableImage, SectionControls } from '../editor';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface NavLink {
  text: string;
  href: string;
}

export interface HeaderContent {
  logo?: string;
  logoText?: string;
  tagline?: string;
  navigation: NavLink[];
  cta?: {
    text: string;
    href: string;
  };
}

export interface HeaderStyle {
  logoText?: TypographyStyle;
  tagline?: TypographyStyle;
  navLink?: TypographyStyle;
  cta?: ButtonStyle;
  background?: string;
  padding?: string;
  sticky?: boolean;
}

export interface HeaderProps {
  variant: 'standard' | 'centered' | 'mega' | 'sidebar' | 'transparent';
  content: HeaderContent;
  style?: HeaderStyle;
  editMode?: boolean;
  onContentUpdate?: (content: HeaderContent) => void;
}

// ============================================================================
// MAIN HEADER SECTION COMPONENT
// ============================================================================

export const HeaderSection: React.FC<HeaderProps> = (props) => {
  const { variant } = props;

  switch (variant) {
    case 'standard':
      return <HeaderStandard {...props} />;
    case 'centered':
      return <HeaderCentered {...props} />;
    case 'mega':
      return <HeaderMega {...props} />;
    case 'sidebar':
      return <HeaderSidebar {...props} />;
    case 'transparent':
      return <HeaderTransparent {...props} />;
    default:
      return <HeaderStandard {...props} />;
  }
};

// ============================================================================
// VARIANT 1: STANDARD HEADER (Logo left, nav right, inline)
// ============================================================================

const HeaderStandard: React.FC<HeaderProps> = ({
  content,
  style,
  editMode = false,
  onContentUpdate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const updateField = (field: string, value: any) => {
    if (onContentUpdate) {
      onContentUpdate({ ...content, [field]: value });
    }
  };

  const headerClasses = [
    style?.background || 'bg-white border-b border-gray-200',
    style?.sticky ? 'sticky top-0 z-50' : '',
    style?.padding || 'py-4 px-4'
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClasses}>
      <Container maxWidth="xl">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            {content.logo && (
              editMode ? (
                <EditableImage
                  src={content.logo}
                  alt={content.logoText || 'Logo'}
                  onChange={(file) => console.log('Logo upload:', file)}
                  className="h-10 w-auto"
                  objectFit="contain"
                />
              ) : (
                <Image
                  src={content.logo}
                  alt={content.logoText || 'Logo'}
                  className="h-10 w-auto"
                  objectFit="contain"
                  loading="eager"
                  priority
                />
              )
            )}

            {content.logoText && (
              editMode ? (
                <EditableText
                  as="span"
                  value={content.logoText}
                  onChange={(value) => updateField('logoText', value)}
                  style={style?.logoText}
                  className="text-2xl font-bold"
                  multiline={false}
                />
              ) : (
                <Text
                  as="span"
                  style={style?.logoText}
                  className="text-2xl font-bold"
                >
                  {content.logoText}
                </Text>
              )
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {content.navigation.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={[
                  style?.navLink?.fontFamily || 'font-inter',
                  style?.navLink?.fontSize || 'text-base',
                  style?.navLink?.fontWeight || 'font-medium',
                  style?.navLink?.color || 'text-gray-700',
                  'hover:text-gray-900 transition-colors'
                ].join(' ')}
              >
                {link.text}
              </a>
            ))}

            {content.cta && (
              <Button
                href={content.cta.href}
                style={style?.cta}
                variant="primary"
                size="sm"
              >
                {content.cta.text}
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-4">
              {content.navigation.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  {link.text}
                </a>
              ))}

              {content.cta && (
                <Button
                  href={content.cta.href}
                  style={style?.cta}
                  variant="primary"
                  size="sm"
                  className="w-full"
                >
                  {content.cta.text}
                </Button>
              )}
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
};

// ============================================================================
// VARIANT 2: CENTERED HEADER (Logo center, nav below, stacked)
// ============================================================================

const HeaderCentered: React.FC<HeaderProps> = ({
  content,
  style,
  editMode = false,
  onContentUpdate
}) => {
  const updateField = (field: string, value: any) => {
    if (onContentUpdate) {
      onContentUpdate({ ...content, [field]: value });
    }
  };

  const headerClasses = [
    style?.background || 'bg-white border-b border-gray-200',
    style?.sticky ? 'sticky top-0 z-50' : '',
    style?.padding || 'py-6 px-4'
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClasses}>
      <Container maxWidth="xl">
        {/* Logo Section */}
        <div className="text-center mb-6">
          {content.logo && (
            editMode ? (
              <EditableImage
                src={content.logo}
                alt={content.logoText || 'Logo'}
                onChange={(file) => console.log('Logo upload:', file)}
                className="h-12 w-auto mx-auto mb-2"
                objectFit="contain"
              />
            ) : (
              <Image
                src={content.logo}
                alt={content.logoText || 'Logo'}
                className="h-12 w-auto mx-auto mb-2"
                objectFit="contain"
                loading="eager"
                priority
              />
            )
          )}

          {content.logoText && (
            editMode ? (
              <EditableText
                as="h1"
                value={content.logoText}
                onChange={(value) => updateField('logoText', value)}
                style={style?.logoText}
                className="text-3xl font-bold"
                multiline={false}
              />
            ) : (
              <Heading
                level={1}
                style={style?.logoText}
                className="text-3xl"
              >
                {content.logoText}
              </Heading>
            )
          )}

          {content.tagline && (
            editMode ? (
              <EditableText
                as="p"
                value={content.tagline}
                onChange={(value) => updateField('tagline', value)}
                style={style?.tagline}
                className="text-sm mt-1"
                multiline={false}
              />
            ) : (
              <Text
                style={style?.tagline}
                className="text-sm mt-1"
              >
                {content.tagline}
              </Text>
            )
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center items-center gap-6">
          {content.navigation.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className={[
                style?.navLink?.fontFamily || 'font-inter',
                style?.navLink?.fontSize || 'text-base',
                style?.navLink?.fontWeight || 'font-medium',
                style?.navLink?.color || 'text-gray-700',
                'hover:text-gray-900 transition-colors'
              ].join(' ')}
            >
              {link.text}
            </a>
          ))}

          {content.cta && (
            <Button
              href={content.cta.href}
              style={style?.cta}
              variant="primary"
              size="sm"
            >
              {content.cta.text}
            </Button>
          )}
        </nav>
      </Container>
    </header>
  );
};

// ============================================================================
// VARIANT 3: MEGA MENU HEADER (Dropdown navigation)
// ============================================================================

const HeaderMega: React.FC<HeaderProps> = (props) => {
  // TODO: Implement mega menu with dropdowns
  return <HeaderStandard {...props} />;
};

// ============================================================================
// VARIANT 4: SIDEBAR HEADER (Vertical navigation)
// ============================================================================

const HeaderSidebar: React.FC<HeaderProps> = (props) => {
  // TODO: Implement sidebar navigation
  return <HeaderStandard {...props} />;
};

// ============================================================================
// VARIANT 5: TRANSPARENT HEADER (Overlay on hero)
// ============================================================================

const HeaderTransparent: React.FC<HeaderProps> = (props) => {
  const transparentStyle = {
    ...props.style,
    background: 'bg-transparent absolute top-0 left-0 right-0',
    sticky: false
  };

  return <HeaderStandard {...props} style={transparentStyle} />;
};

export default HeaderSection;

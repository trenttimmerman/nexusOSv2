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

const HeaderMega: React.FC<HeaderProps> = ({
  content,
  style,
  editMode = false,
  onContentUpdate
}) => {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Example mega menu structure (in real app, this would come from content)
  const megaMenuItems = [
    {
      label: 'Products',
      href: '/products',
      dropdown: [
        { category: 'Featured', items: [{ name: 'New Arrivals', href: '/new' }, { name: 'Best Sellers', href: '/bestsellers' }] },
        { category: 'Categories', items: [{ name: 'Electronics', href: '/electronics' }, { name: 'Clothing', href: '/clothing' }, { name: 'Home & Garden', href: '/home' }] }
      ]
    },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <header
      className={[
        style?.background || 'bg-white',
        'border-b border-gray-200',
        style?.sticky !== false ? 'sticky top-0 z-50' : ''
      ].filter(Boolean).join(' ')}
    >
      <Container maxWidth="xl">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {content.logo && (
              <Image
                src={content.logo}
                alt={content.storeName}
                className="h-10 w-auto"
                objectFit="contain"
                loading="eager"
                priority
              />
            )}
            <Heading
              level={2}
              style={style?.storeName}
              className="text-2xl font-bold"
            >
              {content.storeName}
            </Heading>
          </div>

          {/* Desktop Navigation with Mega Menu */}
          <nav className="hidden lg:flex items-center gap-8">
            {megaMenuItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <a
                  href={item.href}
                  className={[
                    style?.navLink?.fontFamily || 'font-inter',
                    style?.navLink?.fontSize || 'text-base',
                    style?.navLink?.fontWeight || 'font-medium',
                    style?.navLink?.color || 'text-gray-700',
                    'hover:text-gray-900 transition-colors flex items-center gap-1'
                  ].join(' ')}
                >
                  {item.label}
                  {item.dropdown && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </a>

                {/* Mega Menu Dropdown */}
                {item.dropdown && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl p-6 grid grid-cols-2 gap-6">
                    {item.dropdown.map((section, idx) => (
                      <div key={idx}>
                        <h3 className="font-bold text-gray-900 mb-3">{section.category}</h3>
                        <ul className="space-y-2">
                          {section.items.map((link, linkIdx) => (
                            <li key={linkIdx}>
                              <a
                                href={link.href}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                              >
                                {link.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              {content.navigation.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900"
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
                  className="mt-4"
                >
                  {content.cta.text}
                </Button>
              )}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
};

// ============================================================================
// VARIANT 4: SIDEBAR HEADER (Vertical navigation)
// ============================================================================

const HeaderSidebar: React.FC<HeaderProps> = ({
  content,
  style,
  editMode = false,
  onContentUpdate
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <>
      {/* Top Bar */}
      <header
        className={[
          style?.background || 'bg-white',
          'border-b border-gray-200',
          'sticky top-0 z-50'
        ].join(' ')}
      >
        <Container maxWidth="full">
          <div className="flex items-center justify-between py-4 px-6">
            {/* Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              {content.logo && (
                <Image
                  src={content.logo}
                  alt={content.storeName}
                  className="h-10 w-auto"
                  objectFit="contain"
                  loading="eager"
                  priority
                />
              )}
              <Heading
                level={2}
                style={style?.storeName}
                className="text-xl font-bold"
              >
                {content.storeName}
              </Heading>
            </div>

            {/* CTA */}
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
          </div>
        </Container>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ].join(' ')}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {content.logo && (
                <Image
                  src={content.logo}
                  alt={content.storeName}
                  className="h-10 w-auto"
                  objectFit="contain"
                  loading="eager"
                  priority
                />
              )}
              <Heading level={2} style={style?.storeName} className="text-xl font-bold">
                {content.storeName}
              </Heading>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-6">
            <ul className="space-y-2">
              {content.navigation.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className={[
                      style?.navLink?.fontFamily || 'font-inter',
                      style?.navLink?.fontSize || 'text-base',
                      style?.navLink?.fontWeight || 'font-medium',
                      style?.navLink?.color || 'text-gray-700',
                      'flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors'
                    ].join(' ')}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-gray-200">
            {content.cta && (
              <Button
                href={content.cta.href}
                style={style?.cta}
                variant="primary"
                size="md"
                className="w-full"
              >
                {content.cta.text}
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

// ============================================================================
// VARIANT 5: TRANSPARENT HEADER (Overlay on hero)
// ============================================================================

const HeaderTransparent: React.FC<HeaderProps> = ({
  content,
  style,
  editMode = false,
  onContentUpdate
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Track scroll position to change header background
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      ].join(' ')}
    >
      <Container maxWidth="xl">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {content.logo && (
              <Image
                src={content.logo}
                alt={content.storeName}
                className="h-10 w-auto"
                objectFit="contain"
                loading="eager"
                priority
              />
            )}
            <Heading
              level={2}
              style={{
                ...style?.storeName,
                color: isScrolled ? style?.storeName?.color || 'text-gray-900' : 'text-white'
              }}
              className="text-2xl font-bold transition-colors duration-300"
            >
              {content.storeName}
            </Heading>
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
                  isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white',
                  'transition-colors duration-300'
                ].join(' ')}
              >
                {link.text}
              </a>
            ))}

            {content.cta && (
              <Button
                href={content.cta.href}
                style={{
                  ...style?.cta,
                  ...(isScrolled ? {} : { background: 'bg-white', color: 'text-gray-900' })
                }}
                variant="primary"
                size="sm"
              >
                {content.cta.text}
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={[
              'md:hidden p-2 rounded-lg transition-colors',
              isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
            ].join(' ')}
          >
            <svg
              className={[
                'w-6 h-6 transition-colors',
                isScrolled ? 'text-gray-900' : 'text-white'
              ].join(' ')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-white rounded-lg mt-2 shadow-xl border border-gray-200">
            <nav className="flex flex-col gap-2 p-2">
              {content.navigation.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
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
                  className="mt-2"
                >
                  {content.cta.text}
                </Button>
              )}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
};

export default HeaderSection;

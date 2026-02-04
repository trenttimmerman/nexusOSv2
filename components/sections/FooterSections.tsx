// Footer Section Components - 4 variants
// Agent Phoenix + Agent Aesthetic

import React from 'react';
import { Text, Heading, Container, Section, Image, TypographyStyle } from '../primitives';
import { EditableText, EditableImage } from '../editor';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'github';
  href: string;
}

export interface FooterContent {
  logo?: string;
  logoText?: string;
  tagline?: string;
  columns: FooterColumn[];
  socialLinks?: SocialLink[];
  copyright?: string;
  newsletter?: {
    heading: string;
    placeholder: string;
    buttonText: string;
  };
}

export interface FooterStyle {
  logoText?: TypographyStyle;
  tagline?: TypographyStyle;
  columnTitle?: TypographyStyle;
  link?: TypographyStyle;
  copyright?: TypographyStyle;
  background?: string;
  padding?: string;
}

export interface FooterProps {
  variant: 'standard' | 'minimal' | 'newsletter' | 'centered';
  content: FooterContent;
  style?: FooterStyle;
  editMode?: boolean;
  onContentUpdate?: (content: FooterContent) => void;
}

// ============================================================================
// MAIN FOOTER SECTION COMPONENT
// ============================================================================

export const FooterSection: React.FC<FooterProps> = (props) => {
  const { variant } = props;

  switch (variant) {
    case 'standard':
      return <FooterStandard {...props} />;
    case 'minimal':
      return <FooterMinimal {...props} />;
    case 'newsletter':
      return <FooterNewsletter {...props} />;
    case 'centered':
      return <FooterCentered {...props} />;
    default:
      return <FooterStandard {...props} />;
  }
};

// ============================================================================
// VARIANT 1: STANDARD FOOTER (Multi-column links)
// ============================================================================

const FooterStandard: React.FC<FooterProps> = ({
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

  const getSocialIcon = (platform: string) => {
    // Simple SVG icons for social platforms
    const icons: Record<string, JSX.Element> = {
      facebook: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      twitter: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      instagram: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      linkedin: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      youtube: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      github: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      ),
    };
    return icons[platform] || null;
  };

  return (
    <footer className={style?.background || 'bg-gray-900 text-white'}>
      <Section padding={style?.padding || 'py-12 px-4'}>
        <Container maxWidth="xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="md:col-span-1">
              {content.logo && (
                <Image
                  src={content.logo}
                  alt={content.logoText || 'Logo'}
                  className="h-10 w-auto mb-4"
                  objectFit="contain"
                />
              )}

              {content.logoText && (
                <Heading
                  level={3}
                  style={style?.logoText}
                  className="mb-2"
                >
                  {content.logoText}
                </Heading>
              )}

              {content.tagline && (
                <Text
                  style={style?.tagline}
                  className="mb-4"
                >
                  {content.tagline}
                </Text>
              )}

              {/* Social Links */}
              {content.socialLinks && content.socialLinks.length > 0 && (
                <div className="flex gap-4 mt-4">
                  {content.socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label={social.platform}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Link Columns */}
            {content.columns.map((column, colIndex) => (
              <div key={colIndex}>
                <Heading
                  level={4}
                  style={style?.columnTitle}
                  className="mb-4 text-sm uppercase tracking-wider"
                >
                  {column.title}
                </Heading>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className={[
                          style?.link?.fontFamily || 'font-inter',
                          style?.link?.fontSize || 'text-sm',
                          style?.link?.fontWeight || 'font-normal',
                          style?.link?.color || 'text-gray-400',
                          'hover:text-white transition-colors'
                        ].join(' ')}
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Copyright */}
          {content.copyright && (
            <div className="border-t border-gray-800 pt-8 mt-8">
              <Text
                style={style?.copyright}
                className="text-center text-sm"
              >
                {content.copyright}
              </Text>
            </div>
          )}
        </Container>
      </Section>
    </footer>
  );
};

// ============================================================================
// VARIANT 2: MINIMAL FOOTER
// ============================================================================

const FooterMinimal: React.FC<FooterProps> = ({
  content,
  style
}) => {
  return (
    <footer className={style?.background || 'bg-white border-t border-gray-200'}>
      <Section padding={style?.padding || 'py-8 px-4'}>
        <Container maxWidth="xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            {content.copyright && (
              <Text style={style?.copyright} className="text-sm">
                {content.copyright}
              </Text>
            )}

            {/* Links */}
            {content.columns.length > 0 && (
              <nav className="flex gap-6">
                {content.columns[0].links.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.text}
                  </a>
                ))}
              </nav>
            )}

            {/* Social Links */}
            {content.socialLinks && content.socialLinks.length > 0 && (
              <div className="flex gap-4">
                {content.socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label={social.platform}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </footer>
  );
};

// ============================================================================
// VARIANT 3: NEWSLETTER FOOTER
// ============================================================================

const FooterNewsletter: React.FC<FooterProps> = ({
  content,
  style,
  editMode = false,
  onContentUpdate
}) => {
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Subscribe:', email);
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
    setEmail('');
  };

  return (
    <footer>
      {/* Newsletter Section */}
      <Section
        background={style?.newsletterBackground || 'bg-gradient-to-r from-blue-600 to-purple-600'}
        padding="py-16 px-4"
      >
        <Container maxWidth="lg">
          <div className="text-center">
            <Heading
              level={3}
              style={style?.newsletterHeading || { color: 'text-white', fontSize: 'text-3xl', fontWeight: 'font-bold' }}
              className="mb-4"
            >
              {content.newsletterHeading || 'Stay Updated'}
            </Heading>
            <Text
              style={style?.newsletterSubheading || { color: 'text-white/90', fontSize: 'text-lg' }}
              className="mb-8 max-w-2xl mx-auto"
            >
              {content.newsletterSubheading || 'Get the latest news and exclusive offers delivered to your inbox.'}
            </Text>

            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-3 rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isSubscribed ? '✓ Subscribed!' : 'Subscribe'}
              </button>
            </form>

            <Text
              style={{ color: 'text-white/60', fontSize: 'text-xs' }}
              className="mt-4"
            >
              We respect your privacy. Unsubscribe at any time.
            </Text>
          </div>
        </Container>
      </Section>

      {/* Footer Content */}
      <Section
        background={style?.background || 'bg-gray-900'}
        padding="py-12 px-4"
      >
        <Container maxWidth="xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <Heading
                level={3}
                style={style?.storeName || { color: 'text-white', fontSize: 'text-xl', fontWeight: 'font-bold' }}
                className="mb-4"
              >
                {content.storeName}
              </Heading>
              {content.tagline && (
                <Text
                  style={style?.tagline || { color: 'text-gray-400', fontSize: 'text-sm' }}
                >
                  {content.tagline}
                </Text>
              )}
            </div>

            {/* Link Columns */}
            {content.columns.map((column, index) => (
              <div key={index}>
                <Heading
                  level={4}
                  style={style?.columnHeading || { color: 'text-white', fontSize: 'text-sm', fontWeight: 'font-semibold' }}
                  className="mb-4 uppercase tracking-wider"
                >
                  {column.title}
                </Heading>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Row */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            {content.copyright && (
              <Text style={style?.copyright || { color: 'text-gray-400', fontSize: 'text-sm' }}>
                {content.copyright}
              </Text>
            )}

            {/* Social Links */}
            {content.socialLinks && content.socialLinks.length > 0 && (
              <div className="flex gap-4">
                {content.socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.platform}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </footer>
  );
};

// ============================================================================
// VARIANT 4: CENTERED FOOTER
// ============================================================================

const FooterCentered: React.FC<FooterProps> = ({
  content,
  style,
  editMode = false,
  onContentUpdate
}) => {
  return (
    <footer>
      <Section
        background={style?.background || 'bg-white'}
        padding="py-16 px-4"
      >
        <Container maxWidth="lg" className="text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            {content.logo && (
              <div className="mb-4">
                <Image
                  src={content.logo}
                  alt={content.storeName}
                  className="h-12 w-auto mx-auto"
                  objectFit="contain"
                  loading="lazy"
                />
              </div>
            )}
            <Heading
              level={3}
              style={style?.storeName || { fontSize: 'text-2xl', fontWeight: 'font-bold' }}
              className="mb-2"
            >
              {content.storeName}
            </Heading>
            {content.tagline && (
              <Text
                style={style?.tagline || { color: 'text-gray-600', fontSize: 'text-base' }}
                className="max-w-md mx-auto"
              >
                {content.tagline}
              </Text>
            )}
          </div>

          {/* Navigation Links */}
          {content.columns.length > 0 && (
            <nav className="mb-8">
              <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                {content.columns.flatMap(column => 
                  column.links.map((link, index) => (
                    <li key={`${column.title}-${index}`}>
                      <a
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
                    </li>
                  ))
                )}
              </ul>
            </nav>
          )}

          {/* Social Links */}
          {content.socialLinks && content.socialLinks.length > 0 && (
            <div className="flex justify-center gap-6 mb-8">
              {content.socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                  aria-label={social.platform}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {/* Generic social icon - in production, use actual icons */}
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </a>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200 pt-8">
            {/* Copyright */}
            {content.copyright && (
              <Text
                style={style?.copyright || { color: 'text-gray-500', fontSize: 'text-sm' }}
              >
                {content.copyright}
              </Text>
            )}

            {/* Additional Links (Privacy, Terms, etc.) */}
            <div className="mt-4 flex justify-center gap-6">
              <a
                href="/privacy"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/cookies"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </footer>
  );
};

export default FooterSection;

// THIS IS THE NEW 2026 CANVAS HEADER - TO BE MERGED INTO HeaderLibrary.tsx

// 1. HeaderCanvas - "2026 Edition" (Modern, Feature-Complete)
export const HeaderCanvas: React.FC<HeaderProps> = ({
  storeName,
  logoUrl,
  logoHeight,
  links,
  cartCount,
  onOpenCart,
  onLogoClick,
  onLinkClick,
  onSearchClick,
  isSearchOpen,
  onSearchClose,
  onSearchSubmit,
  data = {},
}) => {
  // Merge defaults with customization
  const settings = { ...CANVAS_DEFAULTS, ...data };
  
  // State management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [isScrolled, setIsScrolled] = React.useState(false);
  
  // Smart scroll logic
  React.useEffect(() => {
    if (!settings.enableSmartScroll) return;
    
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      
      // Track if scrolled past threshold
      setIsScrolled(currentScrollY > 50);
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > (settings.smartScrollThreshold || 100)) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY, settings.enableSmartScroll, settings.smartScrollThreshold]);
  
  // Close mobile menu on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);
  
  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  const maxWidthClass = settings.maxWidth === 'full' ? 'max-w-full' : `max-w-${settings.maxWidth}`;
  
  // Glassmorphism styles
  const glassStyles = settings.enableGlassmorphism ? {
    backgroundColor: `rgba(255, 255, 255, ${(settings.glassBackgroundOpacity || 60) / 100})`,
    backdropFilter: `blur(${settings.blurIntensity === 'sm' ? '4px' : settings.blurIntensity === 'md' ? '8px' : settings.blurIntensity === 'lg' ? '12px' : '20px'})`,
    WebkitBackdropFilter: `blur(${settings.blurIntensity === 'sm' ? '4px' : settings.blurIntensity === 'md' ? '8px' : settings.blurIntensity === 'lg' ? '12px' : '20px'})`,
  } : {};

  return (
    <>
      {/* Announcement Bar */}
      {settings.showAnnouncementBar && !isAnnouncementDismissed && (
        <div
          className="w-full py-2 px-4 text-center text-sm relative overflow-hidden"
          style={{
            backgroundColor: settings.announcementBackgroundColor,
            color: settings.announcementTextColor,
          }}
        >
          <div className={settings.announcementMarquee ? 'animate-marquee inline-block whitespace-nowrap' : ''}>
            {settings.announcementText}
          </div>
          {settings.announcementDismissible && (
            <button
              onClick={() => setIsAnnouncementDismissed(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Dismiss announcement"
            >
              <X size={16} style={{ color: settings.announcementTextColor }} />
            </button>
          )}
        </div>
      )}
      
      {/* Utility Bar */}
      {settings.showUtilityBar && (
        <div
          className="w-full py-2 px-6 text-xs border-b"
          style={{
            backgroundColor: settings.utilityBarBackgroundColor,
            color: settings.utilityBarTextColor,
            borderColor: settings.borderColor,
          }}
        >
          <div className={`${maxWidthClass} mx-auto flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              {settings.showCurrencySelector && (
                <select 
                  className="bg-transparent border-none text-xs cursor-pointer focus:outline-none"
                  style={{ color: settings.utilityBarTextColor }}
                >
                  <option value="USD">USD $</option>
                  <option value="EUR">EUR €</option>
                  <option value="GBP">GBP £</option>
                </select>
              )}
              {settings.showLanguageSelector && (
                <select 
                  className="bg-transparent border-none text-xs cursor-pointer focus:outline-none"
                  style={{ color: settings.utilityBarTextColor }}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              )}
            </div>
            <div className="flex items-center gap-4">
              {settings.utilityBarLinks?.map((link, i) => (
                <a 
                  key={i} 
                  href={link.href}
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: settings.utilityBarTextColor }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Header */}
      <header
        className={`w-full ${settings.sticky ? 'sticky top-0' : ''} z-[100] transition-transform duration-${settings.smartScrollDuration || 300}`}
        style={{
          ...glassStyles,
          backgroundColor: settings.enableGlassmorphism ? glassStyles.backgroundColor : settings.backgroundColor,
          borderBottom: `${settings.borderWidth} solid ${settings.borderColor}`,
          transform: settings.enableSmartScroll ? (isVisible ? 'translateY(0)' : 'translateY(-100%)') : 'none',
        }}
      >
        <div
          className={`${maxWidthClass} mx-auto flex items-center justify-between`}
          style={{
            paddingLeft: settings.paddingX,
            paddingRight: settings.paddingX,
            paddingTop: settings.paddingY,
            paddingBottom: settings.paddingY,
            minHeight: '5rem',
          }}
        >
          {/* Left: Logo + Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Logo
              storeName={storeName}
              logoUrl={logoUrl}
              logoHeight={logoHeight}
              className="text-2xl font-bold tracking-tight"
              onClick={onLogoClick}
            />
            <nav className="hidden md:flex gap-6">
              {(links || []).map((link) => (
                <NavItem
                  key={link.href}
                  link={link}
                  onClick={onLinkClick}
                  className="text-sm font-medium"
                  style={{ color: settings.textColor }}
                  hoverColor={settings.textHoverColor}
                  activeColor={settings.textHoverColor}
                  activeStyle={settings.navActiveStyle}
                />
              ))}
            </nav>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-2">
            {settings.showSearch && (
              <div className="flex items-center">
                <InlineSearch
                  isOpen={isSearchOpen || false}
                  onClose={onSearchClose || (() => {})}
                  onSubmit={onSearchSubmit}
                  placeholder={settings.searchPlaceholder}
                  inputClassName="border-b px-2 py-1"
                  inputStyle={{
                    backgroundColor: settings.searchBackgroundColor,
                    borderColor: settings.searchBorderColor,
                    color: settings.searchInputTextColor,
                  }}
                  iconColor={settings.textColor}
                />
                {!isSearchOpen && (
                  <button
                    onClick={onSearchClick}
                    className="p-2 rounded-full transition-colors"
                    style={{ 
                      color: settings.textColor,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = settings.textHoverColor!;
                      e.currentTarget.style.backgroundColor = settings.iconHoverBackgroundColor!;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = settings.textColor!;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Search size={settings.iconSize} />
                  </button>
                )}
              </div>
            )}
            {settings.showAccount && (
              <button
                className="p-2 rounded-full transition-colors hidden md:block"
                style={{ 
                  color: settings.textColor,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = settings.textHoverColor!;
                  e.currentTarget.style.backgroundColor = settings.iconHoverBackgroundColor!;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = settings.textColor!;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <User size={settings.iconSize} />
              </button>
            )}
            {settings.showCart && (
              <button
                onClick={onOpenCart}
                className="relative p-2 rounded-full transition-colors"
                style={{ 
                  color: settings.textColor,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = settings.textHoverColor!;
                  e.currentTarget.style.backgroundColor = settings.iconHoverBackgroundColor!;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = settings.textColor!;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <ShoppingBag size={settings.iconSize} />
                {cartCount > 0 && (
                  <span
                    className="absolute top-0 right-0 w-4 h-4 text-[10px] flex items-center justify-center rounded-full"
                    style={{
                      backgroundColor: settings.cartBadgeColor,
                      color: settings.cartBadgeTextColor,
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            
            {/* Mobile Menu Button */}
            {settings.showMobileMenu && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full transition-colors"
                style={{ 
                  color: settings.textColor,
                  backgroundColor: 'transparent'
                }}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={settings.iconSize} /> : <Menu size={settings.iconSize} />}
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Drawer */}
      {settings.showMobileMenu && (
        <>
          {/* Overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 z-[90] transition-opacity duration-300"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${(settings.mobileMenuOverlayOpacity || 50) / 100})`,
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          
          {/* Drawer */}
          <div
            className={`fixed top-0 ${settings.mobileMenuPosition === 'right' ? 'right-0' : 'left-0'} h-full z-[100] transform transition-transform duration-300 overflow-y-auto`}
            style={{
              width: settings.mobileMenuWidth,
              backgroundColor: settings.mobileMenuBackgroundColor,
              transform: isMobileMenuOpen 
                ? 'translateX(0)' 
                : settings.mobileMenuPosition === 'right' ? 'translateX(100%)' : 'translateX(-100%)',
            }}
          >
            <div className="p-6">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between mb-8">
                <Logo
                  storeName={storeName}
                  logoUrl={logoUrl}
                  logoHeight={logoHeight ? logoHeight * 0.8 : 28}
                  className="text-xl font-bold"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogoClick?.();
                  }}
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} style={{ color: settings.mobileMenuTextColor }} />
                </button>
              </div>
              
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-4 mb-8">
                {(links || []).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      if (onLinkClick) {
                        e.preventDefault();
                        onLinkClick(link.href);
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-lg font-medium py-2 border-b transition-colors"
                    style={{
                      color: settings.mobileMenuTextColor,
                      borderColor: settings.borderColor,
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              
              {/* Mobile Account Section */}
              {settings.showAccount && (
                <div className="pt-6 border-t" style={{ borderColor: settings.borderColor }}>
                  <a
                    href="/account"
                    className="flex items-center gap-3 py-3 text-base font-medium"
                    style={{ color: settings.mobileMenuTextColor }}
                  >
                    <User size={20} />
                    <span>My Account</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

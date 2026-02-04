// Hero Section Components - 8 variants
// Agent Phoenix + Agent Aesthetic

import React from 'react';
import { Text, Heading, Button, Container, Section, Image, TypographyStyle, ButtonStyle } from '../primitives';
import { EditableText, EditableImage, EditableButton, SectionControls } from '../editor';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface HeroContent {
  heading: string;
  subheading?: string;
  body?: string;
  cta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  image?: string;
  video?: string;
  backgroundImage?: string;
}

export interface HeroStyle {
  heading?: TypographyStyle;
  subheading?: TypographyStyle;
  body?: TypographyStyle;
  cta?: ButtonStyle;
  secondaryCta?: ButtonStyle;
  background?: string;
  overlay?: string;
  padding?: string;
}

export interface HeroProps {
  variant: 'centered' | 'split' | 'video' | 'minimal' | 'fullscreen' | 'overlay' | 'animated' | 'gradient';
  content: HeroContent;
  style?: HeroStyle;
  editMode?: boolean;
  onContentUpdate?: (content: HeroContent) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

// ============================================================================
// MAIN HERO SECTION COMPONENT
// ============================================================================

export const HeroSection: React.FC<HeroProps> = (props) => {
  const { variant } = props;

  switch (variant) {
    case 'centered':
      return <HeroCentered {...props} />;
    case 'split':
      return <HeroSplit {...props} />;
    case 'video':
      return <HeroVideo {...props} />;
    case 'minimal':
      return <HeroMinimal {...props} />;
    case 'fullscreen':
      return <HeroFullscreen {...props} />;
    case 'overlay':
      return <HeroOverlay {...props} />;
    case 'animated':
      return <HeroAnimated {...props} />;
    case 'gradient':
      return <HeroGradient {...props} />;
    default:
      return <HeroCentered {...props} />;
  }
};

// ============================================================================
// VARIANT 1: CENTERED HERO
// ============================================================================

const HeroCentered: React.FC<HeroProps> = ({
  content,
  style,
  editMode = false,
  onContentUpdate,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  canMoveUp,
  canMoveDown
}) => {
  const HeadingComponent = editMode ? EditableText : Heading;
  const TextComponent = editMode ? EditableText : Text;
  const ButtonComponent = editMode ? EditableButton : Button;

  const updateField = (field: string, value: any) => {
    if (onContentUpdate) {
      onContentUpdate({ ...content, [field]: value });
    }
  };

  const updateCta = (field: string, value: string) => {
    if (onContentUpdate && content.cta) {
      onContentUpdate({
        ...content,
        cta: { ...content.cta, [field]: value }
      });
    }
  };

  return (
    <Section
      background={style?.background || 'bg-white'}
      padding={style?.padding || 'py-20 px-4'}
      className="group"
    >
      {editMode && (
        <SectionControls
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
        />
      )}

      <Container maxWidth="xl" className="text-center">
        {editMode ? (
          <EditableText
            as="h1"
            value={content.heading}
            onChange={(value) => updateField('heading', value)}
            style={style?.heading}
            className="mb-6"
            multiline={false}
          />
        ) : (
          <Heading
            level={1}
            style={style?.heading}
            className="mb-6"
          >
            {content.heading}
          </Heading>
        )}

        {content.subheading && (
          editMode ? (
            <EditableText
              as="p"
              value={content.subheading}
              onChange={(value) => updateField('subheading', value)}
              style={style?.subheading}
              className="text-xl mb-8 max-w-3xl mx-auto"
            />
          ) : (
            <Text
              style={style?.subheading}
              className="text-xl mb-8 max-w-3xl mx-auto"
            >
              {content.subheading}
            </Text>
          )
        )}

        {content.body && (
          editMode ? (
            <EditableText
              as="p"
              value={content.body}
              onChange={(value) => updateField('body', value)}
              style={style?.body}
              className="mb-10 max-w-2xl mx-auto"
            />
          ) : (
            <Text
              style={style?.body}
              className="mb-10 max-w-2xl mx-auto"
            >
              {content.body}
            </Text>
          )
        )}

        {content.cta && (
          <div className="flex justify-center gap-4">
            {editMode ? (
              <EditableButton
                text={content.cta.text}
                href={content.cta.href}
                onTextChange={(value) => updateCta('text', value)}
                onHrefChange={(value) => updateCta('href', value)}
                style={style?.cta}
                variant="primary"
                size="lg"
              />
            ) : (
              <Button
                href={content.cta.href}
                style={style?.cta}
                variant="primary"
                size="lg"
              >
                {content.cta.text}
              </Button>
            )}

            {content.secondaryCta && (
              <Button
                href={content.secondaryCta.href}
                style={style?.secondaryCta}
                variant="outline"
                size="lg"
              >
                {content.secondaryCta.text}
              </Button>
            )}
          </div>
        )}

        {content.image && (
          <div className="mt-12">
            {editMode ? (
              <EditableImage
                src={content.image}
                alt={content.heading}
                onChange={(file) => {
                  // TODO: Upload file and update content.image with URL
                  console.log('Image upload:', file);
                }}
                className="rounded-lg shadow-2xl max-w-4xl mx-auto"
                objectFit="cover"
              />
            ) : (
              <Image
                src={content.image}
                alt={content.heading}
                className="rounded-lg shadow-2xl max-w-4xl mx-auto w-full"
                objectFit="cover"
                loading="eager"
                priority
              />
            )}
          </div>
        )}
      </Container>
    </Section>
  );
};

// ============================================================================
// VARIANT 2: SPLIT HERO (Image Left, Content Right)
// ============================================================================

const HeroSplit: React.FC<HeroProps> = ({
  content,
  style,
  editMode = false,
  onContentUpdate,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  canMoveUp,
  canMoveDown
}) => {
  const HeadingComponent = editMode ? EditableText : Heading;
  const TextComponent = editMode ? EditableText : Text;

  const updateField = (field: string, value: any) => {
    if (onContentUpdate) {
      onContentUpdate({ ...content, [field]: value });
    }
  };

  return (
    <Section
      background={style?.background || 'bg-white'}
      padding={style?.padding || 'py-20 px-4'}
      className="group"
    >
      {editMode && (
        <SectionControls
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
        />
      )}

      <Container maxWidth="xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <div>
            {content.image && (
              editMode ? (
                <EditableImage
                  src={content.image}
                  alt={content.heading}
                  onChange={(file) => console.log('Image upload:', file)}
                  className="rounded-lg shadow-xl w-full h-auto"
                  objectFit="cover"
                />
              ) : (
                <Image
                  src={content.image}
                  alt={content.heading}
                  className="rounded-lg shadow-xl w-full h-auto"
                  objectFit="cover"
                  loading="eager"
                  priority
                />
              )
            )}
          </div>

          {/* Content Column */}
          <div>
            {editMode ? (
              <EditableText
                as="h1"
                value={content.heading}
                onChange={(value) => updateField('heading', value)}
                style={style?.heading}
                className="mb-6"
                multiline={false}
              />
            ) : (
              <Heading level={1} style={style?.heading} className="mb-6">
                {content.heading}
              </Heading>
            )}

            {content.subheading && (
              editMode ? (
                <EditableText
                  as="p"
                  value={content.subheading}
                  onChange={(value) => updateField('subheading', value)}
                  style={style?.subheading}
                  className="text-xl mb-6"
                />
              ) : (
                <Text style={style?.subheading} className="text-xl mb-6">
                  {content.subheading}
                </Text>
              )
            )}

            {content.body && (
              editMode ? (
                <EditableText
                  as="p"
                  value={content.body}
                  onChange={(value) => updateField('body', value)}
                  style={style?.body}
                  className="mb-8"
                />
              ) : (
                <Text style={style?.body} className="mb-8">
                  {content.body}
                </Text>
              )
            )}

            {content.cta && (
              <div className="flex gap-4">
                <Button
                  href={content.cta.href}
                  style={style?.cta}
                  variant="primary"
                  size="lg"
                >
                  {content.cta.text}
                </Button>

                {content.secondaryCta && (
                  <Button
                    href={content.secondaryCta.href}
                    style={style?.secondaryCta}
                    variant="outline"
                    size="lg"
                  >
                    {content.secondaryCta.text}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
};

// ============================================================================
// VARIANT 3: MINIMAL HERO (Simple centered text, no background)
// ============================================================================

const HeroMinimal: React.FC<HeroProps> = ({
  content,
  style,
  editMode = false,
  onContentUpdate,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  canMoveUp,
  canMoveDown
}) => {
  const updateField = (field: string, value: any) => {
    if (onContentUpdate) {
      onContentUpdate({ ...content, [field]: value });
    }
  };

  return (
    <Section
      background={style?.background || 'bg-transparent'}
      padding={style?.padding || 'py-32 px-4'}
      className="group"
    >
      {editMode && (
        <SectionControls
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
        />
      )}

      <Container maxWidth="lg" className="text-center">
        {editMode ? (
          <EditableText
            as="h1"
            value={content.heading}
            onChange={(value) => updateField('heading', value)}
            style={style?.heading}
            className="mb-6"
            multiline={false}
          />
        ) : (
          <Heading level={1} style={style?.heading} className="mb-6">
            {content.heading}
          </Heading>
        )}

        {content.subheading && (
          editMode ? (
            <EditableText
              as="p"
              value={content.subheading}
              onChange={(value) => updateField('subheading', value)}
              style={style?.subheading}
              className="text-xl max-w-2xl mx-auto"
            />
          ) : (
            <Text style={style?.subheading} className="text-xl max-w-2xl mx-auto">
              {content.subheading}
            </Text>
          )
        )}
      </Container>
    </Section>
  );
};

// ============================================================================
// VARIANT 4: VIDEO HERO
// ============================================================================

const HeroVideo: React.FC<HeroProps> = ({
  content,
  style,
  editMode = false,
  onContentUpdate,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  canMoveUp,
  canMoveDown
}) => {
  const updateField = (field: string, value: any) => {
    if (onContentUpdate) {
      onContentUpdate({ ...content, [field]: value });
    }
  };

  const updateCta = (field: string, value: any) => {
    if (onContentUpdate && content.cta) {
      onContentUpdate({
        ...content,
        cta: { ...content.cta, [field]: value }
      });
    }
  };

  const videoUrl = content.image || 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-large.mp4';

  return (
    <Section
      background="bg-black"
      padding="py-0 px-0"
      className="group relative h-screen overflow-hidden"
    >
      {editMode && (
        <SectionControls
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
        />
      )}

      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <Container maxWidth="xl" className="relative z-10 h-full flex items-center justify-center text-center">
        <div className="max-w-4xl">
          {editMode ? (
            <EditableText
              as="h1"
              value={content.heading}
              onChange={(value) => updateField('heading', value)}
              style={style?.heading || { color: 'text-white', fontSize: 'text-6xl', fontWeight: 'font-black' }}
              className="mb-6"
              multiline={false}
            />
          ) : (
            <Heading 
              level={1} 
              style={style?.heading || { color: 'text-white', fontSize: 'text-6xl', fontWeight: 'font-black' }}
              className="mb-6"
            >
              {content.heading}
            </Heading>
          )}

          {content.subheading && (
            editMode ? (
              <EditableText
                as="p"
                value={content.subheading}
                onChange={(value) => updateField('subheading', value)}
                style={style?.subheading || { color: 'text-gray-200', fontSize: 'text-2xl' }}
                className="mb-10 max-w-3xl mx-auto"
              />
            ) : (
              <Text 
                style={style?.subheading || { color: 'text-gray-200', fontSize: 'text-2xl' }}
                className="mb-10 max-w-3xl mx-auto"
              >
                {content.subheading}
              </Text>
            )
          )}

          {content.cta && (
            <div className="flex gap-4 justify-center">
              {editMode ? (
                <EditableButton
                  text={content.cta.text}
                  href={content.cta.href}
                  onTextChange={(value) => updateCta('text', value)}
                  onHrefChange={(value) => updateCta('href', value)}
                  style={style?.cta}
                  variant="primary"
                  size="lg"
                />
              ) : (
                <Button
                  href={content.cta.href}
                  style={style?.cta}
                  variant="primary"
                  size="lg"
                >
                  {content.cta.text}
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </Section>
  );
};

// ============================================================================
// VARIANT 5: FULLSCREEN HERO
// ============================================================================

const HeroFullscreen: React.FC<HeroProps> = ({
  content,
  style,
  editMode = false,
  onContentUpdate,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  canMoveUp,
  canMoveDown
}) => {
  const updateField = (field: string, value: any) => {
    if (onContentUpdate) {
      onContentUpdate({ ...content, [field]: value });
    }
  };

  const updateCta = (field: string, value: any) => {
    if (onContentUpdate && content.cta) {
      onContentUpdate({
        ...content,
        cta: { ...content.cta, [field]: value }
      });
    }
  };

  return (
    <Section
      background={style?.background || 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600'}
      padding="py-0 px-4"
      className="group h-screen flex items-center justify-center"
    >
      {editMode && (
        <SectionControls
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
        />
      )}

      <Container maxWidth="xl" className="text-center">
        {editMode ? (
          <EditableText
            as="h1"
            value={content.heading}
            onChange={(value) => updateField('heading', value)}
            style={style?.heading || { color: 'text-white', fontSize: 'text-7xl', fontWeight: 'font-black' }}
            className="mb-8"
            multiline={false}
          />
        ) : (
          <Heading 
            level={1} 
            style={style?.heading || { color: 'text-white', fontSize: 'text-7xl', fontWeight: 'font-black' }}
            className="mb-8"
          >
            {content.heading}
          </Heading>
        )}

        {content.subheading && (
          editMode ? (
            <EditableText
              as="p"
              value={content.subheading}
              onChange={(value) => updateField('subheading', value)}
              style={style?.subheading || { color: 'text-white/90', fontSize: 'text-2xl' }}
              className="mb-12 max-w-3xl mx-auto"
            />
          ) : (
            <Text 
              style={style?.subheading || { color: 'text-white/90', fontSize: 'text-2xl' }}
              className="mb-12 max-w-3xl mx-auto"
            >
              {content.subheading}
            </Text>
          )
        )}

        {content.body && (
          editMode ? (
            <EditableText
              as="p"
              value={content.body}
              onChange={(value) => updateField('body', value)}
              style={style?.body || { color: 'text-white/80', fontSize: 'text-lg' }}
              className="mb-12 max-w-2xl mx-auto"
            />
          ) : (
            <Text 
              style={style?.body || { color: 'text-white/80', fontSize: 'text-lg' }}
              className="mb-12 max-w-2xl mx-auto"
            >
              {content.body}
            </Text>
          )
        )}

        {content.cta && (
          <div className="flex gap-4 justify-center flex-wrap">
            {editMode ? (
              <EditableButton
                text={content.cta.text}
                href={content.cta.href}
                onTextChange={(value) => updateCta('text', value)}
                onHrefChange={(value) => updateCta('href', value)}
                style={style?.cta}
                variant="primary"
                size="lg"
              />
            ) : (
              <Button
                href={content.cta.href}
                style={style?.cta || { background: 'bg-white', color: 'text-purple-600' }}
                variant="primary"
                size="lg"
              >
                {content.cta.text}
              </Button>
            )}

            {content.secondaryCta && (
              <Button
                href={content.secondaryCta.href}
                style={style?.secondaryCta || { borderColor: 'border-white', color: 'text-white' }}
                variant="outline"
                size="lg"
              >
                {content.secondaryCta.text}
              </Button>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
};

// ============================================================================
// VARIANT 6: OVERLAY HERO (Background image with overlay)
// ============================================================================

const HeroOverlay: React.FC<HeroProps> = ({
  content,
  style,
  editMode = false,
  onContentUpdate,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  canMoveUp,
  canMoveDown
}) => {
  const updateField = (field: string, value: any) => {
    if (onContentUpdate) {
      onContentUpdate({ ...content, [field]: value });
    }
  };

  const updateCta = (field: string, value: any) => {
    if (onContentUpdate && content.cta) {
      onContentUpdate({
        ...content,
        cta: { ...content.cta, [field]: value }
      });
    }
  };

  const backgroundImage = content.image || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000';

  return (
    <Section
      background="bg-black"
      padding="py-32 px-4"
      className="group relative min-h-[600px] flex items-center"
    >
      {editMode && (
        <SectionControls
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
        />
      )}

      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Content */}
      <Container maxWidth="xl" className="relative z-10">
        <div className="max-w-3xl">
          {editMode ? (
            <EditableText
              as="h1"
              value={content.heading}
              onChange={(value) => updateField('heading', value)}
              style={style?.heading || { color: 'text-white', fontSize: 'text-6xl', fontWeight: 'font-black' }}
              className="mb-6"
              multiline={false}
            />
          ) : (
            <Heading 
              level={1} 
              style={style?.heading || { color: 'text-white', fontSize: 'text-6xl', fontWeight: 'font-black' }}
              className="mb-6"
            >
              {content.heading}
            </Heading>
          )}

          {content.subheading && (
            editMode ? (
              <EditableText
                as="p"
                value={content.subheading}
                onChange={(value) => updateField('subheading', value)}
                style={style?.subheading || { color: 'text-gray-200', fontSize: 'text-2xl' }}
                className="mb-8"
              />
            ) : (
              <Text 
                style={style?.subheading || { color: 'text-gray-200', fontSize: 'text-2xl' }}
                className="mb-8"
              >
                {content.subheading}
              </Text>
            )
          )}

          {content.body && (
            editMode ? (
              <EditableText
                as="p"
                value={content.body}
                onChange={(value) => updateField('body', value)}
                style={style?.body || { color: 'text-gray-300', fontSize: 'text-lg' }}
                className="mb-10"
              />
            ) : (
              <Text 
                style={style?.body || { color: 'text-gray-300', fontSize: 'text-lg' }}
                className="mb-10"
              >
                {content.body}
              </Text>
            )
          )}

          {content.cta && (
            <div className="flex gap-4 flex-wrap">
              {editMode ? (
                <EditableButton
                  text={content.cta.text}
                  href={content.cta.href}
                  onTextChange={(value) => updateCta('text', value)}
                  onHrefChange={(value) => updateCta('href', value)}
                  style={style?.cta}
                  variant="primary"
                  size="lg"
                />
              ) : (
                <Button
                  href={content.cta.href}
                  style={style?.cta}
                  variant="primary"
                  size="lg"
                >
                  {content.cta.text}
                </Button>
              )}

              {content.secondaryCta && (
                <Button
                  href={content.secondaryCta.href}
                  style={style?.secondaryCta || { borderColor: 'border-white', color: 'text-white' }}
                  variant="outline"
                  size="lg"
                >
                  {content.secondaryCta.text}
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};

// ============================================================================
// VARIANT 7: ANIMATED HERO
// ============================================================================

const HeroAnimated: React.FC<HeroProps> = ({
  content,
  style,
  editMode = false,
  onContentUpdate,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  canMoveUp,
  canMoveDown
}) => {
  const updateField = (field: string, value: any) => {
    if (onContentUpdate) {
      onContentUpdate({ ...content, [field]: value });
    }
  };

  const updateCta = (field: string, value: any) => {
    if (onContentUpdate && content.cta) {
      onContentUpdate({
        ...content,
        cta: { ...content.cta, [field]: value }
      });
    }
  };

  return (
    <Section
      background={style?.background || 'bg-gradient-to-br from-indigo-50 to-purple-50'}
      padding={style?.padding || 'py-24 px-4'}
      className="group"
    >
      {editMode && (
        <SectionControls
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
        />
      )}

      <Container maxWidth="xl" className="text-center">
        {/* Animated floating shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10">
          {editMode ? (
            <EditableText
              as="h1"
              value={content.heading}
              onChange={(value) => updateField('heading', value)}
              style={style?.heading}
              className="mb-6 animate-fade-in-up"
              multiline={false}
            />
          ) : (
            <Heading 
              level={1} 
              style={style?.heading}
              className="mb-6 animate-fade-in-up"
            >
              {content.heading}
            </Heading>
          )}

          {content.subheading && (
            editMode ? (
              <EditableText
                as="p"
                value={content.subheading}
                onChange={(value) => updateField('subheading', value)}
                style={style?.subheading}
                className="text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200"
              />
            ) : (
              <Text 
                style={style?.subheading}
                className="text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200"
              >
                {content.subheading}
              </Text>
            )
          )}

          {content.body && (
            editMode ? (
              <EditableText
                as="p"
                value={content.body}
                onChange={(value) => updateField('body', value)}
                style={style?.body}
                className="max-w-3xl mx-auto mb-10 animate-fade-in-up animation-delay-400"
              />
            ) : (
              <Text 
                style={style?.body}
                className="max-w-3xl mx-auto mb-10 animate-fade-in-up animation-delay-400"
              >
                {content.body}
              </Text>
            )
          )}

          {content.cta && (
            <div className="flex gap-4 justify-center flex-wrap animate-fade-in-up animation-delay-600">
              {editMode ? (
                <EditableButton
                  text={content.cta.text}
                  href={content.cta.href}
                  onTextChange={(value) => updateCta('text', value)}
                  onHrefChange={(value) => updateCta('href', value)}
                  style={style?.cta}
                  variant="primary"
                  size="lg"
                />
              ) : (
                <Button
                  href={content.cta.href}
                  style={style?.cta}
                  variant="primary"
                  size="lg"
                  className="hover:scale-105 transition-transform"
                >
                  {content.cta.text}
                </Button>
              )}

              {content.secondaryCta && (
                <Button
                  href={content.secondaryCta.href}
                  style={style?.secondaryCta}
                  variant="outline"
                  size="lg"
                  className="hover:scale-105 transition-transform"
                >
                  {content.secondaryCta.text}
                </Button>
              )}
            </div>
          )}

          {content.image && (
            <div className="mt-16 animate-fade-in-up animation-delay-800">
              {editMode ? (
                <EditableImage
                  src={content.image}
                  alt={content.heading}
                  onChange={(file) => console.log('Image upload:', file)}
                  className="rounded-lg shadow-2xl max-w-4xl mx-auto hover:scale-105 transition-transform duration-500"
                  objectFit="cover"
                />
              ) : (
                <Image
                  src={content.image}
                  alt={content.heading}
                  className="rounded-lg shadow-2xl max-w-4xl mx-auto w-full hover:scale-105 transition-transform duration-500"
                  objectFit="cover"
                  loading="lazy"
                />
              )}
            </div>
          )}
        </div>
      </Container>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </Section>
  );
};

// ============================================================================
// VARIANT 8: GRADIENT HERO
// ============================================================================

const HeroGradient: React.FC<HeroProps> = ({
  content,
  style,
  editMode = false,
  onContentUpdate,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  canMoveUp,
  canMoveDown
}) => {
  const updateField = (field: string, value: any) => {
    if (onContentUpdate) {
      onContentUpdate({ ...content, [field]: value });
    }
  };

  const updateCta = (field: string, value: any) => {
    if (onContentUpdate && content.cta) {
      onContentUpdate({
        ...content,
        cta: { ...content.cta, [field]: value }
      });
    }
  };

  return (
    <Section
      background={style?.background || 'bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600'}
      padding={style?.padding || 'py-32 px-4'}
      className="group relative overflow-hidden"
    >
      {editMode && (
        <SectionControls
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
        />
      )}

      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000" />
      </div>

      <Container maxWidth="xl" className="relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content Column */}
          <div>
            {editMode ? (
              <EditableText
                as="h1"
                value={content.heading}
                onChange={(value) => updateField('heading', value)}
                style={style?.heading || { color: 'text-white', fontSize: 'text-6xl', fontWeight: 'font-black' }}
                className="mb-6"
                multiline={false}
              />
            ) : (
              <Heading 
                level={1} 
                style={style?.heading || { color: 'text-white', fontSize: 'text-6xl', fontWeight: 'font-black' }}
                className="mb-6"
              >
                {content.heading}
              </Heading>
            )}

            {content.subheading && (
              editMode ? (
                <EditableText
                  as="p"
                  value={content.subheading}
                  onChange={(value) => updateField('subheading', value)}
                  style={style?.subheading || { color: 'text-white/90', fontSize: 'text-xl' }}
                  className="mb-8"
                />
              ) : (
                <Text 
                  style={style?.subheading || { color: 'text-white/90', fontSize: 'text-xl' }}
                  className="mb-8"
                >
                  {content.subheading}
                </Text>
              )
            )}

            {content.body && (
              editMode ? (
                <EditableText
                  as="p"
                  value={content.body}
                  onChange={(value) => updateField('body', value)}
                  style={style?.body || { color: 'text-white/80', fontSize: 'text-lg' }}
                  className="mb-10"
                />
              ) : (
                <Text 
                  style={style?.body || { color: 'text-white/80', fontSize: 'text-lg' }}
                  className="mb-10"
                >
                  {content.body}
                </Text>
              )
            )}

            {content.cta && (
              <div className="flex gap-4 flex-wrap">
                {editMode ? (
                  <EditableButton
                    text={content.cta.text}
                    href={content.cta.href}
                    onTextChange={(value) => updateCta('text', value)}
                    onHrefChange={(value) => updateCta('href', value)}
                    style={style?.cta || { background: 'bg-white', color: 'text-purple-600' }}
                    variant="primary"
                    size="lg"
                  />
                ) : (
                  <Button
                    href={content.cta.href}
                    style={style?.cta || { background: 'bg-white', color: 'text-purple-600' }}
                    variant="primary"
                    size="lg"
                  >
                    {content.cta.text}
                  </Button>
                )}

                {content.secondaryCta && (
                  <Button
                    href={content.secondaryCta.href}
                    style={style?.secondaryCta || { borderColor: 'border-white', color: 'text-white' }}
                    variant="outline"
                    size="lg"
                  >
                    {content.secondaryCta.text}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Visual Element - Abstract shapes */}
          <div className="relative">
            {content.image ? (
              editMode ? (
                <EditableImage
                  src={content.image}
                  alt={content.heading}
                  onChange={(file) => console.log('Image upload:', file)}
                  className="rounded-2xl shadow-2xl"
                  objectFit="cover"
                />
              ) : (
                <Image
                  src={content.image}
                  alt={content.heading}
                  className="rounded-2xl shadow-2xl w-full"
                  objectFit="cover"
                  loading="eager"
                  priority
                />
              )
            ) : (
              <div className="relative h-96 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl" />
                <div className="relative grid grid-cols-2 gap-4 p-8">
                  <div className="w-32 h-32 bg-white/20 rounded-2xl backdrop-blur-md" />
                  <div className="w-32 h-32 bg-white/20 rounded-2xl backdrop-blur-md mt-8" />
                  <div className="w-32 h-32 bg-white/20 rounded-2xl backdrop-blur-md -mt-8" />
                  <div className="w-32 h-32 bg-white/20 rounded-2xl backdrop-blur-md" />
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default HeroSection;

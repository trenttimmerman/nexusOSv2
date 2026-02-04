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

const HeroVideo: React.FC<HeroProps> = (props) => {
  // TODO: Implement video background hero
  return <HeroCentered {...props} />;
};

// ============================================================================
// VARIANT 5: FULLSCREEN HERO
// ============================================================================

const HeroFullscreen: React.FC<HeroProps> = (props) => {
  // TODO: Implement fullscreen hero (100vh)
  return <HeroCentered {...props} />;
};

// ============================================================================
// VARIANT 6: OVERLAY HERO (Background image with overlay)
// ============================================================================

const HeroOverlay: React.FC<HeroProps> = (props) => {
  // TODO: Implement overlay hero
  return <HeroCentered {...props} />;
};

// ============================================================================
// VARIANT 7: ANIMATED HERO
// ============================================================================

const HeroAnimated: React.FC<HeroProps> = (props) => {
  // TODO: Implement animated hero with fade-in effects
  return <HeroCentered {...props} />;
};

// ============================================================================
// VARIANT 8: GRADIENT HERO
// ============================================================================

const HeroGradient: React.FC<HeroProps> = (props) => {
  // TODO: Implement gradient background hero
  return <HeroCentered {...props} />;
};

export default HeroSection;

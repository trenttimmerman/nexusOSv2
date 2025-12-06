export interface UniversalSectionData {
  // Core Content
  heading?: string;
  subheading?: string;
  text?: string;
  image?: string;
  videoUrl?: string;
  
  // Actions
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  
  // Collections
  items?: Array<{
    id: string;
    title?: string;
    description?: string;
    image?: string;
    icon?: string;
    link?: string;
    price?: string;
  }>;

  // Design Overrides
  style?: {
    padding?: 's' | 'm' | 'l' | 'auto';
    background?: 'white' | 'black' | 'accent' | 'auto';
    alignment?: 'left' | 'center' | 'right' | 'auto';
  };
  
  [key: string]: any; // Allow loose props for now
}

export const mapDataToLayout = (currentData: UniversalSectionData, targetLayoutId: string): UniversalSectionData => {
  const newData = { ...currentData };

  // Ensure items array exists if we're moving to a list-based layout
  // We can infer list-based layouts by checking if the target ID contains 'grid', 'list', 'slider', 'features', 'collection'
  const isListLayout = ['grid', 'list', 'slider', 'features', 'collection', 'cards', 'columns'].some(k => targetLayoutId.includes(k));

  if (isListLayout && (!newData.items || newData.items.length === 0)) {
    // Convert single content to first item
    newData.items = [
      {
        id: '1',
        title: newData.heading || 'Feature 1',
        description: newData.subheading || newData.text || 'Description',
        image: newData.image,
        link: newData.buttonLink
      },
      { id: '2', title: 'Feature 2', description: 'Description', image: '' },
      { id: '3', title: 'Feature 3', description: 'Description', image: '' }
    ];
  }

  // If moving FROM a list layout TO a single layout
  // We might want to promote the first item's content to the main content if main content is empty
  if (!isListLayout && newData.items && newData.items.length > 0) {
    const firstItem = newData.items[0];
    if (!newData.image && firstItem.image) newData.image = firstItem.image;
    // We generally prefer to keep the main heading if it exists, so we don't overwrite it with item title
  }

  return newData;
};

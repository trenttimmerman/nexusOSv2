// TEMPORARY COMPATIBILITY LAYER
// This file bridges legacy imports to new component system
// TODO: Remove once all files are migrated to new imports

import { EditableText, EditableImage } from './editor';

// Re-export editor components for legacy compatibility
export { EditableText, EditableImage };

// Legacy component constants (empty for now - will be populated as needed)
export const HERO_COMPONENTS: Record<string, any> = {};
export const HERO_OPTIONS: any[] = [];
export const HERO_FIELDS: Record<string, any> = {};

// Stub for HeroCanvas component
export const HeroCanvas = () => null;

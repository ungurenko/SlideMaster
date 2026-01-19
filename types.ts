
// Position and size of a block in 1080x1350 coordinates
export interface BlockPosition {
  x: number;      // 0-1080
  y: number;      // 0-1350
  width: number;
  height: number;
}

// Text block type
export type TextBlockType = 'title' | 'subtitle' | 'body' | 'custom';

// Positioned text block
export interface TextBlock {
  id: string;
  type: TextBlockType;
  content: string;           // HTML content (rich text)
  position: BlockPosition;
  textAlign?: 'left' | 'center' | 'right';
  // Optional style overrides
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
}

export interface SlideData {
  id: string;
  text: string;
  title?: string;
  subtitle?: string;
  isCover: boolean;
  // New positioned blocks format
  blocks?: TextBlock[];
  usePositionedBlocks?: boolean;
}

export enum FontFamily {
  Montserrat = 'Montserrat',
  OpenSans = 'Open Sans',
  Oswald = 'Oswald',
  PTSerif = 'PT Serif',
  PlayfairDisplay = 'Playfair Display',
  Merriweather = 'Merriweather',
  PTSans = 'PT Sans',
  Raleway = 'Raleway',
  Roboto = 'Roboto',
}

export interface FontOption {
  label: string;
  value: string;
  type: 'google' | 'custom';
}

export const DEFAULT_FONT_OPTIONS: FontOption[] = [
  { label: 'Montserrat', value: 'Montserrat', type: 'google' },
  { label: 'Open Sans', value: 'Open Sans', type: 'google' },
  { label: 'Oswald', value: 'Oswald', type: 'google' },
  { label: 'PT Serif', value: 'PT Serif', type: 'google' },
  { label: 'Playfair Display', value: 'Playfair Display', type: 'google' },
  { label: 'Merriweather', value: 'Merriweather', type: 'google' },
  { label: 'PT Sans', value: 'PT Sans', type: 'google' },
  { label: 'Raleway', value: 'Raleway', type: 'google' },
  { label: 'Roboto', value: 'Roboto', type: 'google' },
];

export interface CarouselConfig {
  backgroundImage: string | null;
  titleFont: string;
  titleFontSize: number;
  bodyFont: string;
  bodyFontSize: number;
  textColor: string;
  titleColor?: string;
  bodyColor?: string;
  noiseOpacity: number; // 0-100
  overlayOpacity: number; // 0-100

  // Text positioning
  textVerticalAlign: 'top' | 'center' | 'bottom';

  // Padding (px)
  textPaddingTop: number;
  textPaddingBottom: number;
  textPaddingHorizontal: number;

  // Line height
  titleLineHeight: number;
  bodyLineHeight: number;

  // Text block width (%)
  textMaxWidth: number;

  // Cover text position
  coverTextPosition: 'bottom' | 'center';
}

export interface StylePreset {
  id: string;
  name: string;
  config: Omit<CarouselConfig, 'backgroundImage'>;
}

export interface SavedProject {
  id: string;
  name: string;
  timestamp: number;
  slides: SlideData[];
  config: CarouselConfig;
}

export interface HeroImage {
  id: string;
  url: string; // Base64 or URL
  caption?: string;
}

// NEW: Unified Template Interface
export interface Template {
  id: string;
  name: string;
  previewColor: string; // For Welcome Screen card bg
  textColor: string;    // For Welcome Screen card text
  isHidden: boolean;
  config: CarouselConfig;
}

// MOVED: Default Templates Source of Truth
export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'startup',
    name: 'СТАРТАП',
    previewColor: '#1E293B',
    textColor: '#FFFFFF',
    isHidden: false,
    config: {
      backgroundImage: null,
      titleFont: 'Montserrat',
      titleFontSize: 75,
      bodyFont: 'Open Sans',
      bodyFontSize: 38,
      titleColor: '#FFFFFF',
      bodyColor: '#F5F5F5',
      textColor: '#F5F5F5',
      overlayOpacity: 50,
      noiseOpacity: 8,
      textVerticalAlign: 'top',
      textPaddingTop: 60,
      textPaddingBottom: 60,
      textPaddingHorizontal: 60,
      titleLineHeight: 1.2,
      bodyLineHeight: 1.5,
      textMaxWidth: 100,
      coverTextPosition: 'bottom'
    }
  },
  {
    id: 'drama',
    name: 'ДРАМА',
    previewColor: '#000000',
    textColor: '#FFFFFF',
    isHidden: false,
    config: {
      backgroundImage: null,
      titleFont: 'Oswald',
      titleFontSize: 85,
      bodyFont: 'PT Serif',
      bodyFontSize: 36,
      titleColor: '#FFFFFF',
      bodyColor: '#EEEEEE',
      textColor: '#EEEEEE',
      overlayOpacity: 65,
      noiseOpacity: 18,
      textVerticalAlign: 'top',
      textPaddingTop: 60,
      textPaddingBottom: 60,
      textPaddingHorizontal: 60,
      titleLineHeight: 1.2,
      bodyLineHeight: 1.5,
      textMaxWidth: 100,
      coverTextPosition: 'bottom'
    }
  },
  {
    id: 'luxe',
    name: 'ЛЮКС',
    previewColor: '#5D4037',
    textColor: '#FFF8F0',
    isHidden: false,
    config: {
      backgroundImage: null,
      titleFont: 'Playfair Display',
      titleFontSize: 70,
      bodyFont: 'Merriweather',
      bodyFontSize: 34,
      titleColor: '#FFF8F0',
      bodyColor: '#F5EFE6',
      textColor: '#F5EFE6',
      overlayOpacity: 40,
      noiseOpacity: 5,
      textVerticalAlign: 'top',
      textPaddingTop: 60,
      textPaddingBottom: 60,
      textPaddingHorizontal: 60,
      titleLineHeight: 1.2,
      bodyLineHeight: 1.5,
      textMaxWidth: 100,
      coverTextPosition: 'bottom'
    }
  },
  {
    id: 'simple',
    name: 'ПРОСТОТА',
    previewColor: '#64748B',
    textColor: '#FFFFFF',
    isHidden: false,
    config: {
      backgroundImage: null,
      titleFont: 'PT Sans',
      titleFontSize: 68,
      bodyFont: 'PT Sans',
      bodyFontSize: 40,
      titleColor: '#FFFFFF',
      bodyColor: '#F0F0F0',
      textColor: '#F0F0F0',
      overlayOpacity: 45,
      noiseOpacity: 12,
      textVerticalAlign: 'top',
      textPaddingTop: 60,
      textPaddingBottom: 60,
      textPaddingHorizontal: 60,
      titleLineHeight: 1.2,
      bodyLineHeight: 1.5,
      textMaxWidth: 100,
      coverTextPosition: 'bottom'
    }
  },
  {
    id: 'air',
    name: 'ВОЗДУХ',
    previewColor: '#B0BEC5',
    textColor: '#FFFFFF',
    isHidden: false,
    config: {
      backgroundImage: null,
      titleFont: 'Raleway',
      titleFontSize: 72,
      bodyFont: 'Roboto',
      bodyFontSize: 37,
      titleColor: '#FFFFFF',
      bodyColor: '#FAFAFA',
      textColor: '#FAFAFA',
      overlayOpacity: 35,
      noiseOpacity: 10,
      textVerticalAlign: 'top',
      textPaddingTop: 60,
      textPaddingBottom: 60,
      textPaddingHorizontal: 60,
      titleLineHeight: 1.2,
      bodyLineHeight: 1.5,
      textMaxWidth: 100,
      coverTextPosition: 'bottom'
    }
  },
  {
    id: 'neon',
    name: 'НЕОН',
    previewColor: '#0F0F0F',
    textColor: '#00FF94',
    isHidden: false,
    config: {
      backgroundImage: null,
      titleFont: 'Oswald',
      titleFontSize: 82,
      bodyFont: 'Roboto',
      bodyFontSize: 38,
      titleColor: '#00FF94',
      bodyColor: '#FFFFFF',
      textColor: '#FFFFFF',
      overlayOpacity: 70,
      noiseOpacity: 5,
      textVerticalAlign: 'top',
      textPaddingTop: 60,
      textPaddingBottom: 60,
      textPaddingHorizontal: 60,
      titleLineHeight: 1.2,
      bodyLineHeight: 1.5,
      textMaxWidth: 100,
      coverTextPosition: 'bottom'
    }
  }
];

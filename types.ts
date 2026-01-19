
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
  // CTA slide fields
  isCTA?: boolean;
  ctaTopText?: string;
  ctaBottomText?: string;
  ctaImage?: string;           // Base64 of uploaded image
  ctaImageBorderRadius?: number; // Border radius in px (default: 24)
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
  Inter = 'Inter',
  Rubik = 'Rubik',
  Lora = 'Lora',
  CormorantGaramond = 'Cormorant Garamond',
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
  { label: 'Inter', value: 'Inter', type: 'google' },
  { label: 'Rubik', value: 'Rubik', type: 'google' },
  { label: 'Lora', value: 'Lora', type: 'google' },
  { label: 'Cormorant Garamond', value: 'Cormorant Garamond', type: 'google' },
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
    id: 'minimalism',
    name: 'МИНИМАЛИЗМ',
    previewColor: '#2D3748',
    textColor: '#FFFFFF',
    isHidden: false,
    config: {
      backgroundImage: null,
      titleFont: 'Inter',
      titleFontSize: 68,
      bodyFont: 'Inter',
      bodyFontSize: 36,
      titleColor: '#FFFFFF',
      bodyColor: '#FAFAFA',
      textColor: '#FAFAFA',
      overlayOpacity: 35,
      noiseOpacity: 5,
      textVerticalAlign: 'center',
      textPaddingTop: 60,
      textPaddingBottom: 60,
      textPaddingHorizontal: 80,
      titleLineHeight: 1.3,
      bodyLineHeight: 1.6,
      textMaxWidth: 85,
      coverTextPosition: 'center'
    }
  },
  {
    id: 'elegant',
    name: 'ЭЛЕГАНТ',
    previewColor: '#5D4E37',
    textColor: '#FFF8F0',
    isHidden: false,
    config: {
      backgroundImage: null,
      titleFont: 'Cormorant Garamond',
      titleFontSize: 72,
      bodyFont: 'Lora',
      bodyFontSize: 34,
      titleColor: '#FFF8F0',
      bodyColor: '#F5EFE6',
      textColor: '#F5EFE6',
      overlayOpacity: 45,
      noiseOpacity: 3,
      textVerticalAlign: 'center',
      textPaddingTop: 60,
      textPaddingBottom: 60,
      textPaddingHorizontal: 70,
      titleLineHeight: 1.2,
      bodyLineHeight: 1.7,
      textMaxWidth: 90,
      coverTextPosition: 'center'
    }
  },
  {
    id: 'modern',
    name: 'МОДЕРН',
    previewColor: '#1A365D',
    textColor: '#FFFFFF',
    isHidden: false,
    config: {
      backgroundImage: null,
      titleFont: 'Montserrat',
      titleFontSize: 70,
      bodyFont: 'Rubik',
      bodyFontSize: 36,
      titleColor: '#FFFFFF',
      bodyColor: '#FAFAFA',
      textColor: '#FAFAFA',
      overlayOpacity: 50,
      noiseOpacity: 8,
      textVerticalAlign: 'center',
      textPaddingTop: 60,
      textPaddingBottom: 60,
      textPaddingHorizontal: 65,
      titleLineHeight: 1.25,
      bodyLineHeight: 1.6,
      textMaxWidth: 95,
      coverTextPosition: 'center'
    }
  },
  {
    id: 'drama',
    name: 'ДРАМА',
    previewColor: '#0A0A0A',
    textColor: '#FFFFFF',
    isHidden: false,
    config: {
      backgroundImage: null,
      titleFont: 'Oswald',
      titleFontSize: 80,
      bodyFont: 'PT Serif',
      bodyFontSize: 34,
      titleColor: '#FFFFFF',
      bodyColor: '#EEEEEE',
      textColor: '#EEEEEE',
      overlayOpacity: 70,
      noiseOpacity: 15,
      textVerticalAlign: 'bottom',
      textPaddingTop: 60,
      textPaddingBottom: 80,
      textPaddingHorizontal: 60,
      titleLineHeight: 1.1,
      bodyLineHeight: 1.6,
      textMaxWidth: 100,
      coverTextPosition: 'bottom'
    }
  },
  {
    id: 'bold',
    name: 'BOLD',
    previewColor: '#1A1A2E',
    textColor: '#FFFFFF',
    isHidden: false,
    config: {
      backgroundImage: null,
      titleFont: 'Montserrat',
      titleFontSize: 85,
      bodyFont: 'Roboto',
      bodyFontSize: 38,
      titleColor: '#FFFFFF',
      bodyColor: '#F5F5F5',
      textColor: '#F5F5F5',
      overlayOpacity: 65,
      noiseOpacity: 10,
      textVerticalAlign: 'bottom',
      textPaddingTop: 60,
      textPaddingBottom: 70,
      textPaddingHorizontal: 55,
      titleLineHeight: 1.05,
      bodyLineHeight: 1.55,
      textMaxWidth: 100,
      coverTextPosition: 'bottom'
    }
  }
];

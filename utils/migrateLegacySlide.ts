import { SlideData, TextBlock, CarouselConfig } from '../types';

// Default positions for cover slides (title at bottom center)
const COVER_SLIDE_DEFAULTS = {
  title: { x: 60, y: 1050, width: 960, height: 150 },
  subtitle: { x: 60, y: 1200, width: 960, height: 80 },
};

// Default positions for content slides (title at top, body below)
const CONTENT_SLIDE_DEFAULTS = {
  title: { x: 60, y: 60, width: 960, height: 100 },
  body: { x: 60, y: 180, width: 960, height: 800 },
};

export function migrateLegacySlide(
  slide: SlideData,
  config: CarouselConfig
): SlideData {
  // Already in new format
  if (slide.usePositionedBlocks && slide.blocks) {
    return slide;
  }

  const blocks: TextBlock[] = [];
  const titleColor = config.titleColor || config.textColor;
  const bodyColor = config.bodyColor || config.textColor;

  if (slide.isCover) {
    // Cover slide migration
    if (slide.text) {
      blocks.push({
        id: `${slide.id}-title`,
        type: 'title',
        content: slide.text,
        position: COVER_SLIDE_DEFAULTS.title,
        textAlign: 'center',
        fontFamily: config.titleFont,
        fontSize: config.titleFontSize,
        color: titleColor,
        fontWeight: 900,
      });
    }
    if (slide.subtitle) {
      blocks.push({
        id: `${slide.id}-subtitle`,
        type: 'subtitle',
        content: slide.subtitle,
        position: COVER_SLIDE_DEFAULTS.subtitle,
        textAlign: 'center',
        fontFamily: config.bodyFont,
        fontSize: config.bodyFontSize,
        color: bodyColor,
        fontWeight: 400,
      });
    }
  } else {
    // Content slide migration
    if (slide.title) {
      blocks.push({
        id: `${slide.id}-title`,
        type: 'title',
        content: slide.title,
        position: CONTENT_SLIDE_DEFAULTS.title,
        textAlign: 'left',
        fontFamily: config.titleFont,
        fontSize: 64,
        color: titleColor,
        fontWeight: 900,
      });
    }
    if (slide.text) {
      blocks.push({
        id: `${slide.id}-body`,
        type: 'body',
        content: slide.text,
        position: CONTENT_SLIDE_DEFAULTS.body,
        textAlign: 'left',
        fontFamily: config.bodyFont,
        fontSize: config.bodyFontSize,
        color: bodyColor,
        fontWeight: 400,
      });
    }
  }

  return {
    ...slide,
    blocks,
    usePositionedBlocks: true,
  };
}

// Batch migration for projects
export function migrateProject(
  slides: SlideData[],
  config: CarouselConfig
): SlideData[] {
  return slides.map((slide) => migrateLegacySlide(slide, config));
}

// Create default blocks for new slides
export function createDefaultBlocks(
  slideId: string,
  isCover: boolean,
  config: CarouselConfig
): TextBlock[] {
  const titleColor = config.titleColor || config.textColor;
  const bodyColor = config.bodyColor || config.textColor;

  if (isCover) {
    return [
      {
        id: `${slideId}-title`,
        type: 'title',
        content: '',
        position: COVER_SLIDE_DEFAULTS.title,
        textAlign: 'center',
        fontFamily: config.titleFont,
        fontSize: config.titleFontSize,
        color: titleColor,
        fontWeight: 900,
      },
      {
        id: `${slideId}-subtitle`,
        type: 'subtitle',
        content: '',
        position: COVER_SLIDE_DEFAULTS.subtitle,
        textAlign: 'center',
        fontFamily: config.bodyFont,
        fontSize: config.bodyFontSize,
        color: bodyColor,
        fontWeight: 400,
      },
    ];
  }

  return [
    {
      id: `${slideId}-title`,
      type: 'title',
      content: '',
      position: CONTENT_SLIDE_DEFAULTS.title,
      textAlign: 'left',
      fontFamily: config.titleFont,
      fontSize: 64,
      color: titleColor,
      fontWeight: 900,
    },
    {
      id: `${slideId}-body`,
      type: 'body',
      content: '',
      position: CONTENT_SLIDE_DEFAULTS.body,
      textAlign: 'left',
      fontFamily: config.bodyFont,
      fontSize: config.bodyFontSize,
      color: bodyColor,
      fontWeight: 400,
    },
  ];
}

import { CarouselConfig } from '../types';

/**
 * Migrates old CarouselConfig objects to include new text positioning fields.
 * Uses nullish coalescing to preserve existing values while adding defaults for missing fields.
 */
export function migrateConfig(config: Partial<CarouselConfig>): CarouselConfig {
  return {
    // Existing fields (preserve as-is)
    backgroundImage: config.backgroundImage ?? null,
    titleFont: config.titleFont ?? 'Montserrat',
    titleFontSize: config.titleFontSize ?? 75,
    bodyFont: config.bodyFont ?? 'Open Sans',
    bodyFontSize: config.bodyFontSize ?? 38,
    textColor: config.textColor ?? '#FFFFFF',
    titleColor: config.titleColor,
    bodyColor: config.bodyColor,
    noiseOpacity: config.noiseOpacity ?? 8,
    overlayOpacity: config.overlayOpacity ?? 50,

    // New text positioning fields with defaults
    textVerticalAlign: config.textVerticalAlign ?? 'top',
    textPaddingTop: config.textPaddingTop ?? 60,
    textPaddingBottom: config.textPaddingBottom ?? 60,
    textPaddingHorizontal: config.textPaddingHorizontal ?? 60,
    titleLineHeight: config.titleLineHeight ?? 1.2,
    bodyLineHeight: config.bodyLineHeight ?? 1.5,
    textMaxWidth: config.textMaxWidth ?? 100,

    // Cover text position
    coverTextPosition: config.coverTextPosition ?? 'bottom',
  };
}

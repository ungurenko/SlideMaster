
import React, { useRef, useEffect } from 'react';
import { SlideData, TextBlock, CarouselConfig } from '../types';
import { RichTextEditor } from './RichTextEditor';
import { SlideEditor } from './draggable';

interface SlideCanvasProps {
  slide: SlideData;
  config: CarouselConfig;
  onTextChange: (id: string, text: string) => void;
  onTitleChange?: (id: string, title: string) => void;
  onSubtitleChange?: (id: string, subtitle: string) => void;
  onBlocksChange?: (id: string, blocks: TextBlock[]) => void;
  scale?: number;
  forwardedRef?: React.Ref<HTMLDivElement>;
}

// Updated Noise: type='fractalNoise' with high baseFrequency='1.5' for very fine, static-like grain.
const NOISE_SVG_DATA_URI = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
  slide,
  config,
  onTextChange,
  onTitleChange,
  onSubtitleChange,
  onBlocksChange,
  scale = 1,
  forwardedRef,
}) => {
  // If using positioned blocks mode, render SlideEditor instead
  if (slide.usePositionedBlocks && slide.blocks && onBlocksChange) {
    return (
      <SlideEditor
        slide={slide}
        config={config}
        scale={scale}
        onUpdateBlocks={(blocks) => onBlocksChange(slide.id, blocks)}
        forwardedRef={forwardedRef}
      />
    );
  }

  // Resolve colors with fallback to general textColor
  const titleColor = config.titleColor || config.textColor;
  const bodyColor = config.bodyColor || config.textColor;

  // CTA Slide Layout
  if (slide.isCTA) {
    const borderRadius = slide.ctaImageBorderRadius ?? 24;

    const containerStyle = {
      width: '1080px',
      height: '1350px',
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      backgroundColor: '#1a1816',
    };

    const wrapperStyle = {
      width: `${1080 * scale}px`,
      height: `${1350 * scale}px`,
    };

    return (
      <div style={wrapperStyle} className="relative overflow-hidden shadow-lg rounded-sm ring-1 ring-black/5">
        <div
          ref={forwardedRef}
          style={containerStyle}
          className="relative flex flex-col overflow-hidden"
        >
          {/* Background Image Layer */}
          {config.backgroundImage && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${config.backgroundImage})`,
              }}
            />
          )}

          {/* Dark Overlay */}
          <div
            className="absolute inset-0 bg-[#0F0E0D] transition-colors duration-300"
            style={{ opacity: config.overlayOpacity / 100 }}
          />

          {/* Noise Texture */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay export-noise-layer"
            style={{
              backgroundImage: `url("${NOISE_SVG_DATA_URI}")`,
              opacity: config.noiseOpacity / 100
            }}
          />

          {/* CTA Content Layout */}
          <div className="relative z-20 w-full h-full flex flex-col items-center justify-between py-[80px] px-[60px]">
            {/* Top Text - approx 15% */}
            <div className="w-full text-center" style={{ flex: '0 0 auto' }}>
              <div
                style={{
                  fontFamily: config.titleFont,
                  fontSize: `${config.titleFontSize}px`,
                  fontWeight: 700,
                  color: titleColor,
                  lineHeight: config.titleLineHeight || 1.3,
                  textShadow: '0 4px 24px rgba(0,0,0,0.5)',
                }}
              >
                {slide.ctaTopText || ''}
              </div>
            </div>

            {/* Center Image - approx 55% */}
            <div
              className="flex-1 flex items-center justify-center w-full my-[40px]"
              style={{ maxHeight: '60%' }}
            >
              {slide.ctaImage ? (
                <div
                  className="relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                  style={{
                    borderRadius: `${borderRadius}px`,
                    maxWidth: '85%',
                    maxHeight: '100%',
                  }}
                >
                  <img
                    src={slide.ctaImage}
                    alt="CTA"
                    className="w-full h-full object-contain"
                    style={{ maxHeight: '650px' }}
                  />
                </div>
              ) : (
                <div
                  className="w-[85%] h-[500px] bg-white/10 flex items-center justify-center text-white/30"
                  style={{ borderRadius: `${borderRadius}px` }}
                >
                  {/* Placeholder icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Bottom CTA Text - approx 15% */}
            <div className="w-full text-center" style={{ flex: '0 0 auto' }}>
              <div
                style={{
                  fontFamily: config.bodyFont,
                  fontSize: `${config.bodyFontSize + 8}px`,
                  fontWeight: 500,
                  color: bodyColor,
                  lineHeight: config.bodyLineHeight || 1.5,
                  textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                }}
              >
                {slide.ctaBottomText || ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Dimensions: 1080x1350 (Portrait)
  const containerStyle = {
    width: '1080px',
    height: '1350px',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    backgroundColor: '#1a1816', // Dark base for better blending
  };

  const wrapperStyle = {
    width: `${1080 * scale}px`,
    height: `${1350 * scale}px`,
  };

  return (
    <div style={wrapperStyle} className="relative overflow-hidden shadow-lg rounded-sm ring-1 ring-black/5">
      <div
        ref={forwardedRef}
        style={containerStyle}
        className="relative flex flex-col overflow-hidden"
      >
        {/* Background Image Layer (Always Full Opacity, overlaid by other divs) */}
        {config.backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${config.backgroundImage})`,
            }}
          />
        )}

        {/* Non-Cover Styling Layers (Dark Overlay) */}
        {!slide.isCover && (
          <div 
            className="absolute inset-0 bg-[#0F0E0D] transition-colors duration-300" 
            style={{ opacity: config.overlayOpacity / 100 }}
          />
        )}

        {/* Noise Texture (Only on non-cover slides) */}
        {!slide.isCover && (
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-overlay export-noise-layer" 
            style={{ 
              backgroundImage: `url("${NOISE_SVG_DATA_URI}")`,
              opacity: config.noiseOpacity / 100
            }}
          />
        )}

        {/* Cover Overlay (only for bottom position - gradient from bottom) */}
        {slide.isCover && config.coverTextPosition !== 'center' && (() => {
          const coverOpacity = (config.coverOverlayOpacity ?? 50) / 100;
          return (
            <div
              className="absolute bottom-0 left-0 w-full h-[60%] pointer-events-none"
              style={{
                background: `linear-gradient(to top, rgba(0,0,0,${coverOpacity * 0.9}) 0%, rgba(0,0,0,${coverOpacity * 0.4}) 50%, transparent 100%)`
              }}
            />
          );
        })()}

        {/* Cover Overlay for center position - elliptical radial gradient */}
        {slide.isCover && config.coverTextPosition === 'center' && (() => {
          const coverOpacity = (config.coverOverlayOpacity ?? 50) / 100;
          return (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 70% 50% at center, rgba(0,0,0,${coverOpacity}) 0%, rgba(0,0,0,${coverOpacity * 0.6}) 40%, rgba(0,0,0,${coverOpacity * 0.2}) 70%, transparent 100%)`,
              }}
            />
          );
        })()}

        {/* Content Layer */}
        <div
          className={`relative z-20 w-full h-full flex flex-col ${slide.isCover ? 'items-center text-center' : 'items-start text-left'}`}
          style={{
            paddingTop: slide.isCover ? '32px' : `${config.textPaddingTop ?? 60}px`,
            paddingBottom: slide.isCover ? '80px' : `${config.textPaddingBottom ?? 60}px`,
            paddingLeft: slide.isCover ? '32px' : `${config.textPaddingHorizontal ?? 60}px`,
            paddingRight: slide.isCover ? '32px' : `${config.textPaddingHorizontal ?? 60}px`,
            justifyContent: slide.isCover
              ? (config.coverTextPosition === 'center' ? 'center' : 'flex-end')
              : (config.textVerticalAlign ?? 'top') === 'center'
                ? 'center'
                : (config.textVerticalAlign ?? 'top') === 'bottom'
                  ? 'flex-end'
                  : 'flex-start',
          }}
        >

          {slide.isCover ? (
            // COVER SLIDE LAYOUT
            <div
              className={`flex flex-col items-center gap-6 ${
                config.coverTextPosition === 'center'
                  ? 'py-16 px-4'
                  : 'w-full justify-end'
              }`}
              style={config.coverTextPosition === 'center' ? {
                minWidth: '80%',
                maxWidth: '98%',
              } : undefined}
            >
              <RichTextEditor
                html={slide.text}
                onChange={(val) => onTextChange(slide.id, val)}
                placeholder="ЗАГОЛОВОК"
                configColor={titleColor}
                style={{
                  fontFamily: config.titleFont,
                  color: titleColor,
                  fontSize: `${config.titleFontSize}px`,
                  fontWeight: 900,
                  lineHeight: config.titleLineHeight ?? 1.2,
                  textTransform: 'uppercase',
                  textShadow: '0 4px 24px rgba(0,0,0,0.5)',
                  width: '100%',
                  textAlign: 'center'
                }}
              />

              <RichTextEditor
                html={slide.subtitle || ''}
                onChange={(val) => { if (onSubtitleChange) onSubtitleChange(slide.id, val); }}
                placeholder="(ваше пояснение)"
                configColor={bodyColor}
                style={{
                  fontFamily: config.bodyFont,
                  color: bodyColor,
                  fontSize: `${config.bodyFontSize}px`,
                  fontWeight: 400,
                  lineHeight: config.bodyLineHeight ?? 1.5,
                  opacity: 0.95,
                  textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                  width: '100%',
                  textAlign: 'center'
                }}
              />
            </div>
          ) : (
            // CONTENT SLIDE LAYOUT
            <>
              {/* Text Content Wrapper with maxWidth control */}
              <div style={{ width: '100%', maxWidth: `${config.textMaxWidth ?? 100}%` }}>
                {/* Slide Header */}
                <RichTextEditor
                  html={slide.title || ''}
                  onChange={(val) => { if (onTitleChange) onTitleChange(slide.id, val); }}
                  placeholder="ЗАГОЛОВОК СЛАЙДА"
                  configColor={titleColor}
                  style={{
                    fontFamily: config.titleFont,
                    color: titleColor,
                    fontSize: '64px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    lineHeight: config.titleLineHeight ?? 1.2,
                    marginBottom: '30px',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    width: '100%',
                    textAlign: 'left'
                  }}
                />

                {/* Slide Body Text */}
                <RichTextEditor
                  html={slide.text}
                  onChange={(val) => onTextChange(slide.id, val)}
                  placeholder="Ваш полезный контент здесь..."
                  configColor={bodyColor}
                  style={{
                    fontFamily: config.bodyFont,
                    color: bodyColor,
                    fontSize: `${config.bodyFontSize}px`,
                    fontWeight: 400,
                    lineHeight: config.bodyLineHeight ?? 1.5,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    width: '100%',
                    textAlign: 'left'
                  }}
                />
              </div>

              {/* Navigation Arrow */}
              <div className="absolute bottom-[40px] right-[40px] opacity-80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke={bodyColor}
                  className="w-12 h-12"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};


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

  // Resolve colors with fallback to general textColor
  const titleColor = config.titleColor || config.textColor;
  const bodyColor = config.bodyColor || config.textColor;

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

        {/* Cover Bottom Gradient Overlay (Critical for text readability) */}
        {slide.isCover && (
          <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
        )}

        {/* Content Layer */}
        <div
          className={`relative z-20 w-full h-full flex flex-col ${slide.isCover ? 'justify-end items-center text-center' : 'items-start text-left'}`}
          style={{
            paddingTop: slide.isCover ? '64px' : `${config.textPaddingTop ?? 60}px`,
            paddingBottom: slide.isCover ? '120px' : `${config.textPaddingBottom ?? 60}px`,
            paddingLeft: slide.isCover ? '64px' : `${config.textPaddingHorizontal ?? 60}px`,
            paddingRight: slide.isCover ? '64px' : `${config.textPaddingHorizontal ?? 60}px`,
            justifyContent: slide.isCover
              ? 'flex-end'
              : (config.textVerticalAlign ?? 'top') === 'center'
                ? 'center'
                : (config.textVerticalAlign ?? 'top') === 'bottom'
                  ? 'flex-end'
                  : 'flex-start',
          }}
        >

          {slide.isCover ? (
            // COVER SLIDE LAYOUT
            <div className="w-full flex flex-col items-center justify-end gap-6">
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

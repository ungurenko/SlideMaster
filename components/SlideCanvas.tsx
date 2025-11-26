
import React, { useRef, useEffect } from 'react';
import { SlideData } from '../types';

interface SlideCanvasProps {
  slide: SlideData;
  config: {
    backgroundImage: string | null;
    titleFont: string;
    titleFontSize: number;
    bodyFont: string;
    bodyFontSize: number;
    textColor: string;
    titleColor?: string;
    bodyColor?: string;
    noiseOpacity: number;
    overlayOpacity: number;
  };
  onTextChange: (id: string, text: string) => void;
  onTitleChange?: (id: string, title: string) => void;
  onSubtitleChange?: (id: string, subtitle: string) => void;
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
  scale = 1,
  forwardedRef,
}) => {
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

  // Auto-resize textarea logic
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const subtitleRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const contentTitleRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  // Resize on content change or mount
  useEffect(() => {
    if (slide.isCover) {
      autoResize(titleRef.current);
      autoResize(subtitleRef.current);
    } else {
      autoResize(contentTitleRef.current);
      autoResize(bodyRef.current);
    }
  }, [slide.text, slide.subtitle, slide.title, slide.isCover, config.titleFont, config.bodyFont, config.titleFontSize, config.bodyFontSize]);

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

        {/* Non-Cover Styling Layers */}
        {!slide.isCover && (
          <>
            {/* Adjustable Dark Overlay */}
            <div 
              className="absolute inset-0 bg-[#0F0E0D] transition-colors duration-300" 
              style={{ opacity: config.overlayOpacity / 100 }}
            />
            
            {/* Adjustable Noise Texture - Fine Grain */}
            {/* Added 'export-noise-layer' class for targeting during download */}
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-overlay export-noise-layer" 
              style={{ 
                backgroundImage: `url("${NOISE_SVG_DATA_URI}")`,
                opacity: config.noiseOpacity / 100
              }}
            />
          </>
        )}

        {/* Cover Bottom Gradient Overlay (Critical for text readability) */}
        {slide.isCover && (
          <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
        )}

        {/* Content Layer */}
        <div className={`relative z-20 w-full h-full flex flex-col ${slide.isCover ? 'p-16 justify-end items-center text-center pb-[120px]' : 'p-[60px] justify-start items-start text-left'}`}>
          
          {slide.isCover ? (
            // COVER SLIDE LAYOUT
            <div className="w-full flex flex-col items-center justify-end gap-6">
               <textarea
                ref={titleRef}
                value={slide.text}
                onChange={(e) => {
                  onTextChange(slide.id, e.target.value);
                  autoResize(e.target);
                }}
                placeholder="ЗАГОЛОВОК"
                spellCheck={false}
                className="w-full bg-transparent resize-none outline-none border-none placeholder-white/50 text-center overflow-hidden"
                style={{
                  fontFamily: config.titleFont,
                  color: titleColor,
                  fontSize: `${config.titleFontSize}px`,
                  fontWeight: 900,
                  lineHeight: 1.2, 
                  textTransform: 'uppercase',
                  textShadow: '0 4px 24px rgba(0,0,0,0.5)'
                }}
                rows={1}
              />
              
              <textarea
                ref={subtitleRef}
                value={slide.subtitle || ''}
                onChange={(e) => {
                  if (onSubtitleChange) onSubtitleChange(slide.id, e.target.value);
                  autoResize(e.target);
                }}
                placeholder="(ваше пояснение)"
                spellCheck={false}
                className="w-full bg-transparent resize-none outline-none border-none placeholder-white/50 text-center overflow-hidden"
                style={{
                  fontFamily: config.bodyFont,
                  color: bodyColor,
                  fontSize: `${config.bodyFontSize}px`,
                  fontWeight: 400,
                  lineHeight: 1.3,
                  opacity: 0.95,
                  textShadow: '0 2px 12px rgba(0,0,0,0.4)'
                }}
                rows={1}
              />
            </div>
          ) : (
            // CONTENT SLIDE LAYOUT
            <>
              {/* Slide Header */}
              <textarea
                ref={contentTitleRef}
                value={slide.title || ''}
                onChange={(e) => {
                  if (onTitleChange) onTitleChange(slide.id, e.target.value);
                  autoResize(e.target);
                }}
                placeholder="ЗАГОЛОВОК СЛАЙДА"
                spellCheck={false}
                className="w-full bg-transparent resize-none outline-none border-none placeholder-white/50 text-left overflow-hidden"
                style={{
                  fontFamily: config.titleFont,
                  color: titleColor,
                  fontSize: '64px', 
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  lineHeight: 1.4, 
                  marginBottom: '30px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
                rows={1}
              />

              {/* Slide Body Text */}
              <textarea
                ref={bodyRef}
                value={slide.text}
                onChange={(e) => {
                  onTextChange(slide.id, e.target.value);
                  autoResize(e.target);
                }}
                placeholder="Ваш полезный контент здесь..."
                spellCheck={false}
                className="w-full bg-transparent resize-none outline-none border-none placeholder-white/30"
                style={{
                  fontFamily: config.bodyFont,
                  color: bodyColor,
                  fontSize: `${config.bodyFontSize}px`,
                  fontWeight: 400,
                  lineHeight: 1.5,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)' 
                }}
              />
              
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

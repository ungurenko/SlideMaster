
import React, { useState, useRef, useCallback } from 'react';
import { SlideData, CarouselConfig, Template } from '../types';
import { Slider } from './Slider';
import { compressImage } from '../utils/imageUtils';
import { downloadSingleSlide } from '../services/downloadService';
import { toast } from 'sonner';

// Icons
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Noise SVG for slide preview
const NOISE_SVG_DATA_URI = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

interface CTABuilderProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  currentConfig?: CarouselConfig;
  onDownload?: (slide: SlideData, config: CarouselConfig) => void;
  onAddToCarousel?: (slide: SlideData) => void;
}

export const CTABuilder: React.FC<CTABuilderProps> = ({
  isOpen,
  onClose,
  templates,
  currentConfig,
  onDownload,
  onAddToCarousel,
}) => {
  const visibleTemplates = templates.filter(t => !t.isHidden);
  const defaultTemplate = visibleTemplates[0] || templates[0];

  const [selectedTemplate, setSelectedTemplate] = useState<Template>(defaultTemplate);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [ctaImage, setCtaImage] = useState<string | null>(null);
  const [borderRadius, setBorderRadius] = useState(24);
  const [isExporting, setIsExporting] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const config = currentConfig || selectedTemplate.config;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 800, 0.85);
        setCtaImage(compressed);
      } catch (err) {
        toast.error("Ошибка при обработке изображения");
      }
    }
  };

  const removeImage = () => {
    setCtaImage(null);
  };

  const createCTASlide = useCallback((): SlideData => {
    return {
      id: `cta-${Date.now()}`,
      text: '',
      isCover: false,
      isCTA: true,
      ctaTopText: topText,
      ctaBottomText: bottomText,
      ctaImage: ctaImage || undefined,
      ctaImageBorderRadius: borderRadius,
    };
  }, [topText, bottomText, ctaImage, borderRadius]);

  const handleDownload = async () => {
    if (!previewRef.current) return;

    setIsExporting(true);
    try {
      const slide = createCTASlide();
      await downloadSingleSlide(previewRef, selectedTemplate.config);
      toast.success('CTA-слайд сохранён!', { icon: '🎉' });
    } catch (err) {
      toast.error('Ошибка при экспорте');
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddToCarousel = () => {
    if (onAddToCarousel) {
      const slide = createCTASlide();
      onAddToCarousel(slide);
      toast.success('CTA-слайд добавлен в карусель');
      onClose();
    }
  };

  if (!isOpen) return null;

  const titleColor = config.titleColor || config.textColor;
  const bodyColor = config.bodyColor || config.textColor;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#333]/20 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#F5F2ED] max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#F5F2ED] flex justify-between items-center bg-white shrink-0">
          <h3 className="font-bold text-[#333] text-xl">Создать CTA-слайд</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F5F2ED] text-[#8C847C] hover:text-[#333] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Settings */}
          <div className="w-[360px] border-r border-[#F5F2ED] p-6 overflow-y-auto shrink-0">
            {/* Template Selection */}
            <div className="mb-8">
              <label className="text-xs font-bold uppercase text-[#6B6054] mb-4 block">Выберите стиль</label>
              <div className="grid grid-cols-4 gap-2">
                {visibleTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    className={`aspect-square rounded-xl border transition-all flex items-center justify-center overflow-hidden relative ${
                      selectedTemplate.id === tpl.id
                        ? 'border-[#9CAF88] ring-2 ring-[#9CAF88]/20'
                        : 'border-[#F0EBE5] hover:border-[#D1CCC0]'
                    }`}
                    style={{ backgroundColor: tpl.previewColor }}
                  >
                    <div
                      className="absolute inset-0 bg-black"
                      style={{ opacity: tpl.config.overlayOpacity / 100 }}
                    />
                    <span
                      className="relative z-10 text-sm font-serif"
                      style={{
                        fontFamily: tpl.config.titleFont,
                        color: tpl.textColor,
                      }}
                    >
                      Aa
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-[#8C847C] mt-2 text-center">{selectedTemplate.name}</p>
            </div>

            {/* Top Text */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase text-[#6B6054] mb-3 block">Верхний текст</label>
              <textarea
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="Заголовок с эмодзи"
                className="w-full px-4 py-3 bg-[#FCFAF7] border border-[#F0EBE5] rounded-xl text-sm text-[#333] placeholder-[#D1CCC0] resize-none focus:outline-none focus:border-[#9CAF88] transition-colors"
                rows={2}
              />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase text-[#6B6054] mb-3 block">Изображение</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="cta-image-upload"
              />
              {ctaImage ? (
                <div className="relative">
                  <div
                    className="w-full h-40 rounded-xl overflow-hidden bg-[#F5F2ED]"
                    style={{ borderRadius: `${borderRadius}px` }}
                  >
                    <img src={ctaImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white shadow-sm transition-all"
                  >
                    <CloseIcon />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="cta-image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border border-dashed border-[#D7C9B8] rounded-xl bg-[#FCFAF7] hover:bg-[#F5F2ED] transition-colors"
                >
                  <div className="p-2 bg-white rounded-full text-[#8C847C] mb-2 shadow-sm">
                    <UploadIcon />
                  </div>
                  <span className="text-xs text-[#8C847C]">Загрузить скриншот</span>
                </label>
              )}

              {/* Border Radius Slider */}
              {ctaImage && (
                <div className="mt-4">
                  <Slider
                    label="Скругление углов"
                    value={borderRadius}
                    min={0}
                    max={60}
                    onChange={(val) => setBorderRadius(val)}
                    unit="px"
                  />
                </div>
              )}
            </div>

            {/* Bottom Text */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase text-[#6B6054] mb-3 block">Нижний текст (CTA)</label>
              <textarea
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="Призыв к действию"
                className="w-full px-4 py-3 bg-[#FCFAF7] border border-[#F0EBE5] rounded-xl text-sm text-[#333] placeholder-[#D1CCC0] resize-none focus:outline-none focus:border-[#9CAF88] transition-colors"
                rows={2}
              />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 bg-[#F2F0E9] p-8 flex items-center justify-center overflow-auto">
            {/* CTA Preview at scale */}
            <div className="relative">
              <div
                className="shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden ring-4 ring-white"
                style={{ width: `${1080 * 0.4}px`, height: `${1350 * 0.4}px` }}
              >
                {/* Actual slide canvas at 1080x1350 */}
                <div
                  ref={previewRef}
                  style={{
                    width: '1080px',
                    height: '1350px',
                    transform: 'scale(0.4)',
                    transformOrigin: 'top left',
                    backgroundColor: '#1a1816',
                  }}
                  className="relative flex flex-col overflow-hidden"
                >
                  {/* Background Image Layer */}
                  {selectedTemplate.config.backgroundImage && (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${selectedTemplate.config.backgroundImage})`,
                      }}
                    />
                  )}

                  {/* Dark Overlay */}
                  <div
                    className="absolute inset-0 bg-[#0F0E0D] transition-colors duration-300"
                    style={{ opacity: selectedTemplate.config.overlayOpacity / 100 }}
                  />

                  {/* Noise Texture */}
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-overlay export-noise-layer"
                    style={{
                      backgroundImage: `url("${NOISE_SVG_DATA_URI}")`,
                      opacity: selectedTemplate.config.noiseOpacity / 100
                    }}
                  />

                  {/* CTA Content Layout */}
                  <div className="relative z-20 w-full h-full flex flex-col items-center justify-between py-[80px] px-[60px]">
                    {/* Top Text - 15% */}
                    <div className="w-full text-center" style={{ flex: '0 0 auto' }}>
                      <div
                        style={{
                          fontFamily: selectedTemplate.config.titleFont,
                          fontSize: `${selectedTemplate.config.titleFontSize}px`,
                          fontWeight: 700,
                          color: titleColor,
                          lineHeight: selectedTemplate.config.titleLineHeight || 1.3,
                          textShadow: '0 4px 24px rgba(0,0,0,0.5)',
                        }}
                      >
                        {topText || 'Верхний заголовок'}
                      </div>
                    </div>

                    {/* Center Image - 55% */}
                    <div
                      className="flex-1 flex items-center justify-center w-full my-[40px]"
                      style={{ maxHeight: '60%' }}
                    >
                      {ctaImage ? (
                        <div
                          className="relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                          style={{
                            borderRadius: `${borderRadius}px`,
                            maxWidth: '85%',
                            maxHeight: '100%',
                          }}
                        >
                          <img
                            src={ctaImage}
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
                          <UploadIcon />
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA Text - 15% */}
                    <div className="w-full text-center" style={{ flex: '0 0 auto' }}>
                      <div
                        style={{
                          fontFamily: selectedTemplate.config.bodyFont,
                          fontSize: `${selectedTemplate.config.bodyFontSize + 8}px`,
                          fontWeight: 500,
                          color: bodyColor,
                          lineHeight: selectedTemplate.config.bodyLineHeight || 1.5,
                          textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                        }}
                      >
                        {bottomText || 'Призыв к действию'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#F5F2ED] bg-white flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-medium text-[#6B6054] hover:text-[#333] transition-colors"
          >
            Отмена
          </button>

          {onAddToCarousel && (
            <button
              onClick={handleAddToCarousel}
              className="px-6 py-3 bg-white border border-[#9CAF88] text-[#9CAF88] text-sm font-medium rounded-xl hover:bg-[#9CAF88]/5 transition-all flex items-center gap-2"
            >
              <PlusIcon />
              Добавить в карусель
            </button>
          )}

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-6 py-3 bg-[#9CAF88] text-white text-sm font-medium rounded-xl shadow-[0_8px_20px_rgba(156,175,136,0.25)] hover:bg-[#8A9E75] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <DownloadIcon />
            {isExporting ? 'Экспорт...' : 'Скачать JPG'}
          </button>
        </div>
      </div>
    </div>
  );
};

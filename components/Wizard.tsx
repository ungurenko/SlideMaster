
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Template, CarouselConfig, SlideData } from '../types';
import { parseCarouselText, structureSlides, SAMPLE_TEXT } from '../services/autoParser';

// --- ICONS ---
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const DocumentTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const PaintBrushIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.85 6.361a15.996 15.996 0 00-4.647 4.763m0 0c-.226.324-.496.63-.804.912" />
  </svg>
);

// --- MOCK DATA ---
const STOCK_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1080&auto=format&fit=crop", // Abstract dark
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1080&auto=format&fit=crop", // Gradient
  "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1080&auto=format&fit=crop", // Dark Gradient
  "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=1080&auto=format&fit=crop", // Abstract Green
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1080&auto=format&fit=crop", // Sea
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1080&auto=format&fit=crop", // Mountains
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1080&auto=format&fit=crop", // Golden Hour
  "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?q=80&w=1080&auto=format&fit=crop", // Minimalist Architecture
];

interface WizardProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onFinish: (config: CarouselConfig, slides: SlideData[]) => void;
}

export const Wizard: React.FC<WizardProps> = ({ isOpen, onClose, templates, onFinish }) => {
  const [step, setStep] = useState(1);
  const [text, setText] = useState('');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  // Computed State
  const [parsedCount, setParsedCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (text) {
      const parsed = parseCarouselText(text);
      setParsedCount(parsed ? parsed.length : 0);
    } else {
      setParsedCount(0);
    }
  }, [text]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onClose();
  };

  const handleFinish = () => {
    if (!selectedTemplateId) return;
    
    setIsProcessing(true);
    setTimeout(() => {
        const rawSlides = parseCarouselText(text);
        if (!rawSlides) return;
        
        const slides = structureSlides(rawSlides);
        const template = templates.find(t => t.id === selectedTemplateId);
        
        if (template) {
            const finalConfig = {
                ...template.config,
                backgroundImage: backgroundImage || template.config.backgroundImage
            };
            onFinish(finalConfig, slides);
        }
        setIsProcessing(false);
    }, 1500); // Simulate processing
  };

  // Reset on open
  useEffect(() => {
    if (isOpen) {
        setStep(1);
        setIsProcessing(false);
        // Don't reset text/bg/style so user doesn't lose progress if accidental close, 
        // but typically you might want to. Leaving it persistent for now.
    }
  }, [isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            setBackgroundImage(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#333]/30 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#FFFDF9] w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E8DDD1]">
        
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-[#E8DDD1] flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-[#4A4036] flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#9CAF88] text-white flex items-center justify-center text-sm">⚡</span>
                Авто-создание
            </h2>
            <div className="flex items-center gap-2">
                 {/* Progress Dots */}
                 <div className="flex gap-2 mr-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-[#9CAF88]' : 'w-2 bg-[#E5E0D8]'}`} />
                    ))}
                 </div>
                 <button onClick={onClose} className="text-[#8C847C] hover:text-[#333]">✕</button>
            </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 relative">
            
            {/* STEP 1: TEXT */}
            {step === 1 && (
                <div className="max-w-2xl mx-auto flex flex-col h-full animate-fadeIn">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-semibold text-[#333] mb-2">Вставь текст карусели</h3>
                        <p className="text-[#8C847C]">Мы автоматически разделим его на слайды. Используй формат "Слайд 1: ..."</p>
                    </div>

                    <div className="flex-1 relative">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={`Пример:\n\nСлайд 1: Заголовок\nПодзаголовок...\n\nСлайд 2: Мысль 1\nТекст...`}
                            className="w-full h-full min-h-[300px] p-6 rounded-2xl border border-[#D7C9B8] bg-white focus:outline-none focus:border-[#9CAF88] focus:ring-4 focus:ring-[#9CAF88]/10 resize-none font-mono text-sm leading-relaxed text-[#333]"
                        />
                        <button 
                           onClick={() => setText(SAMPLE_TEXT)}
                           className="absolute bottom-4 right-4 text-xs font-bold text-[#9CAF88] bg-[#9CAF88]/10 px-3 py-1.5 rounded-lg hover:bg-[#9CAF88]/20 transition-colors"
                        >
                            Вставить пример
                        </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between min-h-[24px]">
                         <div className={`text-sm font-medium transition-colors ${parsedCount >= 2 ? 'text-[#9CAF88]' : text.length > 0 ? 'text-red-400' : 'text-transparent'}`}>
                             {parsedCount > 0 ? `✅ Распознано слайдов: ${parsedCount}` : '⚠️ Формат слайдов не распознан'}
                         </div>
                    </div>
                </div>
            )}

            {/* STEP 2: BACKGROUND */}
            {step === 2 && (
                <div className="max-w-3xl mx-auto animate-fadeIn">
                     <div className="text-center mb-8">
                        <h3 className="text-2xl font-semibold text-[#333] mb-2">Выбери настроение</h3>
                        <p className="text-[#8C847C]">Фон задаст атмосферу всей карусели</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 h-[400px]">
                        {/* Option A: Upload */}
                        <div className="flex flex-col gap-4">
                             <h4 className="font-bold text-[#6B6054] uppercase text-xs tracking-wider">Загрузить своё</h4>
                             <label className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:border-[#9CAF88] hover:bg-[#F9F9F9] relative overflow-hidden ${backgroundImage && !STOCK_IMAGES.includes(backgroundImage) ? 'border-[#9CAF88]' : 'border-[#E5E0D8] bg-[#FCFAF7]'}`}>
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                                {backgroundImage && !STOCK_IMAGES.includes(backgroundImage) ? (
                                    <>
                                        <img src={backgroundImage} className="absolute inset-0 w-full h-full object-cover" alt="Uploaded" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-white font-bold text-sm">Изменить</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 bg-white rounded-full shadow-sm mb-3"><PhotoIcon /></div>
                                        <span className="text-sm font-medium text-[#8C847C]">Нажми или перетащи</span>
                                    </>
                                )}
                             </label>
                        </div>

                        {/* Option B: Stock */}
                        <div className="flex flex-col gap-4">
                             <h4 className="font-bold text-[#6B6054] uppercase text-xs tracking-wider">Библиотека</h4>
                             <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                 <div className="grid grid-cols-2 gap-3">
                                     {STOCK_IMAGES.map((url) => (
                                         <div 
                                            key={url} 
                                            onClick={() => setBackgroundImage(url)}
                                            className={`aspect-square rounded-xl overflow-hidden cursor-pointer relative group ${backgroundImage === url ? 'ring-4 ring-[#9CAF88]' : ''}`}
                                         >
                                             <img src={url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Stock" />
                                             {backgroundImage === url && (
                                                 <div className="absolute inset-0 bg-[#9CAF88]/20 flex items-center justify-center">
                                                     <div className="bg-white text-[#9CAF88] rounded-full p-1"><CheckIcon /></div>
                                                 </div>
                                             )}
                                         </div>
                                     ))}
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: STYLE */}
            {step === 3 && (
                <div className="max-w-5xl mx-auto h-full flex flex-col animate-fadeIn">
                     <div className="text-center mb-8">
                        <h3 className="text-2xl font-semibold text-[#333] mb-2">Финальный штрих</h3>
                        <p className="text-[#8C847C]">Выбери типографику и цветовое решение</p>
                    </div>

                    <div className="flex-1 flex gap-8 min-h-0">
                         {/* Styles Grid */}
                         <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                             <div className="grid grid-cols-2 gap-4">
                                 {templates.filter(t => !t.isHidden).map((tpl) => (
                                     <button
                                        key={tpl.id}
                                        onClick={() => setSelectedTemplateId(tpl.id)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                                            selectedTemplateId === tpl.id 
                                            ? 'border-[#9CAF88] bg-[#9CAF88]/5 ring-1 ring-[#9CAF88]' 
                                            : 'border-[#E5E0D8] bg-white hover:border-[#D7C9B8] hover:shadow-sm'
                                        }`}
                                     >
                                         <div 
                                            className="w-16 h-16 rounded-xl shadow-inner flex items-center justify-center text-xl font-bold flex-shrink-0"
                                            style={{ backgroundColor: tpl.previewColor, color: tpl.textColor, fontFamily: tpl.config.titleFont }}
                                         >
                                             Aa
                                         </div>
                                         <div>
                                             <h4 className="font-bold text-[#333]">{tpl.name}</h4>
                                             <p className="text-xs text-[#8C847C] mt-1">{tpl.config.titleFont} + {tpl.config.bodyFont}</p>
                                         </div>
                                     </button>
                                 ))}
                             </div>
                         </div>

                         {/* Preview Card */}
                         <div className="w-[320px] bg-[#F2F0E9] rounded-2xl p-6 flex flex-col items-center justify-center border border-[#E5E0D8] relative overflow-hidden">
                             <h4 className="absolute top-4 left-0 w-full text-center text-[10px] font-bold uppercase text-[#8C847C] tracking-widest">Предпросмотр</h4>
                             
                             <div className="w-[200px] aspect-[4/5] bg-white shadow-2xl rounded-sm relative overflow-hidden mt-4 transform transition-all duration-300">
                                 {backgroundImage && (
                                     <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }} />
                                 )}
                                 {selectedTemplateId && (() => {
                                     const tpl = templates.find(t => t.id === selectedTemplateId)!;
                                     return (
                                         <>
                                             <div className="absolute inset-0" style={{ backgroundColor: '#000', opacity: tpl.config.overlayOpacity / 100 }} />
                                             <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center pb-8 z-10">
                                                 <span style={{ 
                                                     fontFamily: tpl.config.titleFont, 
                                                     color: tpl.config.titleColor || '#FFF',
                                                     fontSize: '24px',
                                                     lineHeight: '1.1',
                                                     fontWeight: '900',
                                                     textTransform: 'uppercase',
                                                     marginBottom: '8px'
                                                  }}>
                                                     ЗАГОЛОВОК
                                                 </span>
                                                 <span style={{ 
                                                     fontFamily: tpl.config.bodyFont, 
                                                     color: tpl.config.bodyColor || '#FFF',
                                                     fontSize: '10px',
                                                     lineHeight: '1.4'
                                                  }}>
                                                     Предпросмотр вашего стиля
                                                 </span>
                                             </div>
                                         </>
                                     );
                                 })()}
                                 
                                 {!selectedTemplateId && (
                                     <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                                         <span className="text-xs text-gray-400">Выберите стиль</span>
                                     </div>
                                 )}
                             </div>
                         </div>
                    </div>
                </div>
            )}

            {/* LOADING STATE */}
            {isProcessing && (
                <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fadeIn">
                    <div className="w-16 h-16 border-4 border-[#F0EBE5] border-t-[#9CAF88] rounded-full animate-spin mb-6"></div>
                    <h3 className="text-xl font-bold text-[#333]">Создаем магию...</h3>
                    <p className="text-[#8C847C] mt-2">Парсим текст и накладываем эффекты</p>
                </div>
            )}

        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-6 border-t border-[#E8DDD1] bg-white flex justify-between items-center">
            <button 
                onClick={handleBack}
                className="px-6 py-3 rounded-2xl text-[#6B6054] font-medium hover:bg-[#F5F2ED] transition-colors"
                disabled={isProcessing}
            >
                {step === 1 ? 'Отмена' : 'Назад'}
            </button>
            
            <Button 
                onClick={step === 3 ? handleFinish : handleNext} 
                disabled={
                    (step === 1 && parsedCount < 2) || 
                    (step === 2 && !backgroundImage) || 
                    (step === 3 && !selectedTemplateId) ||
                    isProcessing
                }
                className="min-w-[160px]"
            >
                {step === 3 ? 'Создать карусель ✨' : 'Далее →'}
            </Button>
        </div>

      </div>
    </div>
  );
};

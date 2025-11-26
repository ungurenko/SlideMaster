
import React, { useState, useRef, useEffect } from 'react';
import { SlideData, CarouselConfig, DEFAULT_FONT_OPTIONS, FontOption, SavedProject, StylePreset, Template } from '../types';
import { SlideCanvas } from './SlideCanvas';
import { Button } from './Button';
import { Slider } from './Slider';
import { downloadSlides } from '../services/downloadService';

// --- Icons (Thinner strokes for minimalism) ---
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
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

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504 1.125 1.125 1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

// Utility to compress images
const compressImage = (file: File, maxWidth: number, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
  
          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }
  
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
              reject(new Error("Canvas error"));
          }
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
};

const NEON_VARIANTS = [
  { color: '#00FF94', name: 'Green' },
  { color: '#FF006E', name: 'Pink' },
  { color: '#00D9FF', name: 'Blue' },
  { color: '#FF6B00', name: 'Orange' },
  { color: '#B537F2', name: 'Purple' },
];


// Helper Component: Accordion Section
const AccordionSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  alwaysOpen?: boolean;
}> = ({ title, isOpen, onToggle, children, alwaysOpen = false }) => {
  return (
    <div className="border-b border-[#F0EBE5] last:border-0">
      {!alwaysOpen ? (
        <button 
          onClick={onToggle}
          className="w-full flex items-center justify-between py-5 px-2 hover:bg-[#F9F9F9] transition-colors rounded-lg my-1"
        >
          <span className="text-xs font-bold text-[#6B6054] uppercase tracking-wider">{title}</span>
          <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-[#8C847C]`}>
            <ChevronDownIcon />
          </div>
        </button>
      ) : (
         <div className="py-5 px-2 pb-2">
           <span className="text-xs font-bold text-[#6B6054] uppercase tracking-wider block mb-4">{title}</span>
         </div>
      )}
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen || alwaysOpen ? 'max-h-[800px] opacity-100 mb-6' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2">
          {children}
        </div>
      </div>
    </div>
  );
};


interface CarouselEditorProps {
  initialProject?: SavedProject | null;
  initialConfig?: CarouselConfig | null;
  templates: Template[];
  onBack: () => void;
  onSave: () => void;
}

export const CarouselEditor: React.FC<CarouselEditorProps> = ({ 
  initialProject, 
  initialConfig, 
  templates,
  onBack, 
  onSave 
}) => {
  // --- STATE ---
  const [slides, setSlides] = useState<SlideData[]>(() => {
    if (initialProject) return initialProject.slides;
    return [
      { id: 'slide-1', text: 'ГЛАВНАЯ\nОШИБКА', subtitle: '(сохрани пост и попробуй)', isCover: true },
      { id: 'slide-2', title: 'ПОНИМАНИЕ', text: 'Почему важно понимать свою аудиторию лучше, чем они понимают себя сами.', isCover: false },
      { id: 'slide-3', title: 'РЕЗУЛЬТАТ', text: 'Высокая вовлеченность и рост продаж. Люди пишут "ты прочитал мои мысли".', isCover: false },
    ];
  });

  const [config, setConfig] = useState<CarouselConfig>(() => {
    if (initialProject) return initialProject.config;
    if (initialConfig) return initialConfig;
    return {
      backgroundImage: null,
      titleFont: 'Montserrat', 
      titleFontSize: 62, 
      bodyFont: 'Open Sans',      
      bodyFontSize: 45,                 
      textColor: '#FFFFFF', 
      titleColor: '#FFFFFF',
      bodyColor: '#FFFFFF',
      noiseOpacity: 63, 
      overlayOpacity: 80, 
    };
  });

  const [fontOptions, setFontOptions] = useState<FontOption[]>(DEFAULT_FONT_OPTIONS);

  const [isExporting, setIsExporting] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  // Accordion State
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    quickStyles: true,
    background: true,
    effects: false,
    typography: false,
    slides: true,
  });

  // Track active preset for UI feedback
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Modals
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [presets, setPresets] = useState<StylePreset[]>([]);

  // Refs
  const slideRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const slideWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Flag to prevent intersection observer from interfering with manual navigation
  const isScrollingRef = useRef(false);

  // --- EFFECTS ---
  
  // 1. Initial Scroll Reset
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, []);

  // 2. Load Data
  useEffect(() => {
    const storedProjects = localStorage.getItem('carousel_projects');
    if (storedProjects) {
      try {
        setSavedProjects(JSON.parse(storedProjects));
      } catch (e) { console.error(e); }
    }

    const storedPresets = localStorage.getItem('carousel_presets');
    if (storedPresets) {
      try {
        setPresets(JSON.parse(storedPresets));
      } catch (e) { console.error(e); }
    }
  }, []);

  // 3. Auto-detect Neon
  useEffect(() => {
    if (initialConfig) {
        if (initialConfig.titleFont === 'Oswald' && initialConfig.bodyFont === 'Roboto' && initialConfig.overlayOpacity === 70) {
            setActivePresetId('neon');
        }
    }
  }, [initialConfig]);

  // 4. Intersection Observer for Slide Tracking
  // UPDATED: Added stricter threshold and check for manual scrolling flag
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // If we are programmatically scrolling, ignore observer updates
      if (isScrollingRef.current) return;

      entries.forEach((entry) => {
        // Only trigger if the slide is significantly visible (>60%)
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
           const index = Number((entry.target as HTMLElement).getAttribute('data-index'));
           if (!isNaN(index)) {
             setCurrentSlideIndex(index);
           }
        }
      });
    }, {
      root: scrollContainerRef.current,
      threshold: 0.6 // Increased threshold to avoid jitter
    });

    slideWrapperRefs.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [slides.length]);

  // --- LOGIC ---

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
          const compressed = await compressImage(file, 1080, 0.75);
          setConfig((prev) => ({ ...prev, backgroundImage: compressed }));
      } catch (err) {
          alert("Ошибка при загрузке изображения");
      }
    }
  };

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const fontName = file.name.split('.')[0];
      const newStyle = document.createElement('style');
      newStyle.appendChild(document.createTextNode(`@font-face { font-family: "${fontName}"; src: url("${result}"); }`));
      document.head.appendChild(newStyle);

      const newFont: FontOption = { label: fontName, value: fontName, type: 'custom' };
      setFontOptions(prev => [...prev, newFont]);
    };
    reader.readAsDataURL(file);
  };

  const updateSlideText = (id: string, text: string) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, text } : s)));
  };
  const updateSlideTitle = (id: string, title: string) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
  };
  const updateSlideSubtitle = (id: string, subtitle: string) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, subtitle } : s)));
  };

  const addSlide = () => {
    if (slides.length >= 10) return;
    const newId = `slide-${Date.now()}`;
    setSlides((prev) => [...prev, { id: newId, title: 'ЗАГОЛОВОК', text: 'Ваш текст здесь...', isCover: false }]);
  };

  const duplicateSlide = () => {
    if (slides.length >= 10) return;
    const currentSlide = slides[currentSlideIndex];
    if (!currentSlide) return;

    const newSlide: SlideData = {
      ...currentSlide,
      id: `slide-${Date.now()}`,
      isCover: false, 
    };

    const newSlides = [...slides];
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    setSlides(newSlides);
  };

  const removeSlide = () => {
    if (slides.length <= 1) return;
    const idToRemove = slides[currentSlideIndex].id;
    setSlides((prev) => prev.filter((s) => s.id !== idToRemove));
    if (currentSlideIndex >= slides.length - 1) {
        // Manually adjust index if deleting the last one
        const newIndex = Math.max(0, slides.length - 2);
        setCurrentSlideIndex(newIndex);
        // Force scroll update after render
        setTimeout(() => scrollToSlide(newIndex), 10);
    }
  };

  const handleDownload = async () => {
    setIsExporting(true);
    setTimeout(async () => {
      await downloadSlides(slides.map(s => s.id), slideRefs);
      setIsExporting(false);
    }, 100);
  };

  // UPDATED: Precise scroll logic
  const scrollToSlide = (index: number) => {
    if (index < 0 || index >= slides.length) return;
    
    // 1. Flag ON: Stop observer updates
    isScrollingRef.current = true;
    
    // 2. Update state immediately
    setCurrentSlideIndex(index);
    
    const container = scrollContainerRef.current;
    const slideWrapper = slideWrapperRefs.current[index];

    if (container && slideWrapper) {
      // 3. Calculate Exact Center Position:
      // Slide Left Position - Half Container Width + Half Slide Width
      // This centers the slide regardless of padding or gaps.
      const containerWidth = container.clientWidth;
      const slideWidth = slideWrapper.clientWidth;
      const slideLeft = slideWrapper.offsetLeft;
      
      const targetScrollLeft = slideLeft - (containerWidth / 2) + (slideWidth / 2);

      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });

      // 4. Flag OFF: Re-enable observer after animation roughly finishes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600); // 600ms matches most smooth scroll durations
    }
  };

  const applyQuickPreset = (id: string, presetConfig: Partial<CarouselConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...presetConfig,
      backgroundImage: prev.backgroundImage // Preserve existing background
    }));
    setActivePresetId(id);
  };

  // --- PRESET LOGIC ---
  const savePreset = () => {
    const name = prompt("Назовите ваш стиль:", `Style ${presets.length + 1}`);
    if (!name) return;
    const { backgroundImage, ...styleConfig } = config;
    const newPreset: StylePreset = { id: Date.now().toString(), name, config: styleConfig };
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem('carousel_presets', JSON.stringify(updatedPresets));
  };

  const applyPreset = (preset: StylePreset) => {
    setConfig(prev => ({ ...prev, ...preset.config, backgroundImage: prev.backgroundImage }));
    setIsPresetsOpen(false);
    setActivePresetId(null); 
  };

  const deletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Удалить этот стиль?")) {
      const updated = presets.filter(p => p.id !== id);
      setPresets(updated);
      localStorage.setItem('carousel_presets', JSON.stringify(updated));
    }
  };

  // --- SAVE PROJECT LOGIC ---
  const saveProject = () => {
    const defaultName = initialProject ? initialProject.name : `Project ${new Date().toLocaleDateString()}`;
    const name = prompt("Назовите ваш проект:", defaultName);
    if (!name) return;
    const newProject: SavedProject = {
      id: initialProject ? initialProject.id : Date.now().toString(),
      name,
      timestamp: Date.now(),
      slides,
      config
    };
    const otherProjects = savedProjects.filter(p => p.id !== newProject.id);
    const updatedProjects = [newProject, ...otherProjects];
    setSavedProjects(updatedProjects);
    localStorage.setItem('carousel_projects', JSON.stringify(updatedProjects));
    onSave();
  };

  const loadProject = (project: SavedProject) => {
     setSlides(project.slides);
     setConfig(project.config);
     setIsHistoryOpen(false);
     setActivePresetId(null);
  };

  const deleteProject = (id: string) => {
      const updated = savedProjects.filter(p => p.id !== id);
      setSavedProjects(updated);
      localStorage.setItem('carousel_projects', JSON.stringify(updated));
  };

  const quickPresets = templates.filter(t => !t.isHidden);

  return (
    <div className="flex h-screen overflow-hidden font-[Inter] bg-[#FDFBF7]">
      
      {/* LEFT SIDEBAR - Soft White Panel */}
      <aside className="w-84 flex-shrink-0 bg-white border-r border-[#F0EBE5] flex flex-col z-20 shadow-[0_0_20px_rgba(0,0,0,0.02)]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0EBE5]">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-[#F9F9F9] text-[#6B6054] transition-colors">
              <HomeIcon />
            </button>
             <div className="w-7 h-7 bg-[#9CAF88] rounded-full flex items-center justify-center text-white font-bold font-sans text-xs shadow-sm">S</div>
            <h1 className="text-base font-semibold text-[#333]">Редактор</h1>
          </div>
          
          <div className="flex gap-1">
             <button onClick={() => setIsPresetsOpen(true)} className="p-2 rounded-full hover:bg-[#F9F9F9] text-[#8C847C]">
                <SettingsIcon />
             </button>
             <button onClick={saveProject} className="p-2 rounded-full hover:bg-[#F9F9F9] text-[#8C847C]">
                <SaveIcon />
             </button>
             <button onClick={() => setIsHistoryOpen(true)} className="p-2 rounded-full hover:bg-[#F9F9F9] text-[#8C847C]">
                <HistoryIcon />
             </button>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 space-y-1">
          
          {/* BLOCK 0: QUICK STYLES */}
          <AccordionSection
            title="Быстрые стили"
            isOpen={openSections.quickStyles}
            onToggle={() => toggleSection('quickStyles')}
            alwaysOpen
          >
             <div className="grid grid-cols-3 gap-3">
               {quickPresets.map((preset) => {
                 const isNeon = preset.id === 'neon';
                 const isActive = activePresetId === preset.id;
                 return (
                   <button
                     key={preset.id}
                     onClick={() => applyQuickPreset(preset.id, preset.config)}
                     className={`flex flex-col items-center gap-2 group transition-all active:scale-95 ${isActive ? 'scale-105' : ''}`}
                     title={preset.name}
                   >
                      <div 
                        className={`w-full aspect-square rounded-2xl border transition-all flex items-center justify-center overflow-hidden relative shadow-sm
                          ${isActive ? 'border-[#9CAF88] ring-2 ring-[#9CAF88]/20' : 'border-[#F0EBE5] group-hover:border-[#D1CCC0]'}
                        `}
                        style={{ backgroundColor: preset.previewColor || (isNeon ? '#0F0F0F' : '#EEE') }}
                      >
                          {/* Simulated overlay */}
                          <div 
                            className="absolute inset-0 bg-black" 
                            style={{ opacity: preset.config.overlayOpacity / 100 }}
                          />
                          <span 
                            className="relative z-10 text-lg transition-all font-serif"
                            style={{ 
                              fontFamily: preset.config.titleFont,
                              color: preset.textColor || 'white',
                            }}
                          >
                            Aa
                          </span>
                      </div>
                      <span className={`text-[10px] font-medium truncate w-full text-center transition-colors ${isActive ? 'text-[#333] font-bold' : 'text-[#8C847C] group-hover:text-[#333]'}`}>{preset.name}</span>
                   </button>
                 );
               })}
             </div>
             
             {/* NEON SUBMENU */}
             {activePresetId === 'neon' && (
                 <div className="mt-4 p-4 bg-[#121212] rounded-2xl border border-[#333] shadow-inner animate-fadeIn">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Цвет неона</span>
                    </div>
                    <div className="flex justify-between gap-1">
                        {NEON_VARIANTS.map((variant) => (
                            <button
                                key={variant.color}
                                onClick={() => setConfig(prev => ({ ...prev, titleColor: variant.color }))}
                                className="w-8 h-8 rounded-full border-2 transition-all duration-200 relative"
                                style={{ 
                                    backgroundColor: variant.color, 
                                    borderColor: config.titleColor === variant.color ? '#FFFFFF' : 'transparent',
                                    boxShadow: `0 0 10px ${variant.color}40`
                                }}
                            />
                        ))}
                    </div>
                 </div>
             )}
          </AccordionSection>

          {/* BLOCK 1: BACKGROUND */}
          <AccordionSection 
            title="Фон" 
            isOpen={openSections.background} 
            onToggle={() => toggleSection('background')} 
            
          >
            <div className="relative mb-2">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
                id="bg-upload" 
              />
              <label 
                htmlFor="bg-upload" 
                className="cursor-pointer group flex flex-col items-center justify-center w-full h-32 border border-dashed border-[#D7C9B8] rounded-2xl bg-[#FCFAF7] hover:bg-[#F5F2ED] transition-colors overflow-hidden relative"
              >
                {config.backgroundImage ? (
                   <>
                      <img src={config.backgroundImage} className="w-full h-full object-cover opacity-100" alt="preview" />
                      <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                         <span className="text-[#333] text-xs font-bold bg-white px-3 py-1.5 rounded-full shadow-sm">Изменить</span>
                      </div>
                   </>
                ) : (
                  <>
                    <div className="p-2 bg-white rounded-full text-[#8C847C] mb-2 shadow-sm group-hover:scale-110 transition-transform">
                      <UploadIcon />
                    </div>
                    <span className="text-xs text-[#8C847C]">Загрузить фото</span>
                  </>
                )}
              </label>
            </div>
          </AccordionSection>

          {/* BLOCK 2: BACKGROUND EFFECTS */}
          <AccordionSection 
            title="Эффекты фона" 
            isOpen={openSections.effects} 
            onToggle={() => toggleSection('effects')}
          >
             <Slider
               label="Затемнение"
               value={config.overlayOpacity}
               min={0}
               max={95}
               onChange={(val) => setConfig({...config, overlayOpacity: val})}
               unit="%"
             />

             <Slider
               label="Зернистость"
               value={config.noiseOpacity}
               min={0}
               max={80}
               onChange={(val) => setConfig({...config, noiseOpacity: val})}
               unit="%"
             />
          </AccordionSection>

          {/* BLOCK 3: TYPOGRAPHY */}
          <AccordionSection 
            title="Типографика" 
            isOpen={openSections.typography} 
            onToggle={() => toggleSection('typography')}
          >
             {/* Title Settings */}
             <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-bold uppercase text-[#6B6054]">Заголовки</label>
                    <input
                        type="color"
                        value={config.titleColor || config.textColor}
                        onChange={(e) => setConfig({ ...config, titleColor: e.target.value })}
                        className="w-6 h-6 rounded-full cursor-pointer border border-[#E5E0D8] p-0 overflow-hidden"
                    />
                </div>
                <div className="bg-[#FCFAF7] border border-[#F0EBE5] rounded-xl p-2 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
                     {fontOptions.map((font) => (
                        <div
                          key={`title-${font.value}`}
                          onClick={() => setConfig({ ...config, titleFont: font.value })}
                          className={`cursor-pointer px-3 py-2 rounded-lg text-xs flex justify-between items-center mb-1 ${
                            config.titleFont === font.value ? 'bg-white shadow-sm text-[#333] font-semibold' : 'text-[#8C847C] hover:bg-white/50'
                          }`}
                          style={{ fontFamily: font.value }}
                        >
                          {font.label}
                          {config.titleFont === font.value && <div className="w-1.5 h-1.5 bg-[#9CAF88] rounded-full"></div>}
                        </div>
                     ))}
                     <div className="relative mt-2 pt-2 border-t border-dashed border-[#E5E0D8]">
                        <input type="file" onChange={handleFontUpload} className="hidden" id="font-upload" accept=".ttf,.otf,.woff,.woff2" />
                        <label htmlFor="font-upload" className="text-[10px] text-[#8C847C] hover:text-[#333] cursor-pointer flex items-center gap-1 justify-center py-1">
                            + Загрузить шрифт
                        </label>
                     </div>
                </div>
                <Slider
                    label="Размер"
                    value={config.titleFontSize}
                    min={40}
                    max={140}
                    onChange={(val) => setConfig({...config, titleFontSize: val})}
                    unit="px"
                />
             </div>

             {/* Body Settings */}
             <div>
                <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-bold uppercase text-[#6B6054]">Основной текст</label>
                    <input
                        type="color"
                        value={config.bodyColor || config.textColor}
                        onChange={(e) => setConfig({ ...config, bodyColor: e.target.value })}
                        className="w-6 h-6 rounded-full cursor-pointer border border-[#E5E0D8] p-0 overflow-hidden"
                    />
                </div>
                <div className="bg-[#FCFAF7] border border-[#F0EBE5] rounded-xl p-2 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
                     {fontOptions.map((font) => (
                        <div
                          key={`body-${font.value}`}
                          onClick={() => setConfig({ ...config, bodyFont: font.value })}
                          className={`cursor-pointer px-3 py-2 rounded-lg text-xs flex justify-between items-center mb-1 ${
                            config.bodyFont === font.value ? 'bg-white shadow-sm text-[#333] font-semibold' : 'text-[#8C847C] hover:bg-white/50'
                          }`}
                          style={{ fontFamily: font.value }}
                        >
                          {font.label}
                          {config.bodyFont === font.value && <div className="w-1.5 h-1.5 bg-[#9CAF88] rounded-full"></div>}
                        </div>
                     ))}
                </div>
                <Slider
                    label="Размер"
                    value={config.bodyFontSize}
                    min={24}
                    max={80}
                    onChange={(val) => setConfig({...config, bodyFontSize: val})}
                    unit="px"
                />
             </div>
          </AccordionSection>

          {/* BLOCK 4: SLIDES MANAGEMENT */}
          <AccordionSection 
            title="Слайды" 
            isOpen={openSections.slides} 
            onToggle={() => toggleSection('slides')}
          >
             <div className="flex items-center justify-between mb-4 px-1">
                 <span className="text-xs font-semibold text-[#6B6054]">Слайд {currentSlideIndex + 1} / {slides.length}</span>
             </div>

             <div className="grid grid-cols-3 gap-3">
                 <button 
                   onClick={addSlide}
                   disabled={slides.length >= 10}
                   className="flex flex-col items-center justify-center p-3 bg-white border border-[#F0EBE5] rounded-xl hover:bg-[#F9F9F9] hover:border-[#D1CCC0] transition-all disabled:opacity-50 group shadow-sm"
                   title="Добавить новый"
                 >
                    <div className="text-[#8C847C] group-hover:text-[#9CAF88]"><PlusIcon /></div>
                    <span className="text-[10px] mt-1 font-medium text-[#8C847C]">Добавить</span>
                 </button>

                 <button 
                   onClick={duplicateSlide}
                   disabled={slides.length >= 10}
                   className="flex flex-col items-center justify-center p-3 bg-white border border-[#F0EBE5] rounded-xl hover:bg-[#F9F9F9] hover:border-[#D1CCC0] transition-all disabled:opacity-50 group shadow-sm"
                   title="Дублировать текущий"
                 >
                    <div className="text-[#8C847C] group-hover:text-[#333]"><CopyIcon /></div>
                    <span className="text-[10px] mt-1 font-medium text-[#8C847C]">Копия</span>
                 </button>

                 <button 
                   onClick={removeSlide}
                   disabled={slides.length <= 1}
                   className="flex flex-col items-center justify-center p-3 bg-white border border-[#F0EBE5] rounded-xl hover:bg-red-50 hover:border-red-100 transition-all disabled:opacity-50 group shadow-sm"
                   title="Удалить текущий"
                 >
                    <div className="text-[#8C847C] group-hover:text-red-400"><TrashIcon /></div>
                    <span className="text-[10px] mt-1 font-medium text-[#8C847C]">Удалить</span>
                 </button>
             </div>
          </AccordionSection>
        </div>

        {/* FIXED FOOTER */}
        <div className="p-6 border-t border-[#F0EBE5] bg-white z-10">
          <Button fullWidth onClick={handleDownload} disabled={isExporting} className="shadow-[0_8px_20px_rgba(156,175,136,0.25)]">
            {isExporting ? 'Создание...' : (
              <>
                <DownloadIcon /> Скачать (HD)
              </>
            )}
          </Button>
          <p className="text-center text-[10px] text-[#D1CCC0] mt-3 uppercase tracking-wider font-medium">
            1080x1350 • Instagram
          </p>
        </div>
      </aside>

      {/* MAIN WORKSPACE - Soft Cream Canvas Area */}
      <main 
        className="flex-1 bg-[#F2F0E9] relative flex flex-col h-full overflow-hidden"
      >
        {/* TOP NAVIGATION */}
        <div className="w-full flex justify-center px-10 pt-8 pb-4 z-30 shrink-0">
            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-6 py-2 rounded-full border border-white transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <button 
                    onClick={() => scrollToSlide(currentSlideIndex - 1)} 
                    disabled={currentSlideIndex === 0}
                    className="p-1.5 text-[#6B6054] hover:bg-[#F5F2ED] rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeftIcon />
                </button>
                <span className="text-sm font-semibold text-[#333] font-mono min-w-[60px] text-center select-none">
                    {currentSlideIndex + 1} / {slides.length}
                </span>
                <button 
                    onClick={() => scrollToSlide(currentSlideIndex + 1)} 
                    disabled={currentSlideIndex === slides.length - 1}
                    className="p-1.5 text-[#6B6054] hover:bg-[#F5F2ED] rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRightIcon />
                </button>
            </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div 
            ref={scrollContainerRef}
            className="flex-1 flex items-center overflow-x-auto overflow-y-hidden px-16 pt-4 pb-8 gap-12 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {slides.map((slide, index) => (
            <div 
              key={slide.id} 
              ref={el => { slideWrapperRefs.current[index] = el; }}
              data-index={index}
              className="group relative flex-shrink-0 flex flex-col items-center justify-center transition-all duration-500 snap-center"
            >
              {/* Slide Canvas Wrapper */}
              <div 
                className={`relative transition-all duration-500 rounded-sm overflow-hidden ${
                    currentSlideIndex === index 
                    ? 'shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] scale-100 ring-4 ring-white' 
                    : 'shadow-lg scale-95 opacity-70 cursor-pointer'
                }`}
                onClick={() => {
                    scrollToSlide(index);
                }}
              >
                <SlideCanvas
                  slide={slide}
                  config={config}
                  onTextChange={updateSlideText}
                  onTitleChange={updateSlideTitle}
                  onSubtitleChange={updateSlideSubtitle}
                  scale={0.45} 
                  forwardedRef={(el) => { slideRefs.current[slide.id] = el; }}
                />
              </div>
            </div>
          ))}
          
          <div className="w-24 flex-shrink-0"></div>
        </div>
      </main>

      {/* MODALS (Soft styling applied) */}
      {isPresetsOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#333]/10 backdrop-blur-sm p-4" onClick={() => setIsPresetsOpen(false)}>
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#F5F2ED]" onClick={e => e.stopPropagation()}>
               <div className="p-6 border-b border-[#F5F2ED] flex justify-between items-center bg-white">
                  <h3 className="font-bold text-[#333] text-lg">Ваши стили</h3>
                  <button onClick={() => setIsPresetsOpen(false)} className="text-[#D1CCC0] hover:text-[#333] transition-colors">✕</button>
               </div>
               <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                     <h4 className="text-xs font-bold uppercase text-[#8C847C] tracking-wide">Сохраненное</h4>
                     <button onClick={savePreset} className="text-xs text-[#9CAF88] font-bold hover:underline">+ Создать новый</button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                     {presets.length === 0 && <span className="text-sm text-[#D1CCC0] italic w-full text-center py-4">Нет сохраненных стилей</span>}
                     {presets.map(preset => (
                         <div 
                            key={preset.id}
                            onClick={() => applyPreset(preset)}
                            className="flex items-center gap-3 px-4 py-2 bg-[#F9F9F9] border border-transparent rounded-full text-sm text-[#6B6054] cursor-pointer hover:bg-white hover:border-[#E5E0D8] hover:shadow-sm transition-all"
                         >
                           <span className="font-medium">{preset.name}</span>
                           <button onClick={(e) => deletePreset(preset.id, e)} className="text-[#D1CCC0] hover:text-red-400 ml-1">×</button>
                         </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      )}

      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#333]/10 backdrop-blur-sm p-4" onClick={() => setIsHistoryOpen(false)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[80vh] flex flex-col border border-[#F5F2ED]" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[#F5F2ED] flex justify-between items-center bg-white">
              <h3 className="text-xl font-bold text-[#333]">История</h3>
              <button onClick={() => setIsHistoryOpen(false)} className="text-[#D1CCC0] hover:text-[#333] transition-colors">✕</button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
              {savedProjects.length === 0 ? (
                <p className="text-center text-[#D1CCC0] py-12">Нет проектов</p>
              ) : (
                <div className="space-y-4">
                  {savedProjects.map(project => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-[#F9F9F9] rounded-2xl hover:bg-white hover:shadow-md border border-transparent hover:border-[#F5F2ED] transition-all group">
                      <div>
                        <h4 className="font-semibold text-[#333]">{project.name}</h4>
                        <p className="text-xs text-[#8C847C] mt-1">{new Date(project.timestamp).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => loadProject(project)} className="px-4 py-2 text-xs font-bold bg-[#9CAF88] text-white rounded-xl shadow-sm hover:bg-[#8A9E75]">Открыть</button>
                        <button onClick={() => deleteProject(project.id)} className="p-2 text-[#D1CCC0] hover:text-red-400"><TrashIcon /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

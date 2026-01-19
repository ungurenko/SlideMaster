import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { HeroImage, Template, DEFAULT_TEMPLATES, DEFAULT_FONT_OPTIONS } from '../types';
import { Button } from './Button';
import { compressImage } from '../utils/imageUtils';

interface AdminPanelProps {
  onBack: () => void;
  onUpdateImages: (images: HeroImage[]) => void;
  onUpdateTemplates: (templates: Template[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, onUpdateImages, onUpdateTemplates }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'hero' | 'templates'>('hero');
  
  // Hero Images State
  const [images, setImages] = useState<HeroImage[]>([]);

  // Templates State
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  useEffect(() => {
    // Load Images
    const storedImages = localStorage.getItem('hero_images');
    if (storedImages) {
      try {
        setImages(JSON.parse(storedImages));
      } catch (e) { console.error(e); }
    }

    // Load Templates
    const storedTemplates = localStorage.getItem('carousel_templates');
    if (storedTemplates) {
      try {
        setTemplates(JSON.parse(storedTemplates));
      } catch (e) { console.error(e); }
    } else {
      setTemplates(DEFAULT_TEMPLATES);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Get password from environment variables
    const adminPassword = (import.meta as any).env.VITE_ADMIN_PASSWORD;

    if (password === adminPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  // --- HERO IMAGE HANDLERS ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const file = target.files?.[0];
    if (!file) return;

    try {
        // Use shared utility
        const compressedBase64 = await compressImage(file, 800, 0.7);
        const newImage: HeroImage = {
            id: Date.now().toString(),
            url: compressedBase64,
            caption: `Image ${images.length + 1}`
        };
        const updated = [...images, newImage];
        saveImages(updated);
    } catch (err) {
        console.error("Image compression failed", err);
        toast.error("Не удалось обработать изображение");
    } finally {
        target.value = ''; 
    }
  };

  const deleteImage = (id: string) => {
    if (confirm('Удалить это изображение?')) {
      const updated = images.filter(img => img.id !== id);
      saveImages(updated);
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    const updated = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    saveImages(updated);
  };

  const saveImages = (newImages: HeroImage[]) => {
    try {
        localStorage.setItem('hero_images', JSON.stringify(newImages));
        setImages(newImages);
        onUpdateImages(newImages);
    } catch (e: any) {
        if (e.name === 'QuotaExceededError') {
             toast.error("Хранилище переполнено. Удалите старые изображения");
        } else {
             console.error(e);
        }
    }
  };

  // --- TEMPLATE HANDLERS ---

  const saveTemplates = (newTemplates: Template[]) => {
    try {
        localStorage.setItem('carousel_templates', JSON.stringify(newTemplates));
        setTemplates(newTemplates);
        onUpdateTemplates(newTemplates);
    } catch (e: any) {
        if (e.name === 'QuotaExceededError') {
             toast.error("Хранилище переполнено");
        }
    }
  };

  const toggleTemplateVisibility = (id: string) => {
    const updated = templates.map(t => t.id === id ? { ...t, isHidden: !t.isHidden } : t);
    saveTemplates(updated);
  };

  const deleteTemplate = (id: string) => {
    if (confirm("Удалить этот шаблон безвозвратно?")) {
      const updated = templates.filter(t => t.id !== id);
      saveTemplates(updated);
    }
  };

  const moveTemplate = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === templates.length - 1) return;

    const updated = [...templates];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    saveTemplates(updated);
  };

  const createNewTemplate = () => {
    const newTemplate: Template = {
      id: `tpl-${Date.now()}`,
      name: 'Новый стиль',
      previewColor: '#E2E8F0',
      textColor: '#000000',
      isHidden: false,
      config: {
        backgroundImage: null,
        titleFont: 'Montserrat',
        titleFontSize: 64,
        bodyFont: 'Open Sans',
        bodyFontSize: 32,
        titleColor: '#000000',
        bodyColor: '#333333',
        textColor: '#333333',
        overlayOpacity: 20,
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
    };
    saveTemplates([...templates, newTemplate]);
    setEditingTemplate(newTemplate);
  };

  const handleSaveEditedTemplate = () => {
    if (!editingTemplate) return;
    const updated = templates.map(t => t.id === editingTemplate.id ? editingTemplate : t);
    saveTemplates(updated);
    setEditingTemplate(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-[#E8DDD1] w-full max-w-md">
          <h2 className="text-2xl font-bold text-[#4A4036] mb-6 text-center">Административная панель</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Пароль доступа"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-[#D7C9B8] rounded-xl focus:outline-none focus:border-[#4A4036]"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <Button type="submit" fullWidth>Войти</Button>
            <button 
              type="button" 
              onClick={onBack}
              className="w-full text-center text-sm text-[#8C7B6B] hover:text-[#4A4036] mt-4"
            >
              Вернуться на сайт
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- EDITOR VIEW ---
  if (editingTemplate) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] p-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-[#E8DDD1]">
          <div className="flex justify-between items-center mb-6 border-b border-[#E8DDD1] pb-4">
             <h2 className="text-xl font-bold text-[#4A4036]">Редактирование шаблона</h2>
             <button onClick={() => setEditingTemplate(null)} className="text-[#8C7B6B]">Отмена</button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-bold uppercase text-[#8C7B6B] mb-1">Название</label>
                 <input 
                    value={editingTemplate.name} 
                    onChange={e => setEditingTemplate({...editingTemplate, name: e.target.value})} 
                    className="w-full p-2 border rounded-lg bg-[#F5F0EB]"
                 />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase text-[#8C7B6B] mb-1">Превью (Цвет карточки)</label>
                  <div className="flex gap-2 items-center">
                    <input 
                        type="color"
                        value={editingTemplate.previewColor} 
                        onChange={e => setEditingTemplate({...editingTemplate, previewColor: e.target.value})} 
                        className="h-9 w-full cursor-pointer"
                    />
                  </div>
               </div>
            </div>

            {/* Typography Config */}
            <div>
               <h3 className="font-bold text-[#4A4036] mb-3 border-b border-[#E8DDD1] pb-1">Заголовки</h3>
               <div className="grid grid-cols-3 gap-4">
                  <div>
                     <label className="block text-xs text-[#8C7B6B] mb-1">Шрифт</label>
                     <select 
                        value={editingTemplate.config.titleFont}
                        onChange={e => setEditingTemplate({
                            ...editingTemplate, 
                            config: { ...editingTemplate.config, titleFont: e.target.value }
                        })}
                        className="w-full p-2 border rounded-lg bg-white text-sm"
                     >
                        {DEFAULT_FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs text-[#8C7B6B] mb-1">Размер (px)</label>
                     <input 
                        type="number"
                        value={editingTemplate.config.titleFontSize}
                        onChange={e => setEditingTemplate({
                            ...editingTemplate, 
                            config: { ...editingTemplate.config, titleFontSize: Number(e.target.value) }
                        })}
                        className="w-full p-2 border rounded-lg bg-white text-sm"
                     />
                  </div>
                  <div>
                     <label className="block text-xs text-[#8C7B6B] mb-1">Цвет</label>
                     <input 
                        type="color"
                        value={editingTemplate.config.titleColor || '#000000'}
                        onChange={e => setEditingTemplate({
                            ...editingTemplate, 
                            config: { ...editingTemplate.config, titleColor: e.target.value }
                        })}
                        className="w-full h-9 cursor-pointer"
                     />
                  </div>
               </div>
            </div>

            {/* Body Config */}
            <div>
               <h3 className="font-bold text-[#4A4036] mb-3 border-b border-[#E8DDD1] pb-1">Текст</h3>
               <div className="grid grid-cols-3 gap-4">
                  <div>
                     <label className="block text-xs text-[#8C7B6B] mb-1">Шрифт</label>
                     <select 
                        value={editingTemplate.config.bodyFont}
                        onChange={e => setEditingTemplate({
                            ...editingTemplate, 
                            config: { ...editingTemplate.config, bodyFont: e.target.value }
                        })}
                        className="w-full p-2 border rounded-lg bg-white text-sm"
                     >
                        {DEFAULT_FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs text-[#8C7B6B] mb-1">Размер (px)</label>
                     <input 
                        type="number"
                        value={editingTemplate.config.bodyFontSize}
                        onChange={e => setEditingTemplate({
                            ...editingTemplate, 
                            config: { ...editingTemplate.config, bodyFontSize: Number(e.target.value) }
                        })}
                        className="w-full p-2 border rounded-lg bg-white text-sm"
                     />
                  </div>
                  <div>
                     <label className="block text-xs text-[#8C7B6B] mb-1">Цвет</label>
                     <input 
                        type="color"
                        value={editingTemplate.config.bodyColor || '#000000'}
                        onChange={e => setEditingTemplate({
                            ...editingTemplate, 
                            config: { ...editingTemplate.config, bodyColor: e.target.value }
                        })}
                        className="w-full h-9 cursor-pointer"
                     />
                  </div>
               </div>
            </div>

            {/* Effects Config */}
            <div>
               <h3 className="font-bold text-[#4A4036] mb-3 border-b border-[#E8DDD1] pb-1">Эффекты</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs text-[#8C7B6B] mb-1">Затемнение (%)</label>
                     <input 
                        type="number" min="0" max="100"
                        value={editingTemplate.config.overlayOpacity}
                        onChange={e => setEditingTemplate({
                            ...editingTemplate, 
                            config: { ...editingTemplate.config, overlayOpacity: Number(e.target.value) }
                        })}
                        className="w-full p-2 border rounded-lg bg-white text-sm"
                     />
                  </div>
                  <div>
                     <label className="block text-xs text-[#8C7B6B] mb-1">Зернистость (%)</label>
                     <input 
                        type="number" min="0" max="100"
                        value={editingTemplate.config.noiseOpacity}
                        onChange={e => setEditingTemplate({
                            ...editingTemplate, 
                            config: { ...editingTemplate.config, noiseOpacity: Number(e.target.value) }
                        })}
                        className="w-full p-2 border rounded-lg bg-white text-sm"
                     />
                  </div>
               </div>
            </div>

             <Button onClick={handleSaveEditedTemplate} fullWidth>Сохранить изменения</Button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN LIST VIEW ---
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A4036] font-[Inter]">
      <header className="px-8 py-4 bg-white border-b border-[#E8DDD1] flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex gap-4">
           <button 
             onClick={() => setActiveTab('hero')} 
             className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'hero' ? 'bg-[#4A4036] text-white' : 'text-[#8C7B6B] hover:bg-[#F5F0EB]'}`}
           >
             Welcome Screen (Картинки)
           </button>
           <button 
             onClick={() => setActiveTab('templates')} 
             className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'templates' ? 'bg-[#4A4036] text-white' : 'text-[#8C7B6B] hover:bg-[#F5F0EB]'}`}
           >
             Шаблоны / Пресеты
           </button>
        </div>
        <button onClick={onBack} className="text-sm font-medium hover:underline px-3 py-1 bg-[#F5F0EB] rounded-lg">Выйти</button>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        
        {/* TAB: HERO IMAGES */}
        {activeTab === 'hero' && (
            <div>
                 <div className="mb-8">
                    <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A4036] text-white rounded-xl cursor-pointer hover:bg-[#3A3026] transition-colors shadow-md select-none">
                        <span>+ Загрузить изображение</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>

                <div className="space-y-4">
                    {images.map((img, index) => (
                        <div key={img.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-[#E8DDD1] shadow-sm">
                            <div className="flex-shrink-0 w-8 font-bold text-[#D7C9B8] text-xl text-center">{index + 1}</div>
                            <div className="w-16 h-20 bg-[#F5F0EB] rounded-lg overflow-hidden border relative">
                                <img src={img.url} alt="preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                                <p className="text-xs text-[#8C7B6B]">ID: {img.id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => moveImage(index, 'up')} disabled={index === 0} className="p-2 hover:bg-[#F5F0EB] rounded text-[#4A4036]">↑</button>
                                <button onClick={() => moveImage(index, 'down')} disabled={index === images.length - 1} className="p-2 hover:bg-[#F5F0EB] rounded text-[#4A4036]">↓</button>
                                <div className="w-px h-6 bg-[#E8DDD1] mx-2"></div>
                                <button onClick={() => deleteImage(img.id)} className="p-2 text-red-400 hover:bg-red-50 rounded">✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* TAB: TEMPLATES */}
        {activeTab === 'templates' && (
             <div>
                <div className="mb-8">
                    <button 
                      onClick={createNewTemplate}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A4036] text-white rounded-xl hover:bg-[#3A3026] transition-colors shadow-md"
                    >
                        <span>+ Новый стиль</span>
                    </button>
                </div>

                <div className="space-y-3">
                    {templates.map((tpl, index) => (
                        <div key={tpl.id} className={`flex items-center gap-4 bg-white p-4 rounded-xl border ${tpl.isHidden ? 'border-dashed border-gray-300 opacity-60' : 'border-[#E8DDD1] shadow-sm'}`}>
                            
                            <div className="flex-shrink-0 w-6 font-bold text-[#D7C9B8] text-center">{index + 1}</div>
                            
                            {/* Preview Swatch */}
                            <div 
                                className="w-16 h-16 rounded-lg flex items-center justify-center text-xl font-bold border border-[#E8DDD1]"
                                style={{ backgroundColor: tpl.previewColor, color: tpl.textColor }}
                            >
                                Aa
                            </div>

                            <div className="flex-grow">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-[#4A4036]">{tpl.name}</h4>
                                    {tpl.isHidden && <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">Скрыт</span>}
                                </div>
                                <p className="text-xs text-[#8C7B6B]">
                                    {tpl.config.titleFont} + {tpl.config.bodyFont}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => toggleTemplateVisibility(tpl.id)} 
                                    className={`text-xs px-3 py-1.5 rounded-lg font-bold ${tpl.isHidden ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    {tpl.isHidden ? 'Показать' : 'Скрыть'}
                                </button>
                                <button 
                                    onClick={() => setEditingTemplate(tpl)}
                                    className="px-3 py-1.5 bg-[#F5F0EB] hover:bg-[#EAE0D5] text-[#4A4036] text-xs font-bold rounded-lg"
                                >
                                    Изменить
                                </button>
                                <div className="w-px h-6 bg-[#E8DDD1] mx-1"></div>
                                <div className="flex flex-col">
                                    <button onClick={() => moveTemplate(index, 'up')} disabled={index === 0} className="text-[10px] hover:bg-[#F5F0EB] p-1 text-[#4A4036]">▲</button>
                                    <button onClick={() => moveTemplate(index, 'down')} disabled={index === templates.length - 1} className="text-[10px] hover:bg-[#F5F0EB] p-1 text-[#4A4036]">▼</button>
                                </div>
                                <button onClick={() => deleteTemplate(tpl.id)} className="p-2 text-red-400 hover:bg-red-50 rounded ml-1">✕</button>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        )}

      </main>
    </div>
  );
};
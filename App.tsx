
import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CarouselEditor } from './components/CarouselEditor';
import { AdminPanel } from './components/AdminPanel';
import { Wizard } from './components/Wizard';
import { Toaster } from './components/ui/sonner';
import { SavedProject, CarouselConfig, HeroImage, Template, DEFAULT_TEMPLATES, SlideData } from './types';

type ViewState = 'home' | 'editor' | 'admin' | 'wizard';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [currentProject, setCurrentProject] = useState<SavedProject | null>(null);
  
  // New: separate config vs full slides injection
  const [initialTemplateConfig, setInitialTemplateConfig] = useState<CarouselConfig | null>(null);
  const [initialSlides, setInitialSlides] = useState<SlideData[] | null>(null);

  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);

  // Load data from localStorage on mount
  useEffect(() => {
    loadProjects();
    loadHeroImages();
    loadTemplates();
  }, [view]);

  const loadProjects = () => {
    const stored = localStorage.getItem('carousel_projects');
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse projects", e);
      }
    }
  };

  const loadHeroImages = () => {
    const stored = localStorage.getItem('hero_images');
    if (stored) {
      try {
        setHeroImages(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse hero images", e);
      }
    }
  };

  const loadTemplates = () => {
    const stored = localStorage.getItem('carousel_templates');

    // ID встроенных шаблонов, которые нужно обновлять из DEFAULT_TEMPLATES
    const builtInIds = DEFAULT_TEMPLATES.map(t => t.id);

    if (stored) {
      try {
        const savedTemplates: Template[] = JSON.parse(stored);

        // Фильтруем пользовательские шаблоны (не встроенные)
        const customTemplates = savedTemplates.filter(t => !builtInIds.includes(t.id));

        // Объединяем: актуальные встроенные + пользовательские
        const mergedTemplates = [...DEFAULT_TEMPLATES, ...customTemplates];

        setTemplates(mergedTemplates);

        // Обновляем localStorage актуальными данными
        localStorage.setItem('carousel_templates', JSON.stringify(mergedTemplates));
      } catch (e) {
        console.error("Failed to parse templates", e);
        setTemplates(DEFAULT_TEMPLATES);
      }
    } else {
      // First run: initialize with defaults
      setTemplates(DEFAULT_TEMPLATES);
    }
  };

  const handleCreateNew = (templateConfig?: CarouselConfig) => {
    setCurrentProject(null);
    setInitialTemplateConfig(templateConfig || null);
    setInitialSlides(null); // Reset slides for manual creation
    setView('editor');
  };

  const handleAutoCreate = () => {
    setView('wizard');
  };

  const handleWizardFinish = (config: CarouselConfig, slides: SlideData[]) => {
    setCurrentProject(null);
    setInitialTemplateConfig(config);
    setInitialSlides(slides);
    setView('editor');
  };

  const handleOpenProject = (project: SavedProject) => {
    setCurrentProject(project);
    setInitialTemplateConfig(null);
    setInitialSlides(null);
    setView('editor');
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Вы уверены, что хотите удалить этот проект?")) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem('carousel_projects', JSON.stringify(updated));
    }
  };

  const handleBackToHome = () => {
    console.log('handleBackToHome called, current view:', view);
    setView('home');
    setCurrentProject(null);
    console.log('setView(home) called');
  };

  const handleSave = () => {
      // Refresh projects if we are in editor and save happens
      loadProjects();
  };

  return (
    <>
      {view === 'home' && (
        <WelcomeScreen 
          recentProjects={projects}
          heroImages={heroImages}
          templates={templates}
          onCreateNew={handleCreateNew}
          onAutoCreate={handleAutoCreate} 
          onOpenProject={handleOpenProject}
          onDeleteProject={handleDeleteProject}
          onAdminClick={() => setView('admin')}
        />
      )}
      
      {view === 'wizard' && (
        <Wizard 
          isOpen={true} 
          onClose={() => setView('home')} 
          templates={templates}
          onFinish={handleWizardFinish}
        />
      )}
      
      {view === 'editor' && (
        <CarouselEditor 
          initialProject={currentProject}
          initialConfig={initialTemplateConfig}
          initialSlides={initialSlides} 
          templates={templates}
          onBack={handleBackToHome}
          onSave={handleSave}
        />
      )}

      {view === 'admin' && (
        <AdminPanel
          onBack={() => setView('home')}
          onUpdateImages={(imgs) => setHeroImages(imgs)}
          onUpdateTemplates={(tmps) => setTemplates(tmps)}
        />
      )}

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#FFFDF9',
            border: '1px solid #E5E0D8',
            color: '#333333',
          },
        }}
      />
    </>
  );
};

export default App;

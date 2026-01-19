
import React, { useState, useEffect } from 'react';
import { SavedProject, CarouselConfig, HeroImage, Template } from '../types';
import { Skeleton } from './ui/skeleton';

// Project Card Skeleton
const ProjectSkeleton = () => (
  <div className="bg-white p-4 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F5F2ED]">
    <Skeleton className="w-full aspect-[4/5] rounded-2xl mb-4" />
    <div className="flex justify-between items-center px-1">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);

// Icons
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );

const MegaphoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
  </svg>
);

interface WelcomeScreenProps {
  recentProjects: SavedProject[];
  heroImages?: HeroImage[];
  templates: Template[];
  isLoading?: boolean;
  onCreateNew: (templateConfig?: CarouselConfig) => void;
  onAutoCreate: () => void;
  onCreateCTA?: () => void;
  onOpenProject: (project: SavedProject) => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
  onAdminClick: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  recentProjects,
  heroImages = [],
  templates,
  isLoading = false,
  onCreateNew,
  onAutoCreate,
  onCreateCTA,
  onOpenProject,
  onDeleteProject,
  onAdminClick
}) => {
  // Logic to determine what to show in the Hero Stack
  const showCustomImages = heroImages && heroImages.length > 0;
  
  // Mapping logic: Index 0 -> Front, 1 -> Middle, 2 -> Back
  const frontImg = showCustomImages ? heroImages[0] : null;
  const middleImg = showCustomImages ? heroImages[1] : null;
  const backImg = showCustomImages ? heroImages[2] : null;

  const visibleTemplates = templates.filter(t => !t.isHidden);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#333333] font-[Inter] flex flex-col selection:bg-[#9CAF88] selection:text-white">
      
      {/* HEADER */}
      <header className="px-10 py-6 flex justify-between items-center bg-[#FFFDF9]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-default select-none group">
            <div className="w-8 h-8 bg-[#9CAF88] rounded-full flex items-center justify-center text-white font-bold font-[Inter] text-sm shadow-md group-hover:scale-110 transition-transform duration-300">
               S
            </div>
            <span className="font-semibold text-lg tracking-tight text-[#4A4A4A]">СлайдМастер</span>
        </div>
        <div className="flex gap-6 text-[#8C847C]">
            <button onClick={onAdminClick} className="hover:text-[#9CAF88] transition-colors" title="Панель администратора">
              <HomeIcon />
            </button>
            <button className="hover:text-[#9CAF88] transition-colors"><HelpIcon /></button>
            <button className="hover:text-[#9CAF88] transition-colors"><SettingsIcon /></button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-12 flex flex-col gap-20">
        
        {/* HERO SECTION */}
        <section className="flex flex-col md:flex-row items-center gap-12 md:gap-24 min-h-[400px]">
           
           {/* LEFT: Stack of Examples */}
           <div className="flex-1 relative w-full h-[350px] md:h-[450px] flex items-center justify-center select-none animate-float group cursor-pointer perspective-1000">
              {/* DECORATIVE PARTICLES */}
              <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
                  <div className="absolute top-20 right-20 w-8 h-8 bg-[#F4D35E]/40 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-75 group-hover:translate-x-8 group-hover:-translate-y-8 group-hover:scale-150" />
                  <div className="absolute bottom-20 left-20 w-12 h-12 bg-[#9CAF88]/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-100 group-hover:-translate-x-10 group-hover:translate-y-4 group-hover:scale-125" />
              </div>

              {/* Back Card */}
              <div className="absolute w-64 h-80 rounded-[32px] shadow-[0_20px_40px_-10px_rgba(230,184,162,0.3)] transform transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                rotate-[-12deg] -translate-x-16 translate-y-4 overflow-hidden bg-[#E6B8A2] z-0
                group-hover:-translate-x-44 group-hover:rotate-[-25deg] group-hover:scale-105 group-hover:shadow-[0_30px_60px_-12px_rgba(230,184,162,0.5)]"
              >
                 {backImg ? (
                    <img src={backImg.url} className="w-full h-full object-cover" alt="" />
                 ) : (
                    <img src="https://i.imgur.com/nAdFa4c.png" className="w-full h-full object-cover" alt="Inspiration" />
                 )}
              </div>

              {/* Middle Card */}
              <div className="absolute w-64 h-80 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(156,175,136,0.3)] transform transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                rotate-[-5deg] -translate-x-6 translate-y-0 overflow-hidden bg-[#CCD5AE] z-10
                group-hover:-translate-y-20 group-hover:rotate-0 group-hover:scale-110 group-hover:shadow-[0_40px_80px_-12px_rgba(156,175,136,0.5)]"
              >
                 {middleImg ? (
                    <img src={middleImg.url} className="w-full h-full object-cover opacity-80 mix-blend-multiply" alt="" />
                 ) : (
                    <img src="https://i.imgur.com/6kLhlvU.png" className="w-full h-full object-cover" alt="Art" />
                 )}
              </div>

              {/* Front Card */}
              <div className="absolute w-64 h-80 rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] bg-white border border-white/50 transform transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                rotate-[6deg] translate-x-8 -translate-y-4 overflow-hidden flex flex-col z-20 relative
                group-hover:translate-x-36 group-hover:rotate-[25deg] group-hover:scale-105 group-hover:shadow-[0_40px_80px_-12px_rgba(0,0,0,0.15)]"
              >
                 {frontImg ? (
                    <img src={frontImg.url} className="w-full h-full object-cover" alt="" />
                 ) : (
                    <img src="https://i.imgur.com/zFTeJGf.jpeg" className="w-full h-full object-cover" alt="Visual Stories" />
                 )}
              </div>
           </div>

           {/* RIGHT: Welcome Text & Actions */}
           <div className="flex-1 w-full max-w-lg">
              <div className="bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#F5F2ED]">
                 <span className="inline-block px-4 py-1.5 rounded-full bg-[#F5F2ED] text-[#8C847C] text-xs font-semibold uppercase tracking-wider mb-6">
                    Beta v1.2
                 </span>
                 
                 <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-[#333] tracking-tight font-[Inter] leading-tight">
                    Создавай эстетику <span className="text-[#9CAF88] font-serif italic">без усилий</span>
                 </h1>
                 
                 <p className="text-[#6B6054] mb-10 text-lg leading-relaxed font-light">
                    Редактор каруселей, который заботится о вашем контенте. Мягкая типографика, плавные формы и ничего лишнего.
                 </p>
                 
                 <div className="flex flex-col gap-4">
                    {/* Primary: Manual Create */}
                    <button
                      onClick={() => onCreateNew()}
                      className="w-full py-4 bg-[#4A4036] text-white text-lg font-medium rounded-2xl shadow-[0_10px_25px_rgba(74,64,54,0.3)] hover:bg-[#3A3026] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <span>Начать с чистого листа</span>
                    </button>

                     {/* Secondary: Auto Create */}
                     <button
                      onClick={onAutoCreate}
                      className="w-full py-4 bg-[#9CAF88] text-white text-lg font-medium rounded-2xl shadow-[0_10px_25px_rgba(156,175,136,0.4)] hover:bg-[#8A9E75] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                        <SparklesIcon />
                        <span>Создать автоматически</span>
                    </button>

                    {/* Tertiary: CTA Slide */}
                    {onCreateCTA && (
                      <button
                        onClick={onCreateCTA}
                        className="w-full py-4 bg-white text-[#6B6054] text-lg font-medium rounded-2xl border-2 border-[#F0EBE5] shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:border-[#D1CCC0] hover:bg-[#FCFAF7] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                      >
                          <MegaphoneIcon />
                          <span>Создать CTA-слайд</span>
                      </button>
                    )}
                 </div>
              </div>
           </div>
        </section>

        {/* TEMPLATES SECTION */}
        <section>
            <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xl font-medium text-[#333]">Готовые настроения</h3>
            </div>
            <div className="flex gap-6 overflow-x-auto p-8 no-scrollbar snap-x -mx-8 px-8">
                {visibleTemplates.map((tpl) => (
                    <div 
                        key={tpl.id}
                        onClick={() => onCreateNew(tpl.config)}
                        className="flex-shrink-0 w-48 snap-start cursor-pointer group"
                    >
                        <div 
                            className="w-full h-56 rounded-[24px] shadow-[0_10px_20px_rgba(0,0,0,0.03)] mb-4 border border-[#F5F2ED] 
                            bg-white relative overflow-hidden flex items-center justify-center text-center p-4
                            transform transition-all duration-300 ease-out
                            group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] 
                            group-hover:-translate-y-3 
                            group-hover:scale-105
                            group-hover:border-[#E8DDD1]"
                        >
                            <div 
                                className="absolute inset-0 opacity-20 transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundColor: tpl.previewColor }}
                            />
                            <span style={{ color: tpl.textColor === '#FFFFFF' ? '#555' : tpl.textColor, fontFamily: tpl.config.titleFont }} className="text-xl font-medium z-10 relative">
                                {tpl.name}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-[#6B6054] text-center group-hover:text-[#9CAF88] transition-colors translate-y-0 group-hover:-translate-y-1 duration-300">{tpl.name}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* RECENT PROJECTS SECTION */}
        <section className="pb-20">
            <h3 className="text-xl font-medium text-[#333] mb-8">Ваши истории</h3>

            {/* Loading State */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <ProjectSkeleton key={i} />
                    ))}
                </div>
            ) : recentProjects.length === 0 ? (
                <div className="w-full h-48 border-2 border-dashed border-[#E5E0D8] rounded-3xl flex flex-col items-center justify-center text-[#8C847C] gap-3 bg-[#FCFAF7] animate-fadeIn">
                    <span className="opacity-30 text-4xl">✨</span>
                    <p className="font-medium text-sm">Здесь будет ваше вдохновение</p>
                    <button
                        onClick={() => onCreateNew()}
                        className="mt-2 px-4 py-2 text-sm font-medium text-[#9CAF88] hover:text-[#8A9E75] transition-colors"
                    >
                        Создать первую карусель →
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {recentProjects.map((project, index) => (
                        <div
                            key={project.id}
                            onClick={() => onOpenProject(project)}
                            className="bg-white p-4 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] border border-[#F5F2ED] transition-all cursor-pointer group hover:-translate-y-2 duration-300 ease-out animate-fadeIn"
                            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                        >
                            <div className="w-full aspect-[4/5] bg-[#F5F2ED] rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative">
                                {project.config.backgroundImage ? (
                                    <img src={project.config.backgroundImage} className="w-full h-full object-cover opacity-90" alt="" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-6 text-center w-full h-full bg-[#FCFAF7]">
                                        <div className="w-full h-full flex flex-col justify-center items-center border border-[#E5E0D8] rounded-xl p-2">
                                            <span className="font-bold text-[#333] line-clamp-2 leading-tight text-lg" style={{ fontFamily: project.config.titleFont }}>
                                                {project.slides[0]?.text || 'Untitled'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="px-5 py-2 bg-white text-[#333] text-xs font-bold rounded-full shadow-lg transform scale-95 group-hover:scale-100 transition-transform">Редактировать</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <div>
                                    <h4 className="font-semibold text-[#333] text-sm line-clamp-1">{project.name}</h4>
                                    <p className="text-[10px] text-[#8C847C] mt-0.5">{new Date(project.timestamp).toLocaleDateString()}</p>
                                </div>
                                <button 
                                    onClick={(e) => onDeleteProject(project.id, e)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full text-[#D1CCC0] hover:bg-red-50 hover:text-red-400 transition-colors"
                                    title="Удалить"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>

      </div>

      <footer className="py-10 text-center text-xs text-[#8C847C]/60 mt-auto relative">
        <p>Сделано с заботой о визуале</p>
      </footer>
    </div>
  );
};

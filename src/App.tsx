import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DeferredSection } from './components/DeferredSection';
import { ContactPage } from './components/ContactPage';
import { ProcessPage, ServicesPage, TechnologiesPage, TestimonialsPage } from './components/Pages';
import { AboutPage as RedesignedAboutPage } from './components/AboutPage';
import { TeamPage as RedesignedTeamPage } from './components/TeamPage';
import { ProjectsPage as RedesignedProjectsPage } from './components/ProjectsPage';
import { GlassParams, PresetTheme } from './types';
import { SitePath } from './site';
import { PageReveal } from './components/PageReveal';

const GlassControlsPanel = lazy(() => import('./components/GlassControlsPanel').then(({ GlassControlsPanel: Component }) => ({ default: Component })));
const AboutSection = lazy(() => import('./components/AboutSection').then(({ AboutSection: Component }) => ({ default: Component })));
const ServicesSection = lazy(() => import('./components/ServicesSection').then(({ ServicesSection: Component }) => ({ default: Component })));
const TeamSection = lazy(() => import('./components/TeamSection').then(({ TeamSection: Component }) => ({ default: Component })));
const ProcessSection = lazy(() => import('./components/ProcessSection').then(({ ProcessSection: Component }) => ({ default: Component })));
const FeaturedWorkSection = lazy(() => import('./components/FeaturedWorkSection').then(({ FeaturedWorkSection: Component }) => ({ default: Component })));
const TestimonialsSection = lazy(() => import('./components/TestimonialsSection').then(({ TestimonialsSection: Component }) => ({ default: Component })));
const FaqContactSection = lazy(() => import('./components/FaqContactSection').then(({ FaqContactSection: Component }) => ({ default: Component })));
const Footer = lazy(() => import('./components/Footer').then(({ Footer: Component }) => ({ default: Component })));

const defaultParams: GlassParams = { shape: 'Square', segments: 64, photoScale: 1.7, bg: '#F2F2F2', envMap: 'Royal Esplanade', glassColor: '#ffffff', envIntensity: 1.2, internalReflect: 1.5, opacity: 1, transmission: 1, roughness: .05, thickness: 1.2, playing: true, globalSpeed: 1, orbitEnabled: true, mouseInteraction: true, yAxis: { mode: 'Spin', speed: .4, amp: .6 }, xAxis: { enabled: true, speed: .3, amp: .2 }, zAxis: { enabled: true, speed: .25, amp: .15 } };

export default function App() {
  const [params, setParams] = useState<GlassParams>(defaultParams);
  const [activePresetName, setActivePresetName] = useState('Code Crystal (Box)');
  const [controlsOpen, setControlsOpen] = useState(false);
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const [appReady, setAppReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');
  const navigate = useCallback((path: SitePath) => { if (window.location.pathname !== path) window.history.pushState({}, '', path); setCurrentPath(path); window.scrollTo(0, 0); }, []);
  useEffect(() => { const onPop = () => { setCurrentPath(window.location.pathname || '/'); window.scrollTo(0, 0); }; window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, []);
  useEffect(() => {
    let cancelled = false;
    const settle = async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      if (!cancelled) setAppReady(true);
    };
    settle();
    return () => { cancelled = true; };
  }, []);
  const handleUploadImage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = e => setCustomImageSrc(e.target?.result as string); reader.readAsDataURL(file); event.target.value = ''; }, []);
  const handleSelectPreset = useCallback((preset: PresetTheme) => { setActivePresetName(preset.name); setParams(previous => ({ ...previous, shape: preset.shape, glassColor: preset.glassColor, envMap: preset.envMap, internalReflect: preset.internalReflect, envIntensity: preset.envIntensity })); }, []);
  const page = currentPath.replace(/\/$/, '') || '/';
  const [homeMounted, setHomeMounted] = useState(() => page === '/');
  useEffect(() => { if (page === '/') setHomeMounted(true); }, [page]);
  const home = <><HeroSection params={params} customImageSrc={customImageSrc} onSceneReady={() => setSceneReady(true)}/><DeferredSection minHeight="680px"><Suspense fallback={null}><AboutSection/></Suspense></DeferredSection><DeferredSection minHeight="1900px"><Suspense fallback={null}><ServicesSection/></Suspense></DeferredSection><DeferredSection minHeight="1800px"><Suspense fallback={null}><TeamSection onNavigate={navigate}/></Suspense></DeferredSection><DeferredSection minHeight="280vh"><Suspense fallback={null}><ProcessSection/></Suspense></DeferredSection><DeferredSection minHeight="1600px"><Suspense fallback={null}><FeaturedWorkSection onNavigate={navigate}/></Suspense></DeferredSection><DeferredSection minHeight="900px"><Suspense fallback={null}><TestimonialsSection/></Suspense></DeferredSection><DeferredSection minHeight="900px"><Suspense fallback={null}><FaqContactSection/></Suspense></DeferredSection></>;
  const otherPage = page === '/about' ? <RedesignedAboutPage/> : page === '/team' ? <RedesignedTeamPage/> : page === '/projects' ? <RedesignedProjectsPage onNavigate={() => navigate('/contact')}/> : page === '/services' ? <ServicesPage/> : page === '/technologies' ? <TechnologiesPage/> : page === '/process' ? <ProcessPage/> : page === '/testimonials' ? <TestimonialsPage/> : page === '/contact' ? <ContactPage/> : null;
  return <div className="flex min-h-screen flex-col overflow-x-clip bg-[#F2F2F2] font-sans text-black selection:bg-black selection:text-white"><Header currentPath={page} onNavigate={navigate} onToggleControls={() => setControlsOpen(true)}/><main className="flex-1"><div hidden={page !== '/'}>{homeMounted ? home : null}</div>{otherPage}</main><Suspense fallback={null}><Footer onNavigate={navigate}/></Suspense>{controlsOpen && <Suspense fallback={null}><GlassControlsPanel isOpen={controlsOpen} onClose={() => setControlsOpen(false)} params={params} onChange={updated => setParams(previous => ({ ...previous, ...updated }))} onUploadImage={handleUploadImage} onReset={() => { setParams(defaultParams); setCustomImageSrc(null); setActivePresetName('Code Crystal (Box)'); }} activePresetName={activePresetName} onSelectPreset={handleSelectPreset}/></Suspense>}<PageReveal appReady={appReady} sceneReady={sceneReady}/></div>;
}


import React, { useState, useEffect, Suspense } from 'react';
import { AppProvider, useApp } from './store.tsx';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import AIChat from './components/AIChat.tsx';
import { Loader2, Sparkles } from 'lucide-react';

// Lazy loading for pages with extensions
const Home = React.lazy(() => import('./pages/Home.tsx'));
const Courses = React.lazy(() => import('./pages/Courses.tsx'));
const CourseDetail = React.lazy(() => import('./pages/CourseDetail.tsx'));
const Learn = React.lazy(() => import('./pages/Learn.tsx'));
const Auth = React.lazy(() => import('./pages/Auth.tsx'));
const Dashboard = React.lazy(() => import('./pages/Dashboard.tsx'));
const Admin = React.lazy(() => import('./pages/Admin.tsx'));
const Checkout = React.lazy(() => import('./pages/Checkout.tsx'));

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState<any>(null);
  const [minLoadingDone, setMinLoadingDone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { loading: storeLoading } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => setMinLoadingDone(true), 1500);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    return () => clearTimeout(timer);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const navigate = (page: string, params: any = null) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={navigate} />;
      case 'courses': return <Courses onNavigate={navigate} />;
      case 'course-detail': return <CourseDetail courseId={pageParams?.id} onNavigate={navigate} />;
      case 'learn': return <Learn courseId={pageParams?.id} onNavigate={navigate} />;
      case 'login': return <Auth mode="login" onNavigate={navigate} />;
      case 'register': return <Auth mode="register" onNavigate={navigate} />;
      case 'checkout': return <Checkout courseId={pageParams?.id} onNavigate={navigate} />;
      case 'dashboard': return <Dashboard onNavigate={navigate} />;
      case 'admin': return <Admin />;
      default: return <Home onNavigate={navigate} />;
    }
  };

  const isLoading = storeLoading || !minLoadingDone;

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="relative flex flex-col items-center gap-8">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-[0_0_50px_rgba(79,70,229,0.3)] animate-float">
            A
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-black text-white tracking-[0.2em]">ACADEMIA ALBERT</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-500"/> Excelência em Moçambique
            </p>
          </div>
          <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-indigo-500 animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
        <style>{`
          @keyframes loading {
            0% { width: 0%; transform: translateX(-100%); }
            50% { width: 100%; transform: translateX(0); }
            100% { width: 0%; transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar onNavigate={navigate} onInstall={deferredPrompt ? handleInstallClick : undefined} />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="h-[60vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        }>
          {renderPage()}
        </Suspense>
      </main>
      <Footer />
      <AIChat />
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;

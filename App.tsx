import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import ContentCard from './components/ContentCard';
import { User, UserRole, ContentItem } from './types';
import { getStoredContent } from './services/store';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [content, setContent] = useState<ContentItem[]>([]);

  // Load content from local storage (mock db)
  useEffect(() => {
    const loadData = () => {
      setContent(getStoredContent());
    };
    loadData();
    // Poll for updates since we're using local storage across components
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (username: string, role: UserRole) => {
    setUser({ username, role });
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Filter helpers
  const newsContent = content.filter(c => c.category === 'NEWS');
  const videoContent = content.filter(c => c.category === 'VIDEO');
  const newsDisplay = newsContent.length ? Array.from({ length: 6 }, (_, i) => newsContent[i % newsContent.length]) : [];
  const videoDisplay = videoContent.length ? Array.from({ length: 6 }, (_, i) => videoContent[i % videoContent.length]) : [];

  // Social Media Data with SVG Paths
  const SOCIAL_LINKS = [
    { 
      name: 'Facebook', 
      url: '#', 
      path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
      viewBox: '0 0 24 24' 
    },
    { 
      name: 'LinkedIn', 
      url: '#', 
      path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z',
      viewBox: '0 0 24 24'
    },
    { 
      name: 'YouTube', 
      url: '#', 
      path: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 6.42v11.16a29 29 0 0 0 .46 2.42 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-2.42V6.42a29 29 0 0 0-.46-2z M9.75 15.02l5.75-3.27-5.75-3.27z',
      viewBox: '0 0 24 24'
    },
    { 
      name: 'X', 
      url: '#', 
      path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
      viewBox: '0 0 24 24'
    },
    { 
      name: 'TikTok', 
      url: '#', 
      path: 'M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.835-4-2.018V12c0 2.864-2.366 5-5.28 5C3.364 17 1.267 15.454 1 13.5c-.208-1.527.732-3.104 2.481-3.834C3.665 9.59 3.83 9.575 4 9.575V11.5c-.066.006-.137.015-.212.037C3.252 11.69 3 12.075 3 12.5c0 .713.784 1.5 2.28 1.5 1.624 0 2.72-1.06 2.72-3.25V0z',
      viewBox: '0 0 24 24'
    }
  ];

  return (
    <Router>
      <div className="min-h-screen bg-transparent text-gray-100 font-sans selection:bg-geek-primary selection:text-white flex flex-col">
        <Navbar 
          user={user} 
          onLoginClick={() => setIsAuthOpen(true)} 
          onLogout={handleLogout} 
        />
        
        <main className="flex-grow pb-12">
          <Routes>
            <Route path="/" element={
              <Home 
                content={content} 
                user={user} 
                onRequestLogin={() => setIsAuthOpen(true)} 
              />
            } />
            
            <Route path="/news" element={
              <div className="max-w-7xl mx-auto px-4 py-8">
                 <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-geek-primary pl-4 bg-black/30 p-4 rounded-r-lg backdrop-blur-sm">Todas as Notícias</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {newsDisplay.map((item, idx) => (
                   <div key={`${item.id}-${idx}`}>
                       <ContentCard item={item} user={user} onRequestLogin={() => setIsAuthOpen(true)} />
                   </div>
                 ))}
                 </div>
              </div>
            } />
            
            <Route path="/videos" element={
              <div className="max-w-7xl mx-auto px-4 py-8">
                 <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-geek-secondary pl-4 bg-black/30 p-4 rounded-r-lg backdrop-blur-sm">Galeria de Vídeos</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {videoDisplay.map((item, idx) => (
                   <div key={`${item.id}-${idx}`}>
                       <ContentCard item={item} user={user} onRequestLogin={() => setIsAuthOpen(true)} />
                   </div>
                 ))}
                 </div>
              </div>
            } />

            <Route path="/admin" element={
              user?.role === UserRole.ADMIN ? (
                <AdminPanel />
              ) : (
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="text-center bg-geek-card/90 p-8 rounded-xl border border-red-500/50 backdrop-blur-md">
                        <h2 className="text-2xl text-red-500 font-bold mb-2">Acesso Negado</h2>
                        <p className="text-gray-400">Você precisa ser um administrador (admin/admin).</p>
                    </div>
                </div>
              )
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onLogin={handleLogin} 
        />
        
        <footer className="bg-geek-card/90 backdrop-blur-md border-t border-gray-800 py-10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-gray-400 text-sm text-center md:text-left">
                    <p className="font-semibold text-white mb-1">GeekNews</p>
                    <p>&copy; 2024. O ponto de encontro do multiverso.</p>
                </div>
                
                <div className="flex items-center gap-6">
                  {SOCIAL_LINKS.map((social) => (
                    <a 
                      key={social.name} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-geek-primary transition transform hover:scale-110"
                      title={social.name}
                    >
                      <svg 
                        viewBox={social.viewBox} 
                        width="24" 
                        height="24" 
                        fill="currentColor" 
                        stroke="none"
                      >
                        <path d={social.path} />
                      </svg>
                    </a>
                  ))}
                </div>
            </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
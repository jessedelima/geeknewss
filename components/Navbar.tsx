import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { User, UserRole } from '../types';
import { Menu, X, LogOut } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

// Generated SVG Data URI for a "GeekNews" logo to simulate an image file
const LOGO_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCAyMDAgNTAiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOGI1Y2Y2O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2Y0M2Y1ZTtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48dGV4dCB4PSIxMCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iOTAwIiBmb250LXNpemU9IjMyIiBmaWxsPSJ1cmwoI2dyYWQxKSIgc3R5bGU9InRleHQtc2hhZG93OiAwIDAgMTBweCByZ2JhKDEzOSwgOTIsIDI0NiwgMC41KSI+R2Vla05ld3M8L3RleHQ+PHBhdGggZD0iTTE1MCAxMCBMIDE4MCAxMCBMIDE5MCAyMCIgc3Ryb2tlPSIjOGI1Y2Y2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjE5MCIgY3k9IjIwIiByPSIzIiBmaWxsPSIjZjQzZjVlIiAvPjwvc3ZnPg==";

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? "text-geek-primary font-bold" : "text-gray-300 hover:text-white transition";

  return (
    <nav className="bg-geek-dark/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              {/* Logo Image */}
              <img 
                src={LOGO_URL} 
                alt="GeekNews Logo" 
                className="h-10 md:h-12 w-auto object-contain" 
              />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className={isActive('/')}>Home</Link>
                <Link to="/news" className={isActive('/news')}>Notícias</Link>
                <Link to="/videos" className={isActive('/videos')}>Vídeos</Link>
                {user?.role === UserRole.ADMIN && (
                   <Link to="/admin" className={`${isActive('/admin')} text-yellow-400`}>Admin Panel</Link>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Olá, <span className="text-white font-semibold">{user.username}</span></span>
                <button 
                  onClick={onLogout}
                  className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-red-400 transition"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-geek-primary hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-violet-900/20"
              >
                Login
              </button>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-geek-card/95 backdrop-blur-xl border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">Home</Link>
            <Link to="/news" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Notícias</Link>
            <Link to="/videos" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Vídeos</Link>
            {user?.role === UserRole.ADMIN && (
               <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-yellow-400 hover:bg-gray-700">Admin</Link>
            )}
            <div className="border-t border-gray-700 mt-4 pt-4">
              {user ? (
                 <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full text-left px-3 py-2 text-red-400 font-medium">Sair</button>
              ) : (
                 <button onClick={() => { onLoginClick(); setIsOpen(false); }} className="w-full text-left px-3 py-2 text-geek-primary font-medium">Fazer Login</button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
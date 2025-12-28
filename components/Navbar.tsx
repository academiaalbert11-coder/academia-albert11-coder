
import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { Sun, Moon, Menu, X, Download, LayoutDashboard, Settings, LogOut, ChevronDown } from 'lucide-react';
import { UserRole } from '../types';

const Navbar: React.FC<{ onNavigate: (page: string) => void, onInstall?: () => void }> = ({ onNavigate, onInstall }) => {
  const { user, theme, toggleTheme, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className={`glass rounded-3xl transition-all duration-500 px-6 h-20 flex justify-between items-center ${scrolled ? 'shadow-xl' : 'shadow-none'}`}>
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl mr-3 group-hover:rotate-12 transition-transform">A</div>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">Academia Albert</span>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            <button onClick={() => onNavigate('home')} className="px-5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-bold transition-colors">Início</button>
            <button onClick={() => onNavigate('courses')} className="px-5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-bold transition-colors">Cursos</button>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

            <button onClick={toggleTheme} className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-colors">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {onInstall && (
              <button 
                onClick={onInstall}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                <Download size={16} /> Instalar App
              </button>
            )}

            {user ? (
              <div className="relative ml-4">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)} 
                  className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-2xl transition-all"
                >
                  <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`} alt="avatar" className="w-8 h-8 rounded-lg" />
                  <span className="text-sm font-black">{user.name}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-4 w-56 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 py-3 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <button onClick={() => { onNavigate('dashboard'); setShowDropdown(false); }} className="w-full text-left px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-3 text-slate-900 dark:text-white font-bold transition-colors">
                      <LayoutDashboard size={18} className="text-indigo-500" />
                      <span>Meu Painel</span>
                    </button>
                    {user.role === UserRole.ADMIN && (
                      <button onClick={() => { onNavigate('admin'); setShowDropdown(false); }} className="w-full text-left px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-3 text-slate-900 dark:text-white font-bold transition-colors">
                        <Settings size={18} className="text-purple-500" />
                        <span>Administração</span>
                      </button>
                    )}
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-4"></div>
                    <button onClick={() => { logout(); onNavigate('home'); setShowDropdown(false); }} className="w-full text-left px-5 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 text-red-600 font-bold transition-colors">
                      <LogOut size={18} />
                      <span>Terminar Sessão</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <button onClick={() => onNavigate('login')} className="text-indigo-600 font-black px-6 py-3 hover:bg-indigo-50 rounded-xl transition-all">Entrar</button>
                <button onClick={() => onNavigate('register')} className="bg-slate-900 dark:bg-slate-700 text-white px-8 py-3 rounded-xl font-black hover:bg-black dark:hover:bg-slate-600 transition-all shadow-lg active:scale-95">Registar</button>
              </div>
            )}
          </div>

          <div className="lg:hidden flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 text-slate-900 dark:text-white">
              {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="w-12 h-12 glass rounded-xl flex items-center justify-center text-slate-900 dark:text-white">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[90] bg-white dark:bg-slate-950 pt-32 px-6 space-y-6 animate-in slide-in-from-right duration-300 overflow-y-auto">
          <div className="space-y-4">
            <button onClick={() => { onNavigate('home'); setIsOpen(false); }} className="w-full text-left p-6 text-2xl font-black bg-slate-50 dark:bg-slate-900 rounded-3xl">Início</button>
            <button onClick={() => { onNavigate('courses'); setIsOpen(false); }} className="w-full text-left p-6 text-2xl font-black bg-slate-50 dark:bg-slate-900 rounded-3xl">Cursos</button>
            {onInstall && (
              <button onClick={() => { onInstall(); setIsOpen(false); }} className="w-full text-left p-6 text-2xl font-black bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-3xl flex items-center gap-3">
                <Download size={24}/> Instalar App
              </button>
            )}
          </div>
          
          <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

          {!user ? (
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { onNavigate('login'); setIsOpen(false); }} className="p-6 bg-slate-100 dark:bg-slate-900 rounded-3xl font-black">Entrar</button>
              <button onClick={() => { onNavigate('register'); setIsOpen(false); }} className="p-6 bg-indigo-600 text-white rounded-3xl font-black">Registar</button>
            </div>
          ) : (
            <div className="space-y-4">
              <button onClick={() => { onNavigate('dashboard'); setIsOpen(false); }} className="w-full text-left p-6 text-2xl font-black bg-slate-50 dark:bg-slate-900 rounded-3xl">Meu Painel</button>
              <button onClick={() => { logout(); onNavigate('home'); setIsOpen(false); }} className="w-full text-left p-6 text-2xl font-black text-red-600 bg-red-50 dark:bg-red-900/10 rounded-3xl">Terminar Sessão</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

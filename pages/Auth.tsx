
import React, { useState } from 'react';
import { useApp, supabase, ADMIN_EMAIL, withTimeout } from '../store';
import { Mail, Lock, AlertCircle, Loader2, Zap, CheckCircle2 } from 'lucide-react';
import { UserRole, User } from '../types';

interface AuthProps {
  mode: 'login' | 'register';
  onNavigate: (page: string) => void;
}

const Auth: React.FC<AuthProps> = ({ mode, onNavigate }) => {
  const { setUser, fetchUserProfile, refreshData } = useApp();
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setLoading(true);
    
    try {
      if (mode === 'register') {
        const { data, error: signUpError } = await withTimeout<any>(supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { first_name: formData.name, last_name: formData.lastName }
          }
        }));
        
        if (signUpError) throw signUpError;

        if (data.user) {
          const profile = await fetchUserProfile(data.user.id, formData.email);
          if (profile) setUser(profile);

          if (data.session) {
            onNavigate(profile?.role === UserRole.ADMIN ? 'admin' : 'dashboard');
          } else {
            setInfoMessage('Registo feito! Verifique o e-mail ou tente entrar.');
          }
        }
      } else {
        const { data, error: signInError } = await withTimeout<any>(supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        }));
        
        if (signInError) throw signInError;

        if (data.user) {
          const profile = await fetchUserProfile(data.user.id, data.user.email);
          if (profile) {
            setUser(profile);
            await refreshData();
            setTimeout(() => {
              onNavigate(profile.role === UserRole.ADMIN ? 'admin' : 'dashboard');
            }, 100);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-4 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl outline-none border-2 border-transparent focus:border-indigo-600 font-bold transition-all placeholder:text-slate-400";

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-[450px] bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-700">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">
            {mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </h2>
          <p className="text-sm text-slate-500">Academia Albert - Moçambique</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-100">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {infoMessage && (
          <div className="mb-6 p-4 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center gap-3 text-xs font-bold border border-indigo-100">
            <CheckCircle2 size={18} /> {infoMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="Nome" className={inputClass} disabled={loading} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="Apelido" className={inputClass} disabled={loading} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
          )}
          <input required type="email" placeholder="E-mail" className={inputClass} disabled={loading} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input required type="password" placeholder="Senha" className={inputClass} disabled={loading} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          
          <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : mode === 'login' ? 'Entrar Agora' : 'Registar'}
          </button>
        </form>
        
        <button onClick={() => onNavigate(mode === 'login' ? 'register' : 'login')} className="w-full mt-6 text-center text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
          {mode === 'login' ? 'Não tem conta? Registe-se' : 'Já tem conta? Entre aqui'}
        </button>
      </div>
    </div>
  );
};

export default Auth;

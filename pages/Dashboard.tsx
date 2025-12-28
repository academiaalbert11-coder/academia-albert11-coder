
import React from 'react';
import { useApp } from '../store';
import { BookOpen, Award, FileText, Clock, ChevronRight, TrendingUp, Play, Download, ExternalLink, ShieldCheck, Cloud } from 'lucide-react';

const Dashboard: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { user, courses, isLocalMode } = useApp();

  if (!user) {
    onNavigate('login');
    return null;
  }

  const enrolledCourses = user.enrollments.map(e => ({
    ...e,
    course: courses.find(c => c.id === e.courseId)
  })).filter(e => e.course);

  const completedCount = user.enrollments.filter(e => e.progress === 100).length;

  const stats = [
    { label: 'Cursos Inscritos', value: enrolledCourses.length, icon: BookOpen, color: 'bg-blue-600' },
    { label: 'Certificados', value: completedCount, icon: Award, color: 'bg-indigo-600' },
    { label: 'Horas Estudadas', value: '12h', icon: Clock, color: 'bg-emerald-600' },
    { label: 'Nível Atual', value: user.role === 'ADMIN' ? 'Administrador' : 'Estudante Gold', icon: TrendingUp, color: 'bg-amber-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&size=128&background=6366f1&color=fff`} className="w-24 h-24 rounded-[2rem] object-cover shadow-2xl border-4 border-white dark:border-slate-700 transform group-hover:rotate-3 transition-transform" alt="Profile" />
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg ring-4 ring-white dark:ring-slate-800">
              <Award size={20} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <h1 className="text-3xl font-black text-slate-900 dark:text-white">Olá, {user.name}!</h1>
               {isLocalMode ? (
                 <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black">
                   <Cloud size={10}/> OFFLINE (SALVO NO PC)
                 </span>
               ) : (
                 <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black">
                   <ShieldCheck size={10}/> SINCRONIZADO NA NUVEM
                 </span>
               )}
            </div>
            <p className="text-slate-500 font-medium">Sua conta Albert está segura e monitorada.</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={() => onNavigate('courses')} className="flex-1 md:flex-none px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95">
            Novos Cursos
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${s.color} p-4 rounded-2xl text-white shadow-lg`}>
              <s.icon size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Meus Cursos em Andamento</h2>
            <div className="h-px flex-grow mx-6 bg-slate-100 dark:bg-slate-800"></div>
          </div>
          
          <div className="grid gap-6">
            {enrolledCourses.length > 0 ? enrolledCourses.map(enr => (
              <div key={enr.courseId} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 group hover:border-indigo-500 transition-all">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative shrink-0">
                    <img src={enr.course?.bannerUrl} className="w-full sm:w-40 h-32 rounded-[1.5rem] object-cover" alt="Course" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors rounded-[1.5rem]"></div>
                  </div>
                  <div className="flex-grow space-y-4 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-black group-hover:text-indigo-600 transition-colors">{enr.course?.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500">{enr.course?.category}</span>
                          <span className="text-xs text-slate-400">• {enr.course?.lessons.length} Aulas</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-indigo-600">{enr.progress}%</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Concluído</div>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-100 dark:border-slate-700">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.3)]" style={{ width: `${enr.progress}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                       <button onClick={() => onNavigate('learn', { id: enr.courseId })} className="flex items-center gap-2 text-white font-black text-xs bg-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/10">
                        ESTUDAR AGORA <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <BookOpen size={40} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sua jornada continua</h3>
                <p className="text-slate-500 max-w-xs mx-auto mb-8">Nenhum curso matriculado. Explore o catálogo para começar!</p>
                <button onClick={() => onNavigate('courses')} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black">Explorar Catálogo</button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-black">Certificados</h2>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700 space-y-6">
             {user.enrollments.filter(e => e.progress === 100).length > 0 ? (
               user.enrollments.filter(e => e.progress === 100).map(e => (
                 <div key={e.courseId} className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                        <Award size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-black truncate max-w-[120px]">{courses.find(c => c.id === e.courseId)?.title}</div>
                        <div className="text-[10px] text-slate-500">Emitido em {new Date(e.enrollmentDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <button className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"><Download size={18} /></button>
                 </div>
               ))
             ) : (
               <div className="text-center py-8">
                 <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                   <Award size={24} className="text-slate-300" />
                 </div>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Nenhum certificado disponível</p>
                 <p className="text-[10px] text-slate-500 mt-2">Complete 100% de um curso para desbloquear.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
